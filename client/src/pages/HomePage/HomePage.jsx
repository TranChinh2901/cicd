import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import styles from './HomePage.module.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import AboutPage from '../AboutPage/AboutPage';
import ProgramLanguages from '../ProgramLanguages/ProgramLanguages';
import PopularAlgo from '../PopularAlgo/PopularAlgo';
import HowToContribute from '../HowToContribute/HowToContribute';
import JoinOurCommunity from '../JoinOurCommunity/JoinOurCommunity';
import OurTeam from '../OurTeam/OurTeam';
import Chatbot from '../../utils/Chatbot_fe';

const HomePage = () => {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    AOS.init({
      duration: isMobile ? 900 : 1000,
      once: true,
      easing: 'ease-out-cubic',
      disable: window.innerWidth < 180 ? true : false,
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
    <Layout title={"Stratos - Home"} description="Learn Algorithms and Data Structures with Stratos, an open-source resource for mastering algorithms and their implementation in any programming language.">
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
              href="https://github.com/TranChinh2901/stratos_projects_library"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonHomeB}
            >
              View On Github
            </a>
          </div>
        </div>
        <section id="about-section">
          <AboutPage />
        </section>
        <section id="languages-section">
          <ProgramLanguages />
        </section>
        <section id="algorithms-section">
          <PopularAlgo />
        </section>
        <section id="contribute-section">
          <HowToContribute />
        </section>
        <section id="community-section">
          <JoinOurCommunity />
        </section>
        <section id="team-section">
          <OurTeam />
        </section>
        <div>
          <Chatbot />
        </div>
      </div>
    </Layout>
  )
}

export default HomePage