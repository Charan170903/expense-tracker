import React from 'react';
import './PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password, showRequirements = true }) => {
    const checkStrength = () => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        };

        const passedChecks = Object.values(checks).filter(Boolean).length;

        let strength = 'weak';
        let color = '#ef4444';

        if (checks.length && checks.uppercase && checks.lowercase && checks.number) {
            if (checks.special) {
                strength = 'strong';
                color = '#22c55e';
            } else {
                strength = 'medium';
                color = '#f59e0b';
            }
        } else if (passedChecks >= 2) {
            strength = 'weak';
            color = '#ef4444';
        }

        return { strength, color, checks, passedChecks };
    };

    if (!password) return null;

    const { strength, color, checks } = checkStrength();

    return (
        <div className="password-strength-indicator">
            <div className="strength-bar-container">
                <div
                    className={`strength-bar strength-${strength}`}
                    style={{ backgroundColor: color }}
                />
            </div>
            <div className="strength-label" style={{ color }}>
                {strength === 'weak' && '❌ Weak'}
                {strength === 'medium' && '⚠️ Medium'}
                {strength === 'strong' && '✅ Strong'}
            </div>

            {showRequirements && (
                <div className="password-requirements">
                    <div className={`requirement ${checks.length ? 'met' : ''}`}>
                        {checks.length ? '✓' : '○'} At least 8 characters
                    </div>
                    <div className={`requirement ${checks.uppercase ? 'met' : ''}`}>
                        {checks.uppercase ? '✓' : '○'} One uppercase letter
                    </div>
                    <div className={`requirement ${checks.lowercase ? 'met' : ''}`}>
                        {checks.lowercase ? '✓' : '○'} One lowercase letter
                    </div>
                    <div className={`requirement ${checks.number ? 'met' : ''}`}>
                        {checks.number ? '✓' : '○'} One number
                    </div>
                    <div className={`requirement ${checks.special ? 'met' : ''}`}>
                        {checks.special ? '✓' : '○'} One special character (recommended)
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;
