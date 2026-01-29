import dayjs from 'dayjs';

/**
 * Detects significant categorical spending increases (>30%) vs previous month.
 */
export const detectCategoryDrift = (transactions, targetMonthStr) => {
    const targetMonth = dayjs(targetMonthStr, 'MMM YYYY');
    const prevMonth = targetMonth.subtract(1, 'month');
    const prevMonthStr = prevMonth.format('MMM YYYY');

    const getCategoryTotals = (monthStr) => {
        return transactions
            .filter(t => t.type === 'expense' && dayjs(t.date).format('MMM YYYY') === monthStr)
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
    };

    const currentTotals = getCategoryTotals(targetMonthStr);
    const prevTotals = getCategoryTotals(prevMonthStr);

    const insights = [];

    const categoryLabels = {
        food: 'Food & Dining',
        transport: 'Transportation',
        shopping: 'Shopping',
        bills: 'Bills & Utilities',
        entertainment: 'Entertainment',
        health: 'Healthcare',
        education: 'Education',
        other: 'Other'
    };

    Object.keys(currentTotals).forEach(cat => {
        const current = currentTotals[cat];
        const prev = prevTotals[cat] || 0;

        if (prev > 0) {
            const percentIncrease = ((current - prev) / prev) * 100;

            if (percentIncrease > 30) {
                insights.push({
                    category: cat,
                    label: categoryLabels[cat] || cat,
                    percent: Math.round(percentIncrease),
                    current,
                    prev
                });
            }
        }
    });

    return insights;
};

/**
 * Detects frequent small expenses (₹50-₹200) accumulating significantly.
 */
export const detectMicroLeaks = (transactions) => {
    const today = dayjs();
    const startOfWeek = today.startOf('week');
    const startOfMonth = today.startOf('month');

    const microExpenses = transactions.filter(t =>
        t.type === 'expense' &&
        t.amount >= 50 &&
        t.amount <= 200
    );

    const weeklyMicro = microExpenses.filter(t => dayjs(t.date).isAfter(startOfWeek) || dayjs(t.date).isSame(startOfWeek));
    const monthlyMicro = microExpenses.filter(t => dayjs(t.date).isAfter(startOfMonth) || dayjs(t.date).isSame(startOfMonth));

    const weeklyTotal = weeklyMicro.reduce((sum, t) => sum + t.amount, 0);
    const monthlyTotal = monthlyMicro.reduce((sum, t) => sum + t.amount, 0);

    if (weeklyTotal >= 500) {
        return {
            type: 'weekly',
            total: weeklyTotal,
            count: weeklyMicro.length,
            message: `You've spent ₹${weeklyTotal} on ${weeklyMicro.length} small purchases this week. These small leaks add up quickly.`
        };
    }

    if (monthlyTotal >= 1500) {
        return {
            type: 'monthly',
            total: monthlyTotal,
            count: monthlyMicro.length,
            message: `Small daily expenses reached ₹${monthlyTotal} this month (${monthlyMicro.length} items). Consider if some could be avoided.`
        };
    }

    return null;
};

const financialTips = [
    "Tracking every expense, no matter how small, is the first step to financial freedom.",
    "Consider the '50/30/20' rule: 50% Needs, 30% Wants, and 20% Savings.",
    "Automating your savings ensures you pay yourself first every month.",
    "Before an impulse purchase, wait 24 hours. Most of the time, the urge passes.",
    "Small changes in daily habits, like brewing coffee at home, can save thousands annually.",
    "Your net worth is more important than your salary. Focus on assets, not just income.",
    "Emergency funds are for peace of mind, not just for emergencies.",
    "Reviewing your subscriptions monthly can catch 'zombie' payments for services you no longer use.",
    "The best investment you can make is in your own financial education.",
    "Compound interest is the eighth wonder of the world. Start saving early."
];

/**
 * Selects the most relevant insight based on severity weights.
 * Selection is deterministic based on the current date.
 */
export const getDailyInsight = (driftInsights, microLeakInsight, transactions, currentMonthStr) => {
    const today = dayjs();
    const todayStr = today.format('YYYY-MM-DD');
    const potentialInsights = [];

    const recentSubscriptions = transactions.filter(t =>
        (t.subscriptionStatus === 'confirmed' || t.subscriptionStatus === 'detected') &&
        dayjs(t.createdAt).isAfter(today.subtract(7, 'day'))
    );
    if (recentSubscriptions.length > 0) {
        potentialInsights.push({
            type: 'subscription',
            priority: 80,
            message: `New subscription activity detected recently. Periodic review prevents "zombie" costs.`
        });
    }

    const currentMonth = dayjs(currentMonthStr, 'MMM YYYY');
    const prevMonthStr = currentMonth.subtract(1, 'month').format('MMM YYYY');

    const getPeriodSavings = (mStr) => {
        const periodTrans = transactions.filter(t => dayjs(t.date).format('MMM YYYY') === mStr);
        const totals = periodTrans.reduce((acc, t) => {
            if (t.type === 'income') acc.income += t.amount;
            else acc.expense += t.amount;
            return acc;
        }, { income: 0, expense: 0 });
        return totals.income > 0 ? ((totals.income - totals.expense) / totals.income) * 100 : 0;
    };

    const currentRate = getPeriodSavings(currentMonthStr);
    const prevRate = getPeriodSavings(prevMonthStr);

    if (currentRate < prevRate - 5) {
        potentialInsights.push({
            type: 'decline',
            priority: 70 + (prevRate - currentRate),
            message: `Savings rate is down compared to last month. Consider a quick audit of non-essential costs.`
        });
    }

    if (microLeakInsight) {
        const severityBonus = Math.min(20, Math.floor(microLeakInsight.total / 100));
        potentialInsights.push({
            type: 'leak',
            priority: 50 + severityBonus,
            message: microLeakInsight.message
        });
    }

    driftInsights.forEach(drift => {
        potentialInsights.push({
            type: 'drift',
            priority: 40 + Math.floor(drift.percent / 5),
            message: `${drift.label} spending is up by ${drift.percent}% this month. Monitor this trend closely.`
        });
    });

    const dateHash = todayStr.split('-').reduce((sum, part) => sum + parseInt(part), 0);
    const tipIndex = dateHash % financialTips.length;
    potentialInsights.push({
        type: 'tip',
        priority: 10,
        message: financialTips[tipIndex]
    });

    potentialInsights.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.message.localeCompare(b.message);
    });

    return potentialInsights[0];
};
