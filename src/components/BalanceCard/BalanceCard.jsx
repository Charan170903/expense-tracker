import './BalanceCard.css';

function BalanceCard({ balance, eomAwareness, confidence }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <section className="balance-card">
            <div className="balance-card__content">
                <p className="balance-card__label">Total Balance</p>
                <p className={`balance-card__amount ${balance < 0 ? 'negative' : ''}`}>
                    {formatCurrency(balance)}
                </p>

                {confidence && (
                    <div className="balance-card__confidence">
                        <span className="confidence-text">{confidence.text}</span>
                    </div>
                )}

                {eomAwareness && (
                    <p className="balance-card__awareness">
                        {eomAwareness.isLastDay
                            ? "Last day of the month. Closing your records soon."
                            : `${eomAwareness.daysLeft} days left in the month. Plan your remaining budget accordingly.`
                        }
                    </p>
                )}
            </div>
        </section>
    );
}

export default BalanceCard;
