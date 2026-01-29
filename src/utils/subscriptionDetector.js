import dayjs from 'dayjs';

/**
 * Heuristic detector for recurring subscription patterns.
 * Identifies sequences with similar titles and amounts occurring at ~30-day intervals (±3 days).
 */
export const detectSubscriptions = (transactions) => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const detectedIds = new Set();
    const groups = {};

    expenses.forEach(t => {
        if (t.subscriptionStatus === 'confirmed' || t.subscriptionStatus === 'dismissed') return;

        // Normalized grouping (fuzzy title + exact amount)
        const normalizedTitle = t.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6);
        const key = `${normalizedTitle}_${t.amount}`;

        if (!groups[key]) groups[key] = [];
        groups[key].push(t);
    });

    Object.values(groups).forEach(group => {
        if (group.length < 2) return;

        const sorted = [...group].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
        let isRecurringPattern = false;

        for (let i = 1; i < sorted.length; i++) {
            const diffDays = Math.abs(dayjs(sorted[i].date).diff(dayjs(sorted[i - 1].date), 'day'));

            // Check for monthly recurrence (27-33 day window)
            if (diffDays >= 27 && diffDays <= 33) {
                isRecurringPattern = true;
                break;
            }
        }

        if (isRecurringPattern) {
            group.forEach(t => detectedIds.add(t.id));
        }
    });

    return detectedIds;
};
