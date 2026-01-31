import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MdEmail,
    MdLock,
    MdVisibility,
    MdVisibilityOff,
    MdArrowForward,
    MdSunny,
    MdDarkMode,
    MdVpnKey,
    MdCheckCircle
} from 'react-icons/md';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import PasswordStrengthIndicator from '../PasswordStrengthIndicator/PasswordStrengthIndicator';
import './Login.css';

const Login = ({ theme, onToggleTheme }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register, forgotPassword, resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (authMode === 'login') {
                await login(email, password);
            } else if (authMode === 'register') {
                await register(email, password);
            } else if (authMode === 'forgot') {
                const res = await forgotPassword(email);
                if (res.success) {
                    let msg = res.message;
                    if (res.developmentCode) {
                        msg += ` (Dev Code: ${res.developmentCode})`;
                    }
                    setSuccessMessage(msg);
                    setAuthMode('reset');
                } else {
                    // Fallback for any 200-OK-but-failed scenarios
                    setError(res.message || 'Unable to process request');
                }
            } else if (authMode === 'reset') {
                await resetPassword(email, resetCode, password);
                setSuccessMessage('Password reset successful! Please sign in.');
                setAuthMode('login');
                setPassword('');
            }
        } catch (err) {
            // Handle password validation errors
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.join(', '));
            } else {
                setError(err.response?.data?.message || 'An error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = (newMode) => {
        setAuthMode(newMode);
        setError('');
        setSuccessMessage('');
        if (newMode === 'login' || newMode === 'register') {
            setPassword('');
        }
    };

    const isLogin = authMode === 'login';
    const isRegister = authMode === 'register';
    const isForgot = authMode === 'forgot';
    const isReset = authMode === 'reset';

    return (
        <div className="login-page">
            {/* Left Visual Panel */}
            <div className="login-visual-panel">
                <div className="visual-content">
                    <div className="brand-display">
                        <h1 className="brand-name">
                            <span className="accent">C</span>HEC<span className="accent">K</span>
                        </h1>
                    </div>
                    <div className="visual-text">
                        <h2 className="visual-heading">
                            Know before<br />
                            you spend.
                        </h2>
                    </div>
                </div>
                <div className="visual-pattern" aria-hidden="true"></div>
            </div>

            {/* Right Form Panel */}
            <div className="login-form-panel">
                <header className="panel-header">
                    {/* Mobile branding - visible only on mobile */}
                    <div className="mobile-branding">
                        <h1 className="mobile-brand-name">
                            <span className="accent">C</span>HEC<span className="accent">K</span>
                        </h1>
                    </div>

                    <button
                        className="theme-toggle-btn"
                        onClick={onToggleTheme}
                        aria-label="Toggle Theme"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? <MdSunny size={20} /> : <MdDarkMode size={20} />}
                    </button>
                </header>

                <div className="form-container">
                    <div className="form-header">
                        <h2 className="form-title">
                            {isLogin && 'Welcome back'}
                            {isRegister && 'Create account'}
                            {isForgot && 'Reset Password'}
                            {isReset && 'Enter Reset Code'}
                        </h2>
                        <p className="form-subtitle">
                            {isLogin && 'Enter your details to access your dashboard.'}
                            {isRegister && 'Start your journey to financial clarity today.'}
                            {isForgot && 'Enter your email to receive a temporary reset code.'}
                            {isReset && `We sent a code to ${email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="form-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && !error && (
                        <div className="form-success">
                            <MdCheckCircle className="success-icon" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="premium-form">
                        {(isLogin || isRegister || isForgot || isReset) && (
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-field-wrapper">
                                    <MdEmail className="field-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isReset}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>
                        )}

                        {isReset && (
                            <div className="input-group">
                                <label htmlFor="resetCode">Reset Code</label>
                                <div className="input-field-wrapper">
                                    <MdVpnKey className="field-icon" />
                                    <input
                                        type="text"
                                        id="resetCode"
                                        placeholder="Enter 6-digit code"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        required
                                        maxLength="6"
                                    />
                                </div>
                            </div>
                        )}

                        {(isLogin || isRegister || isReset) && (
                            <div className="input-group">
                                <label htmlFor="password">
                                    {isReset ? 'New Password' : 'Password'}
                                </label>
                                <div className="input-field-wrapper">
                                    <MdLock className="field-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder={isLogin ? 'Enter password' : 'Min. 8 characters'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="8"
                                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    />
                                    <button
                                        type="button"
                                        className="visibility-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                    </button>
                                </div>
                                {(isRegister || isReset) && (
                                    <PasswordStrengthIndicator password={password} />
                                )}
                            </div>
                        )}

                        {isLogin && (
                            <div className="forgot-password-link">
                                <button type="button" className="link-btn" onClick={() => toggleMode('forgot')}>
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (
                                isLogin ? 'Sign In' :
                                    isRegister ? 'Create Account' :
                                        isForgot ? 'Send Code' : 'Update Password'
                            )}
                            {!isLoading && <MdArrowForward className="btn-icon" />}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            {isLogin ? "Don't have an account? " :
                                isRegister ? "Already have an account? " :
                                    "Remember your password? "}
                            <button
                                type="button"
                                className="link-btn"
                                onClick={() => toggleMode(isLogin ? 'register' : 'login')}
                            >
                                {isLogin ? 'Register' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                <footer className="panel-footer">
                    <div className="attribution">
                        <p>Project by Charankarthikeyan S</p>
                        <div className="social-links">
                            <a href="https://github.com/Charan170903" target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                            <a href="https://www.linkedin.com/in/charankarthikeyan-selvakumar-a7a731225/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Login;
