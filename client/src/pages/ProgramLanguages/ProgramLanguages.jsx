import { useEffect, useState } from 'react';
import styles from './ProgramLanguages.module.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API;

const ProgramLanguages = () => {
    const { slug } = useParams();
    const [brandLanguages, setBrandLanguages] = useState([]);
    
    useEffect(() => {
        const getBrandProgramLanguages = async () => {
            try {
               const res = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
                if (res.data.success) {
                    setBrandLanguages(res.data.data);
                } else {
                    console.error('Failed to fetch programming languages:', res.data.message);
                }
            } catch (error) {
                console.error('Error fetching programming languages:', error);
            }
        }
        getBrandProgramLanguages();
    }, []);

    const handleSctrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    return (
        <div className={styles.programLanguagesContainer}>
            <div className={styles.programLanguagesContent}>
                <div data-aos="fade-right">
                    <h2 >Programming Languages</h2>
                    <p className={styles.description}>
                        Explore various programming languages and their unique features.
                    </p>
                </div>
                <div  className={styles.languagesList}>
                    {
                        brandLanguages.map((brand) => (
                            <div data-aos="flip-up" key={brand.id || brand._id} className={styles.brandCard}>
                                <img 
                                    src={brand.logoBrand} 
                                    alt={brand.nameBrand} 
                                    className={styles.brandImage}
                                /> 
                                <h3>{brand.nameBrand}</h3>
                                <p>Awesome for beginners</p>
                                
                                <Link to={`/category/${brand.slug}`} className={styles.exploreLink} onClick={handleSctrollToTop}>
                                    Explore
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ProgramLanguages