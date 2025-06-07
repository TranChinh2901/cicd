import { useState } from 'react';
import styles from './Header.module.css';
import { FaGithub, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { MdLogin } from "react-icons/md";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) {
            setIsMobileResourcesOpen(false);
        }
    };
    const toggleMobileResources = (e) => {
        e.preventDefault(); 
        setIsMobileResourcesOpen(!isMobileResourcesOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    <a href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <img src="https://the-algorithms.com/images/logo.svg" alt="" />
                        </div>
                        <span>The Algorithms</span>
                    </a>

                    <ul className={styles.desktopNav}>
                        <li><a href="/about">About</a></li>
                        <li 
                            className={styles.dropdownContainer}
                            onMouseEnter={() => setIsDesktopDropdownOpen(true)}
                            onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                        >
                            <a href="/resources" className={styles.dropdownLink}>
                                Resources <FaChevronDown size={12} 
                                />
                            </a>
                            {isDesktopDropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li><a href="/resources/languages">Programming Languages</a></li>
                                    <li><a href="/resources/algorithms">Algorithms</a></li>
                                    <li><a href="/resources/contribute">How to Contribute</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/community">Community</a></li>
                        <li><a href="/team">Team</a></li>
                    </ul>
                    <div className={styles.desktopActions}>
                       
                        <a href="/login" className={`${styles.btn} ${styles.btnDiscord}`}>
                            <MdLogin style={{fontSize: '17px'}}/>
                            <span style={{fontSize: '17px'}}> Login</span>
                        </a>
                         <a href="https://github.com/TranChinh2901/stratos_projects_library" className={`${styles.btn} ${styles.btnGithub}`}>
                            <FaGithub />
                            <span >Star on GitHub</span>
                        </a>
                    </div>

                    <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </nav>
                {isMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <ul className={styles.mobileNavLinks}>
                            <li><a href="/about">About</a></li>
                            <li className={styles.mobileDropdownContainer}>
                                <button onClick={toggleMobileResources} className={styles.mobileDropdownToggle}>
                                    <span>Resources</span>
                                    <FaChevronDown className={`${styles.chevron} ${isMobileResourcesOpen ? styles.chevronOpen : ''}`} />
                                </button>
                                {isMobileResourcesOpen && (
                                    <ul className={styles.mobileSubMenu}>
                                        <li><a href="/resources/languages">Programming Languages</a></li>
                                        <li><a href="/resources/algorithms">Algorithms</a></li>
                                        <li><a href="/resources/contribute">How to Contribute</a></li>
                                    </ul>
                                )}
                            </li>
                            <li><a href="/community">Community</a></li>
                            <li><a href="/team">Team</a></li>
                            <li className={styles.liMobile}> <a href="#" className={`${styles.btn} ${styles.btnDiscord}`}>
                              <MdLogin style={{fontSize: '16px', color:'white'}}/>
                            <span style={{fontSize: '17px', color:'white'}}> Login</span>
                        </a> </li>
                        <li className={styles.liMobile}>
                             <a href="#" className={`${styles.btn} ${styles.btnGithub}`}>
                            <FaGithub style={{color:'white'}}/>
                            <span style={{fontSize: '16px', color:'white', marginLeft:'4px'}}>Star on GitHub</span>
                        </a>
                        </li>
                        </ul>
                        
                        <div className={styles.mobileActions}>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;