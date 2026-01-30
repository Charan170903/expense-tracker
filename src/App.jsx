import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Header from './components/Header/Header';
import BalanceCard from './components/BalanceCard/BalanceCard';
import SecondaryStats from './components/SecondaryStats/SecondaryStats';
import AddTransactionAction from './components/AddTransactionAction/AddTransactionAction';
import TransactionsList from './components/TransactionsList/TransactionsList';
import AddTransactionModal from './components/AddTransactionModal/AddTransactionModal';
import SavingsStats from './components/SavingsStats/SavingsStats';
import DailyInsight from './components/DailyInsight/DailyInsight';
import Login from './components/Login/Login'; // Import Login
import { useAuth } from './context/AuthContext'; // Import Auth
import { transactionService } from './services/api'; // Import API
import { detectSubscriptions } from './utils/subscriptionDetector';
import { detectCategoryDrift, detectMicroLeaks, getDailyInsight } from './utils/insightEngine';
import { getStoredAnchors, archivePreviousPeriods, findActiveMemoryAnchor } from './utils/memoryArchivist';
import './App.css';

dayjs.extend(customParseFormat);

function App() {
  const { user, loading: authLoading } = useAuth(); // Auth hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [dataLoading, setDataLoading] = useState(false); // Data loading state
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MMM YYYY'));
  const [selectedRange, setSelectedRange] = useState('month');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [memoryAnchors, setMemoryAnchors] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  /**
   * Fetch transactions when user logs in
   */
  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        setDataLoading(true);
        try {
          const data = await transactionService.getAll();
          // Transform API data to match frontend structure (if needed)
          // Backend returns _id, frontend uses id. Map it.
          // Also date in backend is occurredAt, frontend uses date.
          const mappedData = data.map(t => ({
            id: t._id,
            title: t.title,
            amount: t.amount,
            type: t.type,
            category: t.category,
            date: dayjs(t.occurredAt).format('YYYY-MM-DD')
          }));
          setTransactions(mappedData);

          // Legacy anchor logic - kept local for now
          // Could move to backend later
          const stored = getStoredAnchors();
          const updated = archivePreviousPeriods(mappedData, stored);
          setMemoryAnchors(updated);
        } catch (err) {
          console.error("Failed to fetch transactions", err);
        } finally {
          setDataLoading(false);
        }
      } else {
        setTransactions([]);
      }
    };

    fetchTransactions();
  }, [user]);

  // Removed localStorage persistence for transactions



  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
  }, [transactions]);

  /**
   * Applies heuristic subscription detection to the sorted transaction set.
   */
  const processedTransactions = useMemo(() => {
    const detectedIds = detectSubscriptions(sortedTransactions);
    return sortedTransactions.map(t => {
      if (detectedIds.has(t.id) && !t.subscriptionStatus) {
        return { ...t, subscriptionStatus: 'detected' };
      }
      return t;
    });
  }, [sortedTransactions]);

  /**
   * Unified filtering logic. Handles static months, relative ranges (rolling windows), 
   * and 'all time' views relative to the selected anchor month.
   */
  const filteredTransactions = useMemo(() => {
    let rangeTransactions = [];
    const anchorDate = dayjs(selectedMonth, 'MMM YYYY');

    if (selectedRange === 'month') {
      rangeTransactions = processedTransactions.filter(t =>
        dayjs(t.date).format('MMM YYYY') === selectedMonth
      );
    } else if (selectedRange === 'all') {
      rangeTransactions = processedTransactions;
    } else {
      const monthsToSubtract = selectedRange === '3months' ? 2 : selectedRange === '6months' ? 5 : 11;
      const startDate = anchorDate.subtract(monthsToSubtract, 'month').startOf('month');
      const endDate = anchorDate.endOf('month');

      rangeTransactions = processedTransactions.filter(t => {
        const tDate = dayjs(t.date);
        return (tDate.isAfter(startDate) || tDate.isSame(startDate)) &&
          (tDate.isBefore(endDate) || tDate.isSame(endDate));
      });
    }
    return rangeTransactions;
  }, [processedTransactions, selectedMonth, selectedRange]);

  const savingsData = useMemo(() => {
    const totals = filteredTransactions.reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });

    const savings = totals.income - totals.expense;
    const rate = totals.income > 0 ? Math.round((savings / totals.income) * 100) : 0;

    return {
      totalIncome: totals.income,
      totalExpense: totals.expense,
      totalSavings: savings,
      savingsRate: rate,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const periodTotals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') acc.income += transaction.amount;
        else acc.expense += transaction.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredTransactions]);

  const balance = periodTotals.income - periodTotals.expense;

  const activeSubscriptionsCount = filteredTransactions.filter(
    t => t.subscriptionStatus === 'confirmed' || t.subscriptionStatus === 'detected'
  ).length;

  /**
   * Calculates calendar days without expense transactions within the active filter range.
   * Logic caps the range end at 'today' for active/future periods.
   */
  const noSpendDaysCount = useMemo(() => {
    const anchorDate = dayjs(selectedMonth, 'MMM YYYY');
    const today = dayjs();

    let startDate, endDate;

    if (selectedRange === 'month') {
      startDate = anchorDate.startOf('month');
      endDate = anchorDate.endOf('month');
    } else if (selectedRange === 'all') {
      if (sortedTransactions.length === 0) return 0;
      startDate = dayjs(sortedTransactions[sortedTransactions.length - 1].date).startOf('day');
      endDate = today.endOf('day');
    } else {
      const monthsToSubtract = selectedRange === '3months' ? 2 : selectedRange === '6months' ? 5 : 11;
      startDate = anchorDate.subtract(monthsToSubtract, 'month').startOf('month');
      endDate = anchorDate.endOf('month');
    }

    if (endDate.isAfter(today)) {
      endDate = today;
    }

    if (startDate.isAfter(today)) return 0;

    const totalDays = endDate.diff(startDate, 'day') + 1;
    const expenseDates = new Set(
      filteredTransactions
        .filter(t => t.type === 'expense')
        .map(t => dayjs(t.date).format('YYYY-MM-DD'))
    );

    return Math.max(0, totalDays - expenseDates.size);
  }, [filteredTransactions, selectedMonth, selectedRange, sortedTransactions]);

  const driftInsights = useMemo(() => {
    return detectCategoryDrift(transactions, selectedMonth);
  }, [transactions, selectedMonth]);

  const microLeakInsight = useMemo(() => {
    return detectMicroLeaks(transactions);
  }, [transactions]);

  const dailyInsight = useMemo(() => {
    return getDailyInsight(driftInsights, microLeakInsight, transactions, selectedMonth);
  }, [driftInsights, microLeakInsight, transactions, selectedMonth]);

  const activeMemoryAnchor = useMemo(() => {
    return findActiveMemoryAnchor(filteredTransactions, memoryAnchors);
  }, [filteredTransactions, memoryAnchors]);

  /**
   * Generates feedback for the current month's closing window (last 7 days).
   */
  const eomAwarenessData = useMemo(() => {
    const today = dayjs();
    const anchorDate = dayjs(selectedMonth, 'MMM YYYY');

    if (!today.isSame(anchorDate, 'month')) return null;

    const lastDay = today.endOf('month').date();
    const currentDay = today.date();
    const daysLeft = lastDay - currentDay + 1;

    if (daysLeft <= 7 && daysLeft > 0) {
      return {
        daysLeft,
        isLastDay: daysLeft === 1
      };
    }
    return null;
  }, [selectedMonth]);

  /**
   * Derives a confidence state (0-100 score) based on:
   * 1. Savings Rate (40%)
   * 2. Financial Runway (30%) - Daily budget vs actual spend velocity
   * 3. Recent Expense Velocity (30%) - 7-day trend vs period average
   */
  const confidenceData = useMemo(() => {
    if (filteredTransactions.length === 0) return { state: 'stable', text: 'Position is currently stable' };

    const today = dayjs();
    const anchorDate = dayjs(selectedMonth, 'MMM YYYY');
    const isCurrentMonth = today.isSame(anchorDate, 'month');

    const sRate = savingsData.savingsRate;
    const savingsScore = Math.max(0, Math.min(sRate * 2, 40));

    let runwayScore = 20;
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (isCurrentMonth && balance > 0) {
      const daysLeft = today.endOf('month').date() - today.date() + 1;
      const dailyAllowable = balance / daysLeft;
      const daysElapsed = today.date();
      const avgDailySpend = totalExp / daysElapsed || 1;

      const runwayRatio = dailyAllowable / avgDailySpend;
      runwayScore = Math.max(0, Math.min(runwayRatio * 15, 30));
    } else if (balance <= 0) {
      runwayScore = 0;
    }

    const recentExpenses = filteredTransactions.filter(t =>
      t.type === 'expense' && dayjs(t.date).isAfter(today.subtract(7, 'day'))
    );
    const recentTotal = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
    const recentDaily = recentTotal / 7;

    const periodDays = selectedRange === 'month' ? today.date() : (selectedRange === '3months' ? 90 : 180);
    const periodDaily = totalExp / periodDays || 1;

    let velocityScore = 30;
    if (recentDaily > periodDaily * 1.5) velocityScore = 0;
    else if (recentDaily > periodDaily * 1.2) velocityScore = 15;

    const totalScore = savingsScore + runwayScore + velocityScore;

    if (totalScore >= 65) return { state: 'stable', text: 'Position is currently stable' };
    if (totalScore >= 35) return { state: 'stretched', text: 'Budget is slightly stretched' };
    return { state: 'attention', text: 'Patterns require closer attention' };
  }, [savingsData, balance, filteredTransactions, selectedMonth, selectedRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddTransaction = async (transaction) => {
    try {
      // Backend expects: title, amount, category, type, occurredAt
      const payload = {
        title: transaction.title,
        amount: Number(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        occurredAt: transaction.date // frontend passes 'YYYY-MM-DD' which is valid date string
      };

      const savedTx = await transactionService.create(payload);

      // Map back to frontend format
      const newTransaction = {
        id: savedTx._id,
        title: savedTx.title,
        amount: savedTx.amount,
        type: savedTx.type,
        category: savedTx.category,
        date: dayjs(savedTx.occurredAt).format('YYYY-MM-DD'),
        subscriptionStatus: null
      };

      setTransactions([newTransaction, ...transactions]);
      const monthOfTransaction = dayjs(transaction.date).format('MMM YYYY');
      setSelectedMonth(monthOfTransaction);
    } catch (err) {
      console.error("Failed to add transaction", err);
      alert("Failed to save transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        setTransactions(transactions.filter((t) => t.id !== id));
      } catch (err) {
        console.error("Failed to delete transaction", err);
        alert("Failed to delete transaction");
      }
    }
  };

  const handleUpdateSubscriptionStatus = (id, status) => {
    setTransactions(prev => prev.map(t =>
      t.id === id ? { ...t, subscriptionStatus: status } : t
    ));
  };


  // If auth is loading, show nothing or spinner
  if (authLoading) return <div className="loading-screen">Loading...</div>;

  // If no user, show login
  if (!user) return <Login theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <div className="app">
      <div className="app__container">
        <Header
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          transactions={transactions}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="app__main">
          <div className="dashboard-grid">
            <div className="dashboard-col dashboard-col--left">
              <BalanceCard
                balance={balance}
                eomAwareness={eomAwarenessData}
                confidence={confidenceData}
              />
              <SecondaryStats
                income={periodTotals.income}
                expense={periodTotals.expense}
                activeSubscriptions={activeSubscriptionsCount}
                noSpendDays={noSpendDaysCount}
              />
            </div>

            <div className="dashboard-col dashboard-col--right">
              <DailyInsight insight={dailyInsight} memoryAnchor={activeMemoryAnchor} />
              <SavingsStats
                savingsData={savingsData}
                selectedRange={selectedRange}
                driftInsights={driftInsights}
                microLeakInsight={microLeakInsight}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>

          <div className="action-zone">
            <AddTransactionAction onAddClick={() => setIsModalOpen(true)} />
          </div>

          <div className="transactions-container">
            <TransactionsList
              transactions={filteredTransactions}
              onDelete={handleDeleteTransaction}
              onUpdateSubscription={handleUpdateSubscriptionStatus}
              isLoading={dataLoading}
            />
          </div>
        </main>

        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddTransaction}
          currentFilteredTransactions={filteredTransactions}
          currentStats={savingsData}
        />
      </div>
    </div>
  );
}

export default App;