import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './BlogLanguages.module.css';
const API_URL = import.meta.env.VITE_API; // Lấy URL API từ biến môi trường

const BlogLanguages = () => {
 const navigate = useNavigate(); 
    const { id } = useParams();
    const [blogLanguages, setBlogLanguages] = useState([]);

    useEffect(() => {
        const getBlogLanguages = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/blog/blogLanguages`);
                setBlogLanguages(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getBlogLanguages();
    }, []);

    const handleClickToBlog = (blog) => {
        navigate(`/blog/${blog._id}`, { state: blog }); // truyền blog qua location.state
    };

    return (
        <div className={styles.blogLanguagesContainer}>
            {blogLanguages.map((blog) => (
                <div key={blog._id} className={styles.blogCardIn} onClick={() => handleClickToBlog(blog)}>
                    <img src={blog.image} alt={blog.title} />
                    <h4>{blog.title.substring(0, 70)}...</h4>
                </div>
            ))}
        </div>
    );
}

export default BlogLanguages
