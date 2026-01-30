import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import {
    MdClose,
    MdTrendingUp,
    MdTrendingDown,
    MdAdd,
    MdFastfood,
    MdDirectionsCar,
    MdShoppingBag,
    MdLightbulb,
    MdMovie,
    MdLocalHospital,
    MdSchool,
    MdCategory,
    MdWork,
    MdLaptop,
    MdShowChart,
    MdBusiness,
    MdCardGiftcard,
    MdAccountBalanceWallet,
    MdScience,
    MdArrowForward,
    MdCheckCircle
} from 'react-icons/md';
import './AddTransactionModal.css';

function AddTransactionModal({ isOpen, onClose, onAdd, currentFilteredTransactions = [], currentStats = { totalIncome: 0, totalExpense: 0, savingsRate: 0 } }) {
    const [mode, setMode] = useState('transaction');
    const [type, setType] = useState('expense');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [notes, setNotes] = useState('');
    const [contextTag, setContextTag] = useState(null);

    const contextTags = [
        'Essential',
        'Work-Related',
        'Personal Joy',
        'Social/Gift',
        'Impulse/Quick',
        'Emergency'
    ];

    const expenseCategories = [
        { value: 'Food & Dining', label: 'Food & Dining', icon: MdFastfood },
        { value: 'Transportation', label: 'Transportation', icon: MdDirectionsCar },
        { value: 'Shopping', label: 'Shopping', icon: MdShoppingBag },
        { value: 'Bills & Utilities', label: 'Bills & Utilities', icon: MdLightbulb },
        { value: 'Entertainment', label: 'Entertainment', icon: MdMovie },
        { value: 'Healthcare', label: 'Healthcare', icon: MdLocalHospital },
        { value: 'Education', label: 'Education', icon: MdSchool },
        { value: 'Other', label: 'Other', icon: MdCategory },
    ];

    const incomeCategories = [
        { value: 'Salary', label: 'Salary', icon: MdWork },
        { value: 'Freelance', label: 'Freelance', icon: MdLaptop },
        { value: 'Investment', label: 'Investment', icon: MdShowChart },
        { value: 'Business', label: 'Business', icon: MdBusiness },
        { value: 'Gift', label: 'Gift', icon: MdCardGiftcard },
        { value: 'Other', label: 'Other', icon: MdAccountBalanceWallet },
    ];

    const categories = type === 'expense' ? expenseCategories : incomeCategories;

    /**
     * Calculates projected financial impact of a hypothetical expense.
     * Prevents persisted state changes during simulation.
     */
    const simulationResult = useMemo(() => {
        if (mode !== 'simulate' || !amount || !category) return null;

        const simulatedAmount = parseFloat(amount);
        if (isNaN(simulatedAmount) || simulatedAmount <= 0) return null;

        const currentRate = currentStats.savingsRate;
        const newTotalExpense = currentStats.totalExpense + simulatedAmount;

        const newRate = currentStats.totalIncome > 0
            ? Math.round(((currentStats.totalIncome - newTotalExpense) / currentStats.totalIncome) * 100)
            : 0;

        const rateChange = newRate - currentRate;

        const currentCategoryTotal = currentFilteredTransactions
            .filter(t => t.category === category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const newCategoryTotal = currentCategoryTotal + simulatedAmount;
        const categoryPercentIncrease = currentCategoryTotal > 0
            ? Math.round(((newCategoryTotal - currentCategoryTotal) / currentCategoryTotal) * 100)
            : 100;

        return {
            currentRate,
            newRate,
            rateChange,
            currentCategoryTotal,
            newCategoryTotal,
            categoryPercentIncrease
        };
    }, [amount, category, mode, currentStats, currentFilteredTransactions]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'simulate') {
            setMode('transaction');
            return;
        }

        if (!title.trim() || !amount || !category) {
            alert('Please fill in all required fields');
            return;
        }

        const transaction = {
            id: Date.now(),
            type,
            title: title.trim(),
            amount: parseFloat(amount),
            category,
            date,
            notes: notes.trim(),
            contextTag: type === 'expense' ? contextTag : null,
            createdAt: new Date().toISOString(),
        };

        onAdd(transaction);
        handleClose();
    };

    const handleClose = () => {
        setMode('transaction');
        setType('expense');
        setTitle('');
        setAmount('');
        setCategory('');
        setDate(dayjs().format('YYYY-MM-DD'));
        setNotes('');
        setContextTag(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {mode === 'simulate' ? 'Pre-Spend Simulator' : 'Add Transaction'}
                    </h2>
                    <button className="modal-close" onClick={handleClose} aria-label="Close">
                        <MdClose />
                    </button>
                </div>

                <div className="mode-switcher">
                    <button
                        className={`mode-btn ${mode === 'transaction' ? 'active' : ''}`}
                        onClick={() => setMode('transaction')}
                    >
                        <MdAdd /> Transaction
                    </button>
                    <button
                        className={`mode-btn ${mode === 'simulate' ? 'active' : ''}`}
                        onClick={() => {
                            setMode('simulate');
                            setType('expense');
                        }}
                    >
                        <MdScience /> Simulator
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {mode === 'simulate' && (
                        <div className="simulation-intro">
                            <p>Test a hypothetical expense to see how it affects your financial health for the selected period.</p>
                        </div>
                    )}

                    {mode === 'transaction' && (
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-toggle__btn ${type === 'income' ? 'active' : ''}`}
                                onClick={() => {
                                    setType('income');
                                    setCategory('');
                                    setContextTag(null);
                                }}
                            >
                                <MdTrendingUp className="type-toggle__icon" />
                                Income
                            </button>
                            <button
                                type="button"
                                className={`type-toggle__btn ${type === 'expense' ? 'active' : ''}`}
                                onClick={() => {
                                    setType('expense');
                                    setCategory('');
                                }}
                            >
                                <MdTrendingDown className="type-toggle__icon" />
                                Expense
                            </button>
                        </div>
                    )}

                    {mode === 'transaction' && (
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                Title <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="form-input"
                                placeholder={`Enter ${type} title...`}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={50}
                                required={mode === 'transaction'}
                            />
                            <span className="form-hint">{title.length}/50</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="amount" className="form-label">
                            {mode === 'simulate' ? 'Hypothetical Amount' : 'Amount'} <span className="required">*</span>
                        </label>
                        <div className="amount-input-wrapper">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                id="amount"
                                className="form-input amount-input"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category" className="form-label">
                            Category <span className="required">*</span>
                        </label>
                        <div className="category-grid">
                            {categories.map((cat) => {
                                const IconComponent = cat.icon;
                                return (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        className={`category-btn ${category === cat.value ? 'active' : ''}`}
                                        onClick={() => setCategory(cat.value)}
                                    >
                                        <IconComponent className="category-icon" />
                                        <span className="category-label">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {mode === 'simulate' && simulationResult && (
                        <div className="simulation-results">
                            <h3 className="simulation-title">Projected Impact</h3>

                            <div className="sim-card">
                                <div className="sim-row">
                                    <span className="sim-label">Savings Rate</span>
                                    <div className="sim-values">
                                        <span className="sim-old">{simulationResult.currentRate}%</span>
                                        <MdArrowForward className="sim-arrow" />
                                        <span className={`sim-new ${simulationResult.newRate < simulationResult.currentRate ? 'negative' : ''}`}>
                                            {simulationResult.newRate}%
                                        </span>
                                    </div>
                                </div>
                                <p className="sim-feedback">
                                    {simulationResult.rateChange < 0
                                        ? ` This expense would reduce your savings rate by ${Math.abs(simulationResult.rateChange)}% for this period.`
                                        : " No significant impact on savings rate."}
                                </p>
                            </div>

                            <div className="sim-card">
                                <div className="sim-row">
                                    <span className="sim-label">Category Spending ({category})</span>
                                    <div className="sim-values">
                                        <span className="sim-old">₹{simulationResult.currentCategoryTotal}</span>
                                        <MdArrowForward className="sim-arrow" />
                                        <span className="sim-new">₹{simulationResult.newCategoryTotal}</span>
                                    </div>
                                </div>
                                <p className="sim-feedback">
                                    Total spending in this category would increase by {simulationResult.categoryPercentIncrease}%.
                                </p>
                            </div>
                        </div>
                    )}


                    {mode === 'transaction' && (
                        <>
                            {type === 'expense' && (
                                <div className="form-group">
                                    <label className="form-label">
                                        Context/Intent <span className="optional">(Optional)</span>
                                    </label>
                                    <div className="tag-cloud">
                                        {contextTags.map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={`tag-chip ${contextTag === tag ? 'active' : ''}`}
                                                onClick={() => setContextTag(contextTag === tag ? null : tag)}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    className="form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    max={dayjs().format('YYYY-MM-DD')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes" className="form-label">
                                    Notes <span className="optional">(Optional)</span>
                                </label>
                                <textarea
                                    id="notes"
                                    className="form-textarea"
                                    placeholder="Add any additional notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows="3"
                                    maxLength={200}
                                />
                                <span className="form-hint">{notes.length}/200</span>
                            </div>
                        </>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        {mode === 'transaction' ? (
                            <button
                                type="submit"
                                className={`btn btn-primary btn-primary--${type}`}
                            >
                                <MdAdd className="btn-icon" />
                                Add {type === 'income' ? 'Income' : 'Expense'}
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!amount || !category}
                            >
                                <MdCheckCircle className="btn-icon" />
                                Proceed to Add
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTransactionModal;
