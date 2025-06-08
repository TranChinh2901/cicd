import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import styles from './HomePage.module.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import AboutPage from '../AboutPage/AboutPage';

const HomePage = () => {
   useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    AOS.init({
      duration: isMobile ? 600 : 1000,
      once: true,
      easing: 'ease-out-cubic',
      disable: window.innerWidth < 480 ? true : false, 
    });
    
    window.addEventListener('load', () => {
      AOS.refresh();
    });
    
    return () => {
      window.removeEventListener('load', () => {
        AOS.refresh();
      });
    };
  }, []);
  
  return (
    <Layout>
       <div className={styles.containerHome}>
        <div 
          data-aos={window.innerWidth <= 768 ? "fade-in" : "zoom-out"} 
          className={styles.inContainerHome}
        >
           <h1>Learn Algorithms & Data Structures</h1>
           <p>Open source resource for learning algorithms and their implementation in any programming language</p>
       
          <div className={styles.buttonContainerHome}>
             <Link to="/languages" className={styles.buttonHomeA}>
              Explore Languages
            </Link>
            <a 
              href="https://github.com/your-repo-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.buttonHomeB}
            >
              View On Github
            </a>
          </div>
        </div>
        <AboutPage/>
       </div>
    </Layout>
  )
}

export default HomePage