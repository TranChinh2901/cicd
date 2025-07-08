import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./DeleteBlog.module.css";
import { Breadcrumb, Button, Image } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API;

const DeleteBlog = () => {
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
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/api/v1/blog/blogLanguages/${id}`);
            console.log(res.data);
            setBlogs(blogs.filter((blog) => blog._id !== id));
            toast.success("Xóa blog thành công!");
        } catch (error) {
            console.log(error);
            toast.error("Lỗi không thể xóa blog.");
        }
    }
    return (
        <div className={styles.blogContainer}>
            <Breadcrumb
                items={[
                    { title: 'Dashboard' },
                    { title: 'Mục blog' },
                    { title: 'Xóa blog  ' },
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
                        <Button
                            className={styles.dangerButton}
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(blog._id)}
                        >
                            Xóa
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeleteBlog;
