import dayjs from 'dayjs';

const MEMORY_ANCHORS_KEY = 'memory_anchors';

export const getStoredAnchors = () => {
    try {
        const stored = localStorage.getItem(MEMORY_ANCHORS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load memory anchors", e);
        return [];
    }
};

/**
 * Analyzes previous periods to capture correlation between category spending and savings rate.
 * Anchors are persisted if a threshold breach (positive or negative) is identified.
 */
export const archivePreviousPeriods = (transactions, storedAnchors) => {
    const today = dayjs();
    const currentMonthStr = today.format('MMM YYYY');

    const transactionMonths = Array.from(new Set(
        transactions.map(t => dayjs(t.date).format('MMM YYYY'))
    )).filter(m => m !== currentMonthStr);

    const newAnchors = [...storedAnchors];
    let updated = false;

    transactionMonths.forEach(monthStr => {
        if (newAnchors.some(a => a.period === monthStr)) return;

        const monthTransactions = transactions.filter(t => dayjs(t.date).format('MMM YYYY') === monthStr);
        if (monthTransactions.length === 0) return;

        const totals = monthTransactions.reduce((acc, t) => {
            if (t.type === 'income') acc.income += t.amount;
            else {
                acc.expense += t.amount;
                acc.categories[t.category] = (acc.categories[t.category] || 0) + t.amount;
            }
            return acc;
        }, { income: 0, expense: 0, categories: {} });

        const savings = totals.income - totals.expense;
        const rate = totals.income > 0 ? (savings / totals.income) * 100 : 0;

        let maxCategory = null;
        let maxAmount = 0;
        Object.entries(totals.categories).forEach(([cat, amt]) => {
            if (amt > maxAmount) {
                maxAmount = amt;
                maxCategory = cat;
            }
        });

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

        if (rate < 10 && maxCategory) {
            newAnchors.push({
                period: monthStr,
                type: 'consequence',
                trigger: {
                    category: maxCategory,
                    threshold: maxAmount * 0.9,
                },
                insight: `In ${monthStr}, high ${categoryLabels[maxCategory] || maxCategory} spending contributed to a savings rate drop to ${Math.round(rate)}%.`
            });
            updated = true;
        }
        else if (rate > 25 && maxCategory) {
            newAnchors.push({
                period: monthStr,
                type: 'positive',
                trigger: {
                    category: maxCategory,
                    threshold: maxAmount * 1.5,
                },
                insight: `In ${monthStr}, maintaining ${categoryLabels[maxCategory] || maxCategory} at ₹${Math.round(maxAmount)} enabled a ${Math.round(rate)}% savings rate.`
            });
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem(MEMORY_ANCHORS_KEY, JSON.stringify(newAnchors));
    }

    return newAnchors;
};

/**
 * Checks current categorical spending against historical anchor thresholds.
 * Returns the insight of the first matched anchor (prioritizing recent history).
 */
export const findActiveMemoryAnchor = (currentTransactions, storedAnchors) => {
    if (!storedAnchors || storedAnchors.length === 0) return null;

    const currentCategories = currentTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    for (const anchor of [...storedAnchors].reverse()) {
        const { trigger } = anchor;
        const currentAmount = currentCategories[trigger.category] || 0;

        if (currentAmount >= trigger.threshold) {
            return anchor.insight;
        }
    }

    return null;
};
