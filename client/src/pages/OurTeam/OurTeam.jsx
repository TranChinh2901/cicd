import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './OurTeam.module.css';
const API_URL = import.meta.env.VITE_API;
import { FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { GrLinkNext } from "react-icons/gr";

const OurTeam = () => {
   const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/v1/auth/users`);
                setUsers(data.users);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách user:', error);
            }
        };
        fetchUsers();
    }, []);

    const getRandomAvatar = (userId, userName) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=200`;
    };

    const checkRole = (role) => {
        if(role === 0) {
            return 'User';
        } else {
            return 'Admin';
        }
    }
    return (
        <div className={styles.ourTeamContainer}>
          <div data-aos="fade-right">
              <h2 >Our Team</h2>
            <p>Meet the amazing people behind The Algorithms</p>
          </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '22px', marginTop: '35px' }}>
            {users.map((user) => (
                <div key={user._id} style={{ 
                    // border: '1px solid rgb(220, 234, 248)', 
                    borderRadius: '10px', 
                    padding: '20px', 
                    textAlign: 'center',
                   backgroundColor: '#f2f6fa'
                }}
                data-aos="flip-down"
                >
                    <img 
                        src={getRandomAvatar(user._id, user.name)}
                        alt={user.name}
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            marginBottom: '10px',
                            objectFit: 'cover'
                        }}
                    />
                    <h3 style={{fontWeight: 500, marginTop:'15px'}}>{user.name}</h3>
                    <a  className={styles.linkGithub} href={user.github}><FaGithub className={styles.iconGithub}/></a>
                    {/* <p>{user.email}</p> */}
                    {/* <p className={styles.checkrole}>{checkRole(user.role)}</p> */}
                </div>
            ))}
        </div>
            <Link to="/view-members" className={styles.nextToView}>View All Team Members<GrLinkNext/> </Link>
        </div>  
    );
}

export default OurTeam
