import { Breadcrumb, Image } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import styles from './CreateBlog.module.css';

const API_URL = import.meta.env.VITE_API;

const CreateBlog = () => {
    const [formProducts, setFormProducts] = useState({
        title: "",
        image: "",
        content: "",
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormProducts({ ...formProducts, [name]: reader.result });
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormProducts({ ...formProducts, [name]: value });
        }
    };

    const handleEditorChange = (content) => {
        setFormProducts({ ...formProducts, content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/v1/blog/blogLanguages`, formProducts);
            setFormProducts({
                title: "",
                image: "",
                content: "",
            });
            toast.success('Tạo blog thành công');
        } catch (error) {
            toast.error('Lỗi không thể tạo blog mới');
        }
    };

    return (
        <div className={styles.createBlogContainer}>
            <Breadcrumb
                items={[
                    { title: 'Trang chủ' },
                    { title: 'Mục blog' },
                    { title: 'Tạo mới' },
                ]}
                className={styles.breadcrumb}
            />

            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.leftSection}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="blogTitle" className={styles.label}>
                            Tên blog
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="blogTitle"
                            placeholder="Tên blog"
                            value={formProducts.title}
                            onChange={handleChange}
                            className={styles.inputText}
                            required
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Nội dung blog
                        </label>
                        <Editor
                            apiKey="jq89bsmkzsn6b1f9lebu726uarul4fwugf2m9l8fbrdtw4pq"
                            init={{
                                height: 400,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                            value={formProducts.content}
                            onEditorChange={handleEditorChange}
                        />
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                            Upload ảnh blog (1)
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className={styles.fileInput}
                        />
                        <div className={styles.imagePreviewContainer}>

                            {formProducts.image && (
                                <div  >
                                    <Image
                                        src={formProducts.image}
                                        alt="Hình ảnh blog"
                                        className={styles.imagePreview}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Tạo blog
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;
