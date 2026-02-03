import { MdTrendingUp, MdTrendingDown, MdAdd } from 'react-icons/md';
import './SecondaryStats.css';

function SecondaryStats({ income, expense, activeSubscriptions, noSpendDays, onAddClick }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <section className="secondary-stats">
            <div className="secondary-stats__grid">
                <div className="stat-item stat-item--income">
                    <div className="stat-item__icon-wrapper stat-item__icon-wrapper--income">
                        <MdTrendingUp className="stat-item__icon" />
                    </div>
                    <div className="stat-item__content">
                        <p className="stat-item__label">Income</p>
                        <p className="stat-item__amount">{formatCurrency(income)}</p>
                    </div>
                </div>

                <div className="stat-item stat-item--expense">
                    <div className="stat-item__icon-wrapper stat-item__icon-wrapper--expense">
                        <MdTrendingDown className="stat-item__icon" />
                    </div>
                    <div className="stat-item__content">
                        <p className="stat-item__label">Expense</p>
                        <p className="stat-item__amount">{formatCurrency(expense)}</p>
                    </div>
                </div>
            </div>

            {/* Central Add Action */}
            <button className="secondary-add-btn" onClick={onAddClick}>
                <MdAdd /> Add Transaction
            </button>

            <div className="secondary-stats__badges">
                {activeSubscriptions > 0 && (
                    <div className="stats-badge stats-badge--subscription">
                        Active subscriptions: {activeSubscriptions}
                    </div>
                )}
                {noSpendDays > 0 && (
                    <div className="stats-badge stats-badge--no-spend">
                        No-spend days: {noSpendDays}
                    </div>
                )}
            </div>
        </section>
    );
}

export default SecondaryStats;
