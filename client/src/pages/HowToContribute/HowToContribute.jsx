import styles from './HowToContribute.module.css';
import { GoRepoForked } from "react-icons/go";
import { IoCodeSlashOutline } from "react-icons/io5";
import { PiTestTube } from "react-icons/pi";
import { BsSend } from "react-icons/bs";
const HowToContribute = () => {
  return (
    <div className={styles.containerContribute}>
                <h2>How to Contribute</h2>
           
            <div className={styles.flexContribute} >
                <div data-aos="zoom-out" className={styles.itemsContribute}>
                    <GoRepoForked className={styles.iconContribute}/>
                    <h3>Fork & Clone</h3>
                    <p>Start by forking the repository of your chosen programming language and clone it locally.</p>
                </div>
                <div data-aos="zoom-out" className={styles.itemsContribute}>
                    <IoCodeSlashOutline className={styles.iconContribute}/>
                    <h3>Implement</h3>
                    <p>Add your algorithm implementation following our coding guidelines and documentation standards.</p>
                </div>
                <div data-aos="zoom-out"  className={styles.itemsContribute}>
                    <PiTestTube className={styles.iconContribute}/>
                    <h3>Test</h3>
                    <p>Ensure your code works correctly by adding appropriate test cases.</p>
                </div>
                <div data-aos="zoom-out" className={styles.itemsContribute}>
                    <BsSend className={styles.iconContribute}/>
                    <h3>Submit</h3>
                    <p>Create a pull request with your changes and wait for review from our maintainers.</p>
                </div>
            </div>
    </div>
  )
}

export default HowToContribute
