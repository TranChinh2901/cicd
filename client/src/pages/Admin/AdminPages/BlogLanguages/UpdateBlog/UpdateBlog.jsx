import { Breadcrumb, Image } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate, useParams } from "react-router-dom";
import styles from './UpdateBlog.module.css';
import LoadingAdmin from "../../../LoadingAdmin";

const API_URL = import.meta.env.VITE_API;

const UpdateBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", image: "", content: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/blog/blogLanguages/${id}`);
                const data = res.data?.data || res.data;
                setForm({
                    title: data.title || "",
                    image: data.image || "",
                    content: data.content || ""
                });
                setImagePreview(data.image || "");
            } catch {
                toast.error("Lỗi khi tải dữ liệu blog");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files?.[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(f => ({ ...f, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } else {
            setForm(f => ({ ...f, [name]: value }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/v1/blog/blogLanguages/${id}`, form);
            toast.success("Cập nhật blog thành công");
            navigate('/admin/blogs/view');
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi không thể cập nhật blog");
        }
    };

    if (loading) {
        return (
            <LoadingAdmin />

        );
    }

    return (
        <div className={styles.createBlogContainer}>
            <Breadcrumb
                items={[
                    { title: 'Trang chủ' },
                    { title: 'Mục blog' },
                    { title: 'Cập nhật' }
                ]}
                className={styles.breadcrumb}
            />
            <form className={styles.formContainer} onSubmit={handleUpdate}>
                <div className={styles.leftSection}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Tên blog</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className={styles.inputText}
                            placeholder="Tên blog"
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Nội dung blog</label>
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
                                toolbar:
                                    'undo redo | formatselect | fontsizeselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                            value={form.content}
                            onEditorChange={content => setForm(f => ({ ...f, content }))}
                        />
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Upload ảnh blog</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className={styles.fileInput}
                        />
                        {imagePreview && (
                            <div className={styles.imagePreviewContainer}>
                                <Image
                                    src={imagePreview}
                                    alt="Hình ảnh blog"
                                    className={styles.imagePreview}
                                />
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" className={styles.submitButton}>
                            Cập nhật blog
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateBlog;
