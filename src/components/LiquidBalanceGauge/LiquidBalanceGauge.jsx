import React, { useMemo, useState } from 'react';
import './LiquidBalanceGauge.css';

/**
 * LiquidBalanceGauge component
 * Visualizes balance as liquid with continuous color physics and fluid dynamics.
 */
const LiquidBalanceGauge = ({ balance, maxBalance = 50000 }) => {
    const [isSplashing, setIsSplashing] = useState(false);

    // 1. Clamp and Calculate Percentage
    const percentage = useMemo(() => {
        if (!maxBalance || maxBalance === 0) return 0;
        const p = (balance / maxBalance) * 100;
        return Math.min(Math.max(p, 0), 100);
    }, [balance, maxBalance]);

    // 2. Color Physics
    const colorPhysics = useMemo(() => {
        let hue = 0;
        if (percentage >= 70) hue = 190;      // Abundance
        else if (percentage >= 40) hue = 145; // Healthy
        else if (percentage >= 15) hue = 35;  // Warning
        else hue = 5;                        // Danger

        const saturation = 85;
        const lightness = 40;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }, [percentage]);

    const statusLabel = useMemo(() => {
        if (percentage >= 70) return 'Abundant • Invest?';
        if (percentage >= 40) return 'Healthy • Stable';
        if (percentage >= 15) return 'Low • Spend Wisely';
        return 'Critical • Add Funds';
    }, [percentage]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate liquid level (0 is full, 100 is empty)
    const liquidLevel = 100 - (percentage * 0.96 + 2);

    // Interaction Effect
    const handleSplash = () => {
        setIsSplashing(true);
        setTimeout(() => setIsSplashing(false), 1000);
    };

    return (
        <div
            className={`liquid-money-card ${isSplashing ? 'is-splashing' : ''}`}
            onClick={handleSplash}
        >
            <div className="liquid-money-gauge">
                <svg
                    viewBox="0 0 100 100"
                    className="liquid-money-gauge__svg"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="fluidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={colorPhysics} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={colorPhysics} stopOpacity="1" />
                        </linearGradient>
                    </defs>

                    <rect width="100" height="100" className="liquid-money-gauge__bg" />

                    <g style={{
                        transform: `translateY(${liquidLevel}px)`,
                        transition: 'transform 2s cubic-bezier(0.2, 1, 0.3, 1)',
                        willChange: 'transform' // GPU Hint
                    }}>
                        {/* Layer 2 - Mid Wave (Simpler Background) */}
                        <path
                            className="liquid-money-gauge__wave liquid-money-gauge__wave--back"
                            d="M 0 0 Q 30 5 60 0 T 120 0 T 180 0 T 240 0 V 150 H 0 Z"
                            fill={colorPhysics}
                            fillOpacity="0.4"
                        />

                        {/* Layer 1 - Front Main Wave */}
                        <path
                            className="liquid-money-gauge__wave liquid-money-gauge__wave--front"
                            d="M 0 0 Q 30 -5 60 0 T 120 0 T 180 0 T 240 0 V 150 H 0 Z"
                            fill="url(#fluidGradient)"
                        />

                        {/* Internal Reflection - "Glimmer" on wave top */}
                        <path
                            className="liquid-money-gauge__wave liquid-money-gauge__wave--reflection"
                            d="M 0 -2 Q 30 -6 60 -2 T 120 -2 T 180 -2 T 240 -2 V 0 H 0 Z"
                            fill="white"
                            fillOpacity="0.15"
                        />
                    </g>
                </svg>

                {/* Information Overlay */}
                <div className="liquid-money-gauge__content liquid-money-gauge__content--base">
                    <span className="liquid-money-gauge__title">Liquid Funds</span>
                    <h2 className="liquid-money-gauge__value">{formatCurrency(balance)}</h2>
                    <div className="liquid-money-gauge__meta">
                        <span className="liquid-money-gauge__percentage">{Math.round(percentage)}%</span>
                        <span className="liquid-money-gauge__divider">/</span>
                        <span className="liquid-money-gauge__status" style={{ color: colorPhysics }}>
                            {statusLabel}
                        </span>
                    </div>
                </div>

                <div
                    className="liquid-money-gauge__content liquid-money-gauge__content--overlay"
                    style={{ clipPath: `inset(${liquidLevel}% 0 0 0)` }}
                >
                    <span className="liquid-money-gauge__title">Liquid Funds</span>
                    <h2 className="liquid-money-gauge__value">{formatCurrency(balance)}</h2>
                    <div className="liquid-money-gauge__meta">
                        <span className="liquid-money-gauge__percentage">{Math.round(percentage)}%</span>
                        <span className="liquid-money-gauge__divider">/</span>
                        <span className="liquid-money-gauge__status" style={{ color: '#fff' }}>
                            {statusLabel}
                        </span>
                    </div>
                </div>
            </div>

            <div className="liquid-money-card__glass"></div>
        </div>
    );
};

export default LiquidBalanceGauge;
