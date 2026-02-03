import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p className="footer-text">
                    Designed and Developed by <span>Charankarthikeyan S</span>
                </p>
                <div className="footer-links">
                    <a
                        href="https://github.com/Charan170903"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                        title="GitHub Profile"
                    >
                        <FaGithub />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/charankarthikeyan-selvakumar-a7a731225/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                        title="LinkedIn Profile"
                    >
                        <FaLinkedin />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
