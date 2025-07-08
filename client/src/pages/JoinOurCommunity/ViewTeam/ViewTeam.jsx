import { IoMdArrowBack } from "react-icons/io"
import Layout from "../../../components/Layout/Layout"
import styles from "./ViewTeam.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API;
 
const ViewTeam = () => {
    const [countUsers, setCountUsers] = useState(0);
    const [usersM, setUsersM] = useState([]);
    useEffect(() => {
        const getCountUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/auth/count-users`);
                setCountUsers(response.data.count);
            } catch (error) {
                console.log(error);
            }
        }
        getCountUsers();
    }, [])
    useEffect(() => {
        const getAllusers = async () => {
            try {
                const userMembers = await axios.get(`${API_URL}/api/v1/auth/users`);
                setUsersM(userMembers.data.users);
            } catch (error) {
                console.log(error);
                
            }
        }
        getAllusers();
    },[])
  
    const handleback = () => {
        window.history.back();
    }
     const getRandomAvatar = (userId, userName) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=200`;
    };
  return (
    <Layout>
        <div className={styles.containerViewTeam}>
               <div className={styles.inContainerViewTeam} >
                 <div className={styles.leftViewTeam}>
                    <h3>All members of our team</h3>
                   
                     <button onClick={handleback}><IoMdArrowBack/> quay lại</button>
                </div>
                <div className={styles.rightViewTeam}>
                         <h3>Members: {countUsers }</h3>
                         <div className={styles.itemsViewTeam}>
                            {usersM.map((user) => (
                                <div className={styles.inItemViewTeam} key={user._id}>
                                <div className={styles.inItemViewTeamCardInfo}>
                                       <img 
                        src={getRandomAvatar(user._id, user.name)}
                        alt={user.name}
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            marginBottom: '10px',
                            objectFit: 'cover'
                        }}
                    />
                                   <div className={styles.inItemViewTeamInfo}>
                                     <h4>{user.name}</h4>
                                    <p>{user.email}</p>
                                   </div>
                                </div>
                                    <a href={user.github}> Check</a>
                                </div>
                            ))}
                         </div>
                </div>
               </div>
        </div>
    </Layout>
  )
}

export default ViewTeam
