import { MdDelete, MdCheck, MdClose } from 'react-icons/md';
import {
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
    MdTrendingUp,
    MdBusiness,
    MdCardGiftcard,
    MdAccountBalanceWallet
} from 'react-icons/md';
import dayjs from 'dayjs';
import './TransactionItem.css';

const categoryIcons = {
    'Food & Dining': MdFastfood,
    'Transportation': MdDirectionsCar,
    'Shopping': MdShoppingBag,
    'Bills & Utilities': MdLightbulb,
    'Entertainment': MdMovie,
    'Healthcare': MdLocalHospital,
    'Education': MdSchool,
    'Salary': MdWork,
    'Freelance': MdLaptop,
    'Investment': MdTrendingUp,
    'Business': MdBusiness,
    'Gift': MdCardGiftcard,
    'Other': MdCategory,
};

function TransactionItem({ transaction, onDelete, onUpdateSubscription }) {
    const { id, title, amount, type, category, date, subscriptionStatus } = transaction;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const IconComponent = categoryIcons[category] || MdAccountBalanceWallet;

    return (
        <article className="transaction-item">
            <div className="transaction-item__info">
                <div className={`transaction-item__icon-wrapper transaction-item__icon-wrapper--${type}`}>
                    <IconComponent className="transaction-item__category-icon" />
                </div>
                <div className="transaction-item__details">
                    <div className="transaction-item__name-row">
                        <span className="transaction-item__name">{title}</span>
                        {subscriptionStatus === 'confirmed' && (
                            <span className="transaction-item__subscription-badge">Subscription</span>
                        )}
                        {subscriptionStatus === 'detected' && (
                            <span className="transaction-item__subscription-badge detected">Recurring?</span>
                        )}
                        {transaction.contextTag && (
                            <span className="transaction-item__context-badge">{transaction.contextTag}</span>
                        )}
                    </div>
                    <span className="transaction-item__date">
                        {dayjs(date).format('MMM DD, YYYY')}
                    </span>
                    {subscriptionStatus === 'detected' && (
                        <div className="transaction-item__subscription-actions">
                            <button
                                className="sub-btn sub-btn--confirm"
                                onClick={() => onUpdateSubscription(id, 'confirmed')}
                                title="Confirm Subscription"
                            >
                                <MdCheck /> Confirm
                            </button>
                            <button
                                className="sub-btn sub-btn--dismiss"
                                onClick={() => onUpdateSubscription(id, 'dismissed')}
                                title="Dismiss"
                            >
                                <MdClose /> Dismiss
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="transaction-item__actions">
                <span className={`transaction-item__amount transaction-item__amount--${type}`}>
                    {type === 'income' ? '+' : '−'}{formatCurrency(amount)}
                </span>
                <button
                    className="transaction-item__delete"
                    onClick={() => onDelete(id)}
                    aria-label="Delete transaction"
                >
                    <MdDelete />
                </button>
            </div>
        </article>
    );
}

export default TransactionItem;
