import { MdAccountBalance, MdSavings, MdTimeline } from 'react-icons/md';
import './SavingsStats.css';

function SavingsStats({ savingsData, selectedRange, formatCurrency }) {
    const { totalIncome, totalExpense, totalSavings, savingsRate } = savingsData;

    const getRangeLabel = (range) => {
        switch (range) {
            case '3months': return 'Past 3 Months';
            case '6months': return 'Past 6 Months';
            case 'year': return 'Past Year';
            case 'all': return 'All Time';
            default: return 'Current Selection';
        }
    };

    return (
        <section className="savings-stats">
            <div className="savings-stats__header">
                <div className="savings-stats__title-wrapper">
                    <MdTimeline className="savings-stats__icon" />
                    <h2 className="savings-stats__title">Analysis & Insights</h2>
                </div>
                <span className="savings-stats__range-badge">{getRangeLabel(selectedRange)}</span>
            </div>

            <div className="savings-stats__grid">
                <div className="savings-card">
                    <div className="savings-card__header">
                        <div className="savings-card__icon-wrapper savings-card__icon-wrapper--savings">
                            <MdSavings />
                        </div>
                        <span className="savings-card__label">Total Savings</span>
                    </div>
                    <div className="savings-card__body">
                        <h3 className="savings-card__value">{formatCurrency(totalSavings)}</h3>
                        <div className="savings-card__footer">
                            <span className={`savings-card__rate ${totalSavings >= 0 ? 'positive' : 'negative'}`}>
                                {savingsRate}% savings rate
                            </span>
                        </div>
                    </div>
                </div>

                <div className="savings-card">
                    <div className="savings-card__header">
                        <div className="savings-card__icon-wrapper savings-card__icon-wrapper--activity">
                            <MdAccountBalance />
                        </div>
                        <span className="savings-card__label">Activity Summary</span>
                    </div>
                    <div className="savings-card__body">
                        <div className="activity-item">
                            <span className="activity-label">Total Inflow</span>
                            <span className="activity-value income">{formatCurrency(totalIncome)}</span>
                        </div>
                        <div className="activity-item">
                            <span className="activity-label">Total Outflow</span>
                            <span className="activity-value expense">{formatCurrency(totalExpense)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SavingsStats;
