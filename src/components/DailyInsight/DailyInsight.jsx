import { useState, useRef, useLayoutEffect } from 'react';
import { MdLightbulb, MdHistory, MdClose } from 'react-icons/md';
import './DailyInsight.css';

const InsightMessage = ({ message, onReadMore }) => {
    const textRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            if (textRef.current) {
                const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
                setIsOverflowing(isOverflow);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [message]);

    return (
        <div className="daily-insight__message-container">
            <p ref={textRef} className="daily-insight__message">{message}</p>
            {isOverflowing && (
                <button
                    className="daily-insight__read-more"
                    onClick={() => onReadMore(message)}
                >
                    Read More
                </button>
            )}
        </div>
    );
};

function DailyInsight({ insight, memoryAnchor }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMessage, setActiveMessage] = useState(null);

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

    const getTypeIcon = (type) => {
        switch (type) {
            case 'anchor': return <MdHistory />;
            default: return <MdLightbulb />;
        }
    };

    const openModal = (message, title, type) => {
        setActiveMessage({ message, title, type });
        setIsModalOpen(true);
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveMessage(null);
        document.body.classList.remove('modal-open');
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
                        <InsightMessage
                            message={memoryAnchor}
                            onReadMore={(msg) => openModal(msg, 'Memory Anchor', 'anchor')}
                        />
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
                        <InsightMessage
                            message={insight.message}
                            onReadMore={(msg) => openModal(msg, getTypeLabel(insight.type), insight.type)}
                        />
                    </div>
                </div>
            )}

            {isModalOpen && activeMessage && (
                <div className="insight-modal-overlay" onClick={closeModal}>
                    <div className="insight-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="insight-modal-header">
                            <div className="insight-modal-header-left">
                                <div className={`insight-modal-icon insight-modal-icon--${activeMessage.type}`}>
                                    {getTypeIcon(activeMessage.type)}
                                </div>
                                <span className="insight-modal-label">{activeMessage.title}</span>
                            </div>
                            <button className="insight-modal-close" onClick={closeModal}>
                                <MdClose />
                            </button>
                        </div>
                        <div className="insight-modal-body">
                            <p className="insight-modal-text">{activeMessage.message}</p>
                        </div>
                        <div className="insight-modal-footer">
                            <button className="insight-modal-done-btn" onClick={closeModal}>
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DailyInsight;


