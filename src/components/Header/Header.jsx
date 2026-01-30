import { MdLightMode, MdDarkMode, MdLogout } from 'react-icons/md';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header({ selectedMonth, onMonthChange, selectedRange, onRangeChange, transactions, theme, onToggleTheme }) {
    const { logout } = useAuth();

    /**
     * Aggregates a list of all selectable months. 
     * Includes the trailing 12 months from 'today' plus any historical months containing transactions.
     */
    const transactionMonths = transactions.map(t => dayjs(t.date).format('MMM YYYY'));
    const currentMonths = Array.from({ length: 12 }, (_, i) =>
        dayjs().subtract(i, 'month').format('MMM YYYY')
    );

    const allMonths = Array.from(new Set([...currentMonths, ...transactionMonths]))
        .sort((a, b) => dayjs(b, 'MMM YYYY').diff(dayjs(a, 'MMM YYYY')));

    const ranges = [
        { value: 'month', label: 'Month Only' },
        { value: '3months', label: 'Past 3 Months' },
        { value: '6months', label: 'Past 6 Months' },
        { value: 'year', label: 'Past Year' },
        { value: 'all', label: 'All Time' },
    ];

    return (
        <header className="header">
            <div className="brand">
                <h1 className="brand__name">
                    <span className="brand__char accent">C</span>
                    <span className="brand__char">H</span>
                    <span className="brand__char">E</span>
                    <span className="brand__char">C</span>
                    <span className="brand__char accent">K</span>
                </h1>
                <p className="brand__tagline">Know before you spend.</p>
            </div>
            <div className="header__controls">
                <button
                    className="theme-toggle"
                    onClick={onToggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? (
                        <MdDarkMode className="theme-toggle__icon" />
                    ) : (
                        <MdLightMode className="theme-toggle__icon" />
                    )}
                </button>
                <select
                    className="header__selector"
                    aria-label="Select Range"
                    value={selectedRange}
                    onChange={(e) => onRangeChange(e.target.value)}
                >
                    {ranges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
                <select
                    className="header__selector"
                    aria-label="Select Month"
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                >
                    {allMonths.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
                <button
                    className="theme-toggle"
                    onClick={logout}
                    title="Logout"
                >
                    <MdLogout className="theme-toggle__icon" />
                </button>
            </div>
        </header>
    );
}

export default Header;
