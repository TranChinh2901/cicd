import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./AboutPage.module.css";
import { FaCircleCheck } from "react-icons/fa6";
import { IoCodeSlashOutline } from "react-icons/io5";
import { IoIosGitBranch } from "react-icons/io";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { LiaSitemapSolid } from "react-icons/lia";
// Đếm số
const Counter = ({ from = 0, to, duration = 1000 }) => {
    const [count, setCount] = useState(from);
    const ref = useRef(null); 

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = from;
                    const end = to;
                    const increment = end / (duration / 10);
                    
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            start = end;
                            clearInterval(timer);
                        }
                        setCount(Math.floor(start));
                    }, 10);
                    observer.unobserve(entry.target);
                    
                    return () => clearInterval(timer); 
                }
            },
            {
                threshold: 0.5, 
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [to, duration, from]);

    return <span className={styles.countNumber} ref={ref}>{count.toLocaleString()}+</span>;
};


const AboutPage = () => {
    const [countUsers, setCountUsers] = useState(0);
    const [countBrands, setCountBrands] = useState(0); 
    const [countLanguages, setCountLanguages] = useState(0); 
    const [countCategories, setCountCategories] = useState(0); 
    const API_URL = import.meta.env.VITE_API;
    
    useEffect(() => {
        fetchCounts();
    }, []); 
    const fetchCounts = async () => {
        try {
            await Promise.all([
                axios.get(`${API_URL}/api/v1/auth/count-users`).then(response => {
                    if (response.data.success) {
                        setCountUsers(typeof response.data.count === 'object' ? response.data.count.count || 0 : response.data.count);
                    }
                }).catch(error => console.error("Error fetching users count:", error)),
        
                axios.get(`${API_URL}/api/v1/brand/count-brandLanguages`).then(response => {
                    if (response.data.success) {
                        setCountBrands(typeof response.data.data === 'object' ? response.data.data.count || 0 : response.data.data);
                    }
                }).catch(error => console.error("Error fetching brands count:", error)),
                
                axios.get(`${API_URL}/api/v1/language/count-languages`).then(response => {
                    if (response.data.success) {
                        setCountLanguages(typeof response.data.data === 'object' ? response.data.data.count || 0 : response.data.data);
                    }
                }).catch(error => console.error("Error fetching languages count:", error)),
                
                axios.get(`${API_URL}/api/v1/category/count-categoryLanguages`).then(response => {
                    if (response.data.success) {
                        setCountCategories(typeof response.data.data === 'object' ? response.data.data.count || 0 : response.data.data);
                    }
                }).catch(error => console.error("Error fetching categories count:", error))
            ]);
        } catch (error) {
            console.error("General error fetching counts:", error);
        }
    };
    
    return (
        <div className={styles.containerAbout}>
            <div className={styles.inContainerAbout}>       
                <h2>About The Algorithms</h2> 

                <div className={styles.aboutContentFlex}>
                    <div className={styles.aboutBox}> 
                        <div className={styles.iconWrapper}>
                            <IoIosGitBranch className={styles.icon} />
                        </div>
                        <Counter to={countLanguages > 0 ? countLanguages : 30} duration={1500}  /> 
                        <h4>Programming Languages</h4> 
                    </div>
                    <div className={styles.aboutBox}> 
                        <div className={styles.iconWrapper}>
                            <IoCodeSlashOutline className={styles.icon} /> 
                        </div>
                       <Counter to={countBrands > 0 ? countBrands : 30} duration={1500} /> 
                        <h4>Brands</h4>
                    </div>
                    <div className={styles.aboutBox}> 
                        <div className={styles.iconWrapper}>
                            <HiOutlineUserGroup className={styles.icon} /> 
                        </div>
                       
                        <Counter to={countUsers > 0 ? countUsers : 1000} duration={1500} /> 
                             <h4>Members & Contributors</h4>
                    </div>
                    <div className={styles.aboutBox}>
                        <div className={styles.iconWrapper}>
                            <LiaSitemapSolid className={styles.icon} /> 
                        </div>
                        <Counter to={countCategories > 0 ? countCategories : 1000} duration={1500} /> 
                        <h4>Categories</h4> 
                    </div>
                    <div className={styles.aboutDescription}>
                        <p>The Algorithms is the largest open-source algorithm library on GitHub, backed by an <br /> active community of developers worldwide.</p>
                    </div>

                    <div className={styles.flexAboutBox}>
                            <div className={styles.inFlexAboutBox}>
                                <FaCircleCheck/>
                                <p>Clear, well-documented implementations in multiple programming languages</p>
                            </div>
                             <div className={styles.inFlexAboutBox}>
                                <FaCircleCheck/>
                                <p>Beginner-friendly explanations and step-by-step guides</p>
                            </div>
                             <div className={styles.inFlexAboutBox}>
                                <FaCircleCheck/>
                                <p>Active community support and code reviews</p>
                            </div>
                             <div className={styles.inFlexAboutBox}>
                                <FaCircleCheck/>
                                <p>Educational resources for computer science students</p>
                            </div>
                             <div className={styles.inFlexAboutBox}>
                                <FaCircleCheck/>
                                <p>Regular updates and maintenance by expert developers </p>
                            </div>
                             <div className={styles.inFlexAboutBox}>
                                <FaCircleCheck/>
                                <p>Cross-platform compatibility and optimized implementations</p>
                            </div>
                    </div>
                </div>
            
            </div>
        </div>
    );
};

export default AboutPage;