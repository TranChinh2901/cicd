import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./ViewBlogs.module.css";
import { Breadcrumb, Image } from "antd";
import { FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API;

const ViewBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const getAllBlogs = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/blog/blogLanguages`);
                setBlogs(response.data.data);
            } catch (error) {
                console.log(error);
                toast.error("Lỗi không thể lấy danh sách blogs.");
            }
        };
        getAllBlogs();
    }, []);

    return (
        <div className={styles.blogContainer}>
            <Breadcrumb
                items={[
                    { title: 'Dashboard' },
                    { title: 'Mục blog' },
                    { title: 'Xem blog ' },
                ]}
                style={{ margin: '16px 0' }}
            />

            <ul className={styles.blogList}>
                {blogs.map((blog) => (
                    <li key={blog._id} className={styles.blogItem}>
                        <h2 className={styles.blogTitle}>{blog.title}</h2>
                        <div
                            className={styles.blogContent}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content.substring(0, 400)) + '...' }}
                        />

                        <Image src={blog.image} alt="" className={styles.blogImage} />
                        <p className={styles.blogDate}>
                            Created At: {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                        <Link className={styles.iconBlog} to={`/admin/blogs/edit/${blog._id}`}>
                            <FiEdit3 /> Chỉnh sửa
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewBlogs;
