import { MdReceiptLong } from 'react-icons/md';
import TransactionItem from '../TransactionItem/TransactionItem';
import './TransactionsList.css';

function TransactionsList({ transactions, onDelete, onUpdateSubscription, isLoading }) {
    return (
        <section className="transactions-list">
            <div className="transactions-list__header">
                <div className="transactions-list__title-wrapper">
                    <MdReceiptLong className="transactions-list__icon" />
                    <h2 className="transactions-list__title">Transactions</h2>
                </div>
                <span className="transactions-list__count">
                    {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                </span>
            </div>

            {isLoading ? (
                <div className="transactions-list__empty">
                    <div className="spinner" style={{ margin: '2rem auto' }}></div>
                    <p className="transactions-list__empty-text">Loading...</p>
                </div>
            ) : transactions.length === 0 ? (
                <div className="transactions-list__empty">
                    <MdReceiptLong className="transactions-list__empty-icon" />
                    <p className="transactions-list__empty-text">No transactions yet</p>
                    <p className="transactions-list__empty-subtext">
                        Click "Add Transaction" to get started
                    </p>
                </div>
            ) : (
                <div className="transactions-list__items">
                    {transactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            onDelete={onDelete}
                            onUpdateSubscription={onUpdateSubscription}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default TransactionsList;
