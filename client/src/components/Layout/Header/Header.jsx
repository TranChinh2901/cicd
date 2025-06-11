import { useState } from 'react';
import styles from './Header.module.css';
import { FaGithub, FaChevronDown, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { MdLogin, MdLogout, MdDashboard, MdPerson } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        setAuth({
            user: null,
            token: ""
        });
        localStorage.removeItem('auth');
        toast.success('Đăng xuất thành công!');
        navigate('/');
    };

    const handleScrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    };

    const handleNavClick = (e, path, sectionId = null) => {
        e.preventDefault();
        if (sectionId) {
            if (window.location.pathname === '/') {
                scrollToSection(sectionId);
            } else {
                navigate('/');
                setTimeout(() => {
                    scrollToSection(sectionId);
                }, 100);
            }
        } else {
            navigate(path);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <nav className={styles.nav}>
                    <Link to="/" className={styles.logo} onClick={handleScrollTop}>
                        <div className={styles.logoIcon}>
                            <img src="https://the-algorithms.com/images/logo.svg" alt="" />
                        </div>
                        <span>The Algorithms</span>
                    </Link>

                    <ul className={styles.desktopNav}>
                        <li>
                            <Link 
                                to="/" 
                                onClick={(e) => handleNavClick(e, '/about', 'about-section')}
                            >
                                About
                            </Link>
                        </li>
                        <li 
                            className={styles.dropdownContainer}
                            onMouseEnter={() => setIsDesktopDropdownOpen(true)}
                            onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                        >
                            <Link to="/" className={styles.dropdownLink}>
                                Resources <FaChevronDown size={12} />
                            </Link>
                            {isDesktopDropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li>
                                        <Link 
                                            to="/"
                                            onClick={(e) => handleNavClick(e, '/resources/languages', 'languages-section')}
                                        >
                                            Programming Languages
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/"
                                            onClick={(e) => handleNavClick(e, '/resources/algorithms', 'algorithms-section')}
                                        >
                                            Algorithms
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/"
                                            onClick={(e) => handleNavClick(e, '/resources/contribute', 'contribute-section')}
                                        >
                                            How to Contribute
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <Link 
                                to="/"
                                onClick={(e) => handleNavClick(e, '/community', 'community-section')}
                            >
                                Community
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/"
                                onClick={(e) => handleNavClick(e, '/team', 'team-section')}
                            >
                                Team
                            </Link>
                        </li>
                    </ul>

                    <div className={styles.desktopActions}>
                        {auth?.user ? (
                            <div 
                                className={styles.userDropdownContainer}
                                onMouseEnter={() => setIsUserDropdownOpen(true)}
                                onMouseLeave={() => setIsUserDropdownOpen(false)}
                            >
                                <button className={styles.userButton}>
                                    <FaUser size={16} />
                                    <span> {auth.user.name}</span>
                                    <FaChevronDown size={12} />
                                </button>
                                {isUserDropdownOpen && (
                                    <ul className={styles.userDropdownMenu}>
                                        <li>
                                            <Link to="/profile" className={styles.userDropdownLink}>
                                                <MdPerson size={20} />
                                                Profile
                                            </Link>
                                        </li>
                                        {auth.user.role === 1 && (
                                            <li>
                                                <Link to="/admin/dashboard" className={styles.userDropdownLink}>
                                                    <MdDashboard size={16} />
                                                    Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <button onClick={handleLogout} className={styles.logoutButton}>
                                                <MdLogout size={16} />
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                    )}
                            </div>
                        ) : (
                            <Link to="/login" className={`${styles.btn} ${styles.btnDiscord}`}>
                                <MdLogin style={{fontSize: '17px'}}/>
                                <span style={{fontSize: '17px'}}> Join our Team</span>
                            </Link>
                        )}
                        
                        <Link to="https://github.com/TranChinh2901/stratos_projects_library" className={`${styles.btn} ${styles.btnGithub}`}>
                            <FaGithub />
                            <span>Star on GitHub</span>
                        </Link>
                    </div>

                    <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </nav>

                {isMenuOpen && (
                    <div className={styles.mobileMenu}>
                        <ul className={styles.mobileNavLinks}>
                            <li>
                                <Link 
                                    to="/about"
                                    onClick={(e) => {
                                        handleNavClick(e, '/about', 'about-section');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    About
                                </Link>
                            </li>
                            <li className={styles.mobileDropdownContainer}>
                                <button onClick={toggleMobileResources} className={styles.mobileDropdownToggle}>
                                    <span>Resources</span>
                                    <FaChevronDown className={`${styles.chevron} ${isMobileResourcesOpen ? styles.chevronOpen : ''}`} />
                                </button>
                                {isMobileResourcesOpen && (
                                    <ul className={styles.mobileSubMenu}>
                                        <li>
                                            <Link 
                                                to="/"
                                                onClick={(e) => {
                                                    handleNavClick(e, '/resources/languages', 'languages-section');
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Programming Languages
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                to="/"
                                                onClick={(e) => {
                                                    handleNavClick(e, '/resources/algorithms', 'algorithms-section');
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                Algorithms
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                to="/"
                                                onClick={(e) => {
                                                    handleNavClick(e, '/resources/contribute', 'contribute-section');
                                                    setIsMenuOpen(false);
                                                }}
                                            >
                                                How to Contribute
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <Link 
                                    to="/"
                                    onClick={(e) => {
                                        handleNavClick(e, '/community', 'community-section');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/"
                                    onClick={(e) => {
                                        handleNavClick(e, '/team', 'team-section');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Team
                                </Link>
                            </li>       
                            {auth?.user ? (
                                <>
                                    <li className={styles.liMobile}>
                                        <Link to="/profile" className={`${styles.btn} ${styles.btnDiscord}`}>
                                            <MdPerson style={{fontSize: '16px', color:'white'}}/>
                                            <span style={{fontSize: '17px', color:'white'}}>Profile</span>
                                        </Link>
                                    </li>
                                    {auth.user.role === 1 && (
                                        <li className={styles.liMobile}>
                                            <Link to="/admin/dashboard" className={`${styles.btn} ${styles.btnDiscord}`}>
                                                <MdDashboard style={{fontSize: '16px', color:'white'}}/>
                                                <span style={{fontSize: '17px', color:'white'}}>Dashboard</span>
                                            </Link>
                                        </li>
                                    )}
                                    <li className={styles.liMobile} style={{textAlign: 'center'}}>
                                        <button onClick={handleLogout} className={`${styles.btn} ${styles.btnDiscord}`} style={{width: '100%', textAlign:'center'}}>
                                            <MdLogout style={{fontSize: '16px', color:'white', textAlign:'center'}}/>
                                            <span style={{fontSize: '17px', color:'white',textAlign:'center'}}>Đăng xuất</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className={styles.liMobile}>
                                    <Link to="/login" className={`${styles.btn} ${styles.btnDiscord}`}>
                                        <MdLogin style={{fontSize: '16px', color:'white'}}/>
                                        <span style={{fontSize: '17px', color:'white'}}> Join our Team</span>
                                    </Link>
                                </li>
                            )}
                            
                            <li className={styles.liMobile}>
                                <Link to="https://github.com/TranChinh2901/stratos_projects_library" className={`${styles.btn} ${styles.btnGithub}`}>
                                    <FaGithub style={{color:'white'}}/>
                                    <span style={{fontSize: '16px', color:'white', marginLeft:'4px'}}>Star on GitHub</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;