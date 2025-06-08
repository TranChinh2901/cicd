import { useEffect, useState } from 'react';
import styles from './ProgramLanguages.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API;
const ProgramLanguages = () => {
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
  return (
    <div className={styles.programLanguagesContainer}>
        <div className={styles.programLanguagesContent}>
         <div data-aos="fade-right">
               <h2 className={styles.title}>Programming Languages</h2>
        <p className={styles.description}>
            Explore various programming languages and their unique features.
        </p>
         </div>
        <div data-aos="flip-up" className={styles.languagesList}>
         {
            brandLanguages.map((brand) => (
                        <div key={brand.id || brand._id} className={styles.brandCard}>
                          <img 
                                    src={brand.logoBrand} 
                                    alt={brand.nameBrand} 
                                    className={styles.brandImage}
                                /> 
                            <h3>{brand.nameBrand}</h3>
                                <p>Awesome for beginners</p>
                            <Link>Explore</Link>
                        </div>
            ))
        }
        </div>

        </div>
    </div>
  )
}

export default ProgramLanguages
