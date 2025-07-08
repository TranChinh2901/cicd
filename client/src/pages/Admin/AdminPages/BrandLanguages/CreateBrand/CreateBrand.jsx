import { Breadcrumb, Image } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import styles from "./CreateBrand.module.css";

const API_URL = import.meta.env.VITE_API;

const CreateBrand = () => {
    const [brandForm, setBrandForm] = useState({
        nameBrand: "",
        logoBrand: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "logoBrand" && files && files[0]) {
            const file = files[0];

            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                toast.error('Bạn chỉ có thể tải lên file JPG/PNG!');
                return;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                toast.error('Ảnh phải nhỏ hơn 2MB!');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setBrandForm({ ...brandForm, [name]: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
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

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/api/v1/brand/brandLanguage`, {
                nameBrand: brandForm.nameBrand.trim(),
                logoBrand: brandForm.logoBrand
            });

            console.log('Thêm mới thương hiệu thành công:', response.data);

            // Reset form
            setBrandForm({
                nameBrand: "",
                logoBrand: "",
            });
            setImagePreview("");

            toast.success('Tạo thương hiệu mới thành công');

        } catch (error) {
            console.error("Lỗi không thể tạo thương hiệu mới:", error);
            toast.error("Không thể tạo mới");

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.createBrandContainer}>
            <Breadcrumb
                items={[
                    { title: 'Trang chủ' },
                    { title: 'QL ngôn ngữ LT' },
                    { title: 'Tạo mới ' },
                ]}
                className={styles.breadcrumb}
            />

            <form className={styles.createBrandForm} onSubmit={handleSubmit}>
                <div className={styles.formSection}>
                    <h5 className={styles.sectionTitle}>Form tạo mới</h5>
                    <hr className={styles.divider} />

                    <div className={styles.formGroup}>
                        <label htmlFor="nameBrand" className={styles.formLabel}>
                            Tên ngôn ngữ LT <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="nameBrand"
                            id="nameBrand"
                            placeholder="Nhập tên ngôn ngữ lập trình"
                            value={brandForm.nameBrand}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="logoBrand" className={styles.formLabel}>
                            Logo ngôn ngữ LT <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="file"
                            name="logoBrand"
                            id="logoBrand"
                            onChange={handleChange}
                            className={styles.fileInput}
                            accept="image/jpeg,image/png"
                            required
                            disabled={isSubmitting}
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Chỉ chấp nhận file JPG/PNG, tối đa 2MB
                        </small>
                        {imagePreview && (
                            <div className={styles.imagePreviewContainer}>
                                <Image
                                    src={imagePreview}
                                    alt="Logo Preview"
                                    className={styles.logoPreviewImage}
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.submitButtonContainer}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang tạo...' : 'Tạo mới ngôn ngữ LT'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBrand;