import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import './CategoryDonutChart.css';

const COLORS = [
    '#4f46e5', // Indigo (High focus)
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#f43f5e', // Rose
    '#8b5cf6', // Violet
    '#64748b'  // Slate (Others)
];

const CategoryDonutChart = ({ transactions }) => {
    const [chartType, setChartType] = useState('expense');
    const [activeIndex, setActiveIndex] = useState(-1);

    // 1. Data Processing with "Top 5 + Others" Grouping
    const { chartData, totalAmount } = useMemo(() => {
        const filtered = transactions.filter(t => t.type === chartType);
        const map = {};
        let total = 0;

        filtered.forEach(t => {
            const cat = t.category.charAt(0).toUpperCase() + t.category.slice(1);
            if (!map[cat]) map[cat] = 0;
            map[cat] += Number(t.amount);
            total += Number(t.amount);
        });

        // Convert to array
        let data = Object.keys(map).map(k => ({
            name: k,
            value: map[k],
            percentage: total > 0 ? (map[k] / total) * 100 : 0
        })).sort((a, b) => b.value - a.value);

        // Grouping Logic: Keep Top 5, group rest as "Others"
        if (data.length > 5) {
            const top5 = data.slice(0, 5);
            const others = data.slice(5);
            const otherValue = others.reduce((sum, item) => sum + item.value, 0);

            if (otherValue > 0) {
                top5.push({
                    name: 'Others',
                    value: otherValue,
                    percentage: (otherValue / total) * 100
                });
            }
            data = top5;
        }

        return { chartData: data, totalAmount: total };
    }, [transactions, chartType]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(-1);
    };

    // Determine Center Text
    // Default: Total Amount
    // Hover: Active Category Amount & Name
    const centerDisplay = useMemo(() => {
        if (activeIndex >= 0 && chartData[activeIndex]) {
            const active = chartData[activeIndex];
            return {
                label: active.name,
                amount: formatCurrency(active.value),
                sub: `${Math.round(active.percentage)}% of total`
            };
        }
        return {
            label: `Total ${chartType === 'expense' ? 'Expenses' : 'Income'}`,
            amount: formatCurrency(totalAmount),
            sub: 'This Period'
        };
    }, [activeIndex, chartData, totalAmount, chartType]);

    return (
        <div className="category-donut-card">
            <div className="category-donut-header">
                <h3 className="category-donut-title">Spending Breakdown</h3>
                <div className="min-toggle">
                    <button
                        className={`min-toggle-btn min-toggle-btn--expense ${chartType === 'expense' ? 'active' : ''}`}
                        onClick={() => setChartType('expense')}
                    >
                        EXP
                    </button>
                    <button
                        className={`min-toggle-btn min-toggle-btn--income ${chartType === 'income' ? 'active' : ''}`}
                        onClick={() => setChartType('income')}
                    >
                        INC
                    </button>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="donut-empty-state">
                    <span>No data available</span>
                </div>
            ) : (
                <div className="category-donut-content">
                    {/* Chart Section */}
                    <div className="donut-visual-container">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={props => {
                                        // Slight expand effect for active slice
                                        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                                        return (
                                            <Sector
                                                cx={cx}
                                                cy={cy}
                                                innerRadius={innerRadius}
                                                outerRadius={outerRadius + 6}
                                                startAngle={startAngle}
                                                endAngle={endAngle}
                                                fill={fill}
                                                cornerRadius={6}
                                            />
                                        );
                                    }}
                                    data={chartData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    onMouseLeave={onPieLeave}
                                    cornerRadius={5}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="none"
                                            fillOpacity={activeIndex === -1 || activeIndex === index ? 1 : 0.3}
                                            style={{ transition: 'all 0.3s ease' }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Dynamic Center Text */}
                        <div className="donut-center-overlay">
                            <span className="center-label">{centerDisplay.label}</span>
                            <span className="center-amount">{centerDisplay.amount}</span>
                            <span className="center-sub">{centerDisplay.sub}</span>
                        </div>
                    </div>

                    {/* Rich Data Legend */}
                    <div className="donut-rich-legend">
                        {chartData.map((item, index) => (
                            <div
                                key={index}
                                className={`rich-legend-item ${activeIndex === index ? 'active' : ''}`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(-1)}
                            >
                                <div className="legend-row-top">
                                    <div className="legend-id">
                                        <span className="dot" style={{ background: COLORS[index % COLORS.length] }}></span>
                                        <span className="name">{item.name}</span>
                                    </div>
                                    <span className="value">{formatCurrency(item.value)}</span>
                                </div>
                                <div className="legend-bar-track">
                                    <div
                                        className="legend-bar-fill"
                                        style={{
                                            width: `${item.percentage}%`,
                                            background: COLORS[index % COLORS.length]
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDonutChart;
