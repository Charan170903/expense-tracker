import { MdAdd } from 'react-icons/md';
import './AddTransactionAction.css';

function AddTransactionAction({ onAddClick }) {
    return (
        <div className="add-transaction-zone" role="group" aria-label="Transaction Controls">
            <button
                className="add-transaction-btn"
                onClick={onAddClick}
                aria-label="Add new transaction"
            >
                <MdAdd className="add-transaction-icon" />
                Add New Transaction
            </button>
        </div>
    );
}

export default AddTransactionAction;
