import { MdLightbulb, MdHistory } from 'react-icons/md';
import './DailyInsight.css';

function DailyInsight({ insight, memoryAnchor }) {
    if (!insight && !memoryAnchor) return null;

    const getTypeLabel = (type) => {
        switch (type) {
            case 'leak': return 'Micro-Leak Detected';
            case 'drift': return 'Spending Trend';
            case 'tip': return 'Financial Tip';
            case 'subscription': return 'Subscription Health';
            case 'decline': return 'Savings Performance';
            default: return 'Daily Insight';
        }
    };

    return (
        <div className="daily-insight-group">
            {memoryAnchor && (
                <div className="daily-insight daily-insight--anchor">
                    <div className="daily-insight__icon-wrapper daily-insight__icon-wrapper--anchor">
                        <MdHistory />
                    </div>
                    <div className="daily-insight__content">
                        <span className="daily-insight__label">Memory Anchor</span>
                        <p className="daily-insight__message">{memoryAnchor}</p>
                    </div>
                </div>
            )}

            {insight && (
                <div className="daily-insight">
                    <div className="daily-insight__icon-wrapper">
                        <MdLightbulb />
                    </div>
                    <div className="daily-insight__content">
                        <span className="daily-insight__label">{getTypeLabel(insight.type)}</span>
                        <p className="daily-insight__message">{insight.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DailyInsight;
