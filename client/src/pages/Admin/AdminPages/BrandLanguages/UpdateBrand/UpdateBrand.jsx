import { Breadcrumb, Image } from "antd";
import styles from './UpdateBrand.module.css';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API;

const UpdateBrand = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [brandForm, setBrandForm] = useState({
        nameBrand: "",
        logoBrand: "",
    });

    useEffect(() => {
        if (!slug) {
            toast.error(`Không tìm thấy thương hiệu để cập nhật.`);
            navigate('/admin/brands/view');
        }
    })
    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages/${slug}`);
                setBrandForm(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error('Không thể tải thông tin thương hiệu để cập nhật.');
                navigate('/admin/brands/view');
            }
        };
        fetchBrand();
    }, [slug, navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBrandForm({ ...brandForm, [name]: reader.result });
            };
            reader.readAsDataURL(files[0]);
        } else {
            setBrandForm({ ...brandForm, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!brandForm.nameBrand.trim()) {
            toast.error('Vui lòng nhập tên thương hiệu');
            return;
        }

        if (!brandForm.logoBrand) {
            toast.error('Vui lòng chọn logo thương hiệu');
            return;
        }

        try {
            const response = await axios.put(`${API_URL}/api/v1/brand/brandLanguages/${slug}`, brandForm);
            console.log('Cập nhật thương hiệu thành công:', response.data);
            toast.success('Cập nhật thương hiệu thành công!');
            navigate('/admin/brands/view');
        } catch (error) {
            console.error("Lỗi không thể cập nhật thương hiệu:", error);
            toast.error(`Lỗi không thể cập nhật: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <div>
                <Breadcrumb
                    items={[
                        { title: 'Trang chủ' },
                        { title: 'QL ngôn ngữ LT' },
                        { title: 'Cập nhật ' },
                    ]}
                    style={{ margin: '16px 0' }}
                />
            </div>

            <form className={styles.updateBrandForm} onSubmit={handleSubmit}>
                <div className={styles.leftColumn}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nameBrand" className={styles.label}>
                            Tên ngôn ngữ LT
                        </label>
                        <input
                            type="text"
                            name="nameBrand"
                            id="nameBrand"
                            placeholder="Nhập tên thương hiệu"
                            value={brandForm.nameBrand}
                            onChange={handleChange}
                            className={styles.inputField}
                            required
                        />
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    <h5 className={styles.sectionTitle}>Phần Logo ngôn ngữ lập trình</h5>
                    <hr className={styles.divider} />

                    <div className={styles.formGroupImage}>
                        <label htmlFor="logoBrand" className={styles.label}>
                            Upload Logo (1)
                        </label>
                        <input
                            type="file"
                            name="logoBrand"
                            id="logoBrand"
                            onChange={handleChange}
                            className={styles.fileInput}
                        />
                        {brandForm.logoBrand && (
                            <div className={styles.imagePreviewContainer}>
                                <Image
                                    src={brandForm.logoBrand}
                                    alt="Logo Preview"
                                    className={styles.imagePreview}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.buttonContainer}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Update ngôn ngữ LT
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateBrand;