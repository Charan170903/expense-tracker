import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MdEmail,
    MdLock,
    MdVisibility,
    MdVisibilityOff,
    MdArrowForward,
    MdSunny,
    MdDarkMode
} from 'react-icons/md';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Login.css';

const Login = ({ theme, onToggleTheme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
    };

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
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="form-subtitle">
                            {isLogin
                                ? 'Enter your details to access your dashboard.'
                                : 'Start your journey to financial clarity today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="form-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="premium-form">
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
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-field-wrapper">
                                <MdLock className="field-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder={isLogin ? 'Enter password' : 'Min. 6 characters'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
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
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            {!isLoading && <MdArrowForward className="btn-icon" />}
                        </button>
                    </form>

                    <div className="form-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button type="button" className="link-btn" onClick={toggleMode}>
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
