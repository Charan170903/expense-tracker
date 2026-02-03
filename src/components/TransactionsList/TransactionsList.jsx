import { useState, useMemo, useEffect, useRef } from 'react';
import {
    MdReceiptLong,
    MdTune,
    MdClose,
    MdCalendarToday,
    MdAttachMoney
} from 'react-icons/md';
import TransactionItem from '../TransactionItem/TransactionItem';
import './TransactionsList.css';

function TransactionsList({ transactions, onDelete, onUpdateSubscription, isLoading }) {
    const [filterType, setFilterType] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const modalRef = useRef(null);

    // Filter & Sort Logic
    const processedTransactions = useMemo(() => {
        let result = [...transactions];
        if (filterType !== 'all') result = result.filter(t => t.type === filterType);

        result.sort((a, b) => {
            let valA = sortConfig.key === 'date' ? new Date(a.date).getTime() : Number(a.amount);
            let valB = sortConfig.key === 'date' ? new Date(b.date).getTime() : Number(b.amount);
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [transactions, filterType, sortConfig]);

    // Close modal on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        if (isFilterOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterOpen]);

    return (
        <section className="transactions-list">
            <div className="transactions-list__header">
                <div className="header-top">
                    <div className="title-section">
                        <MdReceiptLong className="transactions-list__icon" />
                        <h2 className="transactions-list__title">Transactions</h2>
                    </div>

                    <div className="controls-section">
                        {/* Quick Type Selection */}
                        <div className="pill-toggle">
                            {['all', 'expense', 'income'].map(type => (
                                <button
                                    key={type}
                                    className={`pill-btn ${filterType === type ? 'active' : ''} btn-${type}`}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type.slice(0, 3).toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Modal Trigger */}
                        <div className="modal-trigger-wrapper">
                            <button
                                className={`modal-trigger-btn ${isFilterOpen ? 'active' : ''}`}
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                title="Sort Options"
                            >
                                <MdTune />
                            </button>

                            {isFilterOpen && (
                                <div className="filter-dropdown-modal" ref={modalRef}>
                                    <div className="modal-inner">
                                        <div className="modal-head">
                                            <span>Sort Details</span>
                                            <button className="close-mini" onClick={() => setIsFilterOpen(false)}>
                                                <MdClose />
                                            </button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="modal-group">
                                                <small>Sort By</small>
                                                <div className="btn-group">
                                                    <button
                                                        className={sortConfig.key === 'date' ? 'selected' : ''}
                                                        onClick={() => setSortConfig(c => ({ ...c, key: 'date' }))}
                                                    >
                                                        <MdCalendarToday /> Date
                                                    </button>
                                                    <button
                                                        className={sortConfig.key === 'amount' ? 'selected' : ''}
                                                        onClick={() => setSortConfig(c => ({ ...c, key: 'amount' }))}
                                                    >
                                                        <MdAttachMoney /> Amount
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="modal-group">
                                                <small>Direction</small>
                                                <div className="btn-group">
                                                    <button
                                                        className={sortConfig.direction === 'desc' ? 'selected' : ''}
                                                        onClick={() => setSortConfig(c => ({ ...c, direction: 'desc' }))}
                                                    >
                                                        {sortConfig.key === 'date' ? 'Newest' : 'Highest'}
                                                    </button>
                                                    <button
                                                        className={sortConfig.direction === 'asc' ? 'selected' : ''}
                                                        onClick={() => setSortConfig(c => ({ ...c, direction: 'asc' }))}
                                                    >
                                                        {sortConfig.key === 'date' ? 'Oldest' : 'Lowest'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-foot">
                                            <button className="text-btn" onClick={() => {
                                                setFilterType('all');
                                                setSortConfig({ key: 'date', direction: 'desc' });
                                            }}>Reset</button>
                                            <button className="apply-pill" onClick={() => setIsFilterOpen(false)}>Apply</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="transactions-list__empty">
                    <div className="spinner"></div>
                    <p>Loading History...</p>
                </div>
            ) : processedTransactions.length === 0 ? (
                <div className="transactions-list__empty">
                    <MdReceiptLong className="empty-ico" />
                    <p>{transactions.length === 0 ? "No records yet" : "No results for these filters"}</p>
                </div>
            ) : (
                <div className="transactions-list__items">
                    {processedTransactions.map((transaction) => (
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
