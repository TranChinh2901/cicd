// src/components/Header/Header.jsx

import React, { useState } from 'react';
import styles from './Header.module.css';
import { FaDiscord, FaGithub, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { MdLogin } from "react-icons/md";

const Header = () => {
    // State cho menu mobile chính
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // State cho dropdown trên DESKTOP
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    
    // State MỚI cho dropdown "Resources" trên MOBILE
    const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Khi đóng menu chính, cũng đóng các dropdown con
        if (isMenuOpen) {
            setIsMobileResourcesOpen(false);
        }
    };

    // Hàm cho dropdown trên MOBILE
    const toggleMobileResources = (e) => {
        e.preventDefault(); // Ngăn hành vi mặc định nếu là thẻ a
        setIsMobileResourcesOpen(!isMobileResourcesOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    {/* ... (Phần logo không đổi) ... */}
                    <a href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <img src="https://the-algorithms.com/images/logo.svg" alt="" />
                        </div>
                        <span>The Algorithms</span>
                    </a>

                    {/* Navigation Links - Desktop */}
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

                    {/* ... (Phần Action Buttons - Desktop không đổi) ... */}
                    <div className={styles.desktopActions}>
                       
                        <a href="#" className={`${styles.btn} ${styles.btnDiscord}`}>
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

                {/* Mobile Menu - CÓ CẬP NHẬT DROPDOWN */}
                {isMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <ul className={styles.mobileNavLinks}>
                            <li><a href="/about">About</a></li>
                            
                            {/* --- PHẦN DROPDOWN CHO MOBILE --- */}
                            <li className={styles.mobileDropdownContainer}>
                                <button onClick={toggleMobileResources} className={styles.mobileDropdownToggle}>
                                    <span>Resources</span>
                                    {/* Icon mũi tên sẽ xoay khi mở */}
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