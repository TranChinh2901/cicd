import styles from './JoinOurCommunity.module.css';
import groupImage from '../../assets/group.jpg';
import { FaGithub } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";
import { IoLogoLinkedin } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { Image } from 'antd';
const JoinOurCommunity = () => {
  return (
    <div className={styles.JoinOurCommunityContainer}>
        <h2>Join Our Community</h2>
        <div className={styles.flexCommunity}>
            <div className={styles.leftCommunity} data-aos="flip-right">
                <p>
                    Join our vibrant community of developers and enthusiasts! 
                    Connect with like-minded individuals, share your knowledge, 
                    and collaborate on exciting projects. Whether you're a beginner 
                    or an experienced coder, there's a place for you here.
                </p>
                <p>
                    Engage in discussions, ask questions, and get help from fellow 
                    members. Together, we can learn, grow, and make a difference in the world of programming.
                </p>
                <a href="https://github.com/TranChinh2901" target="_blank" rel="noopener noreferrer" className={styles.joinButton}>
                  <FaGithub/> Github
                </a>
                 <a href="https://www.facebook.com/tranchinh04/" target="_blank" rel="noopener noreferrer" className={styles.joinButton}>
                 <MdFacebook/>  Facebook
                </a>
                 <a href="https://www.linkedin.com/in/ch%C3%ADnh-tr%E1%BA%A7n-vi%E1%BA%BFt-099370355/" target="_blank" rel="noopener noreferrer" className={styles.joinButton}>
                  <IoLogoLinkedin/> LinkedIn
                </a>
                 <a href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=tranchinht32901@gmail.com" target="_blank" rel="noopener noreferrer" className={styles.joinButton}>
                  <IoMdMail/> Gmail
                </a>
            </div>
            <div className={styles.rightCommunity} data-aos="flip-left">
                <Image src={groupImage} alt="Community group" />
            </div>
        </div>
    </div>
  )
}
export default JoinOurCommunity