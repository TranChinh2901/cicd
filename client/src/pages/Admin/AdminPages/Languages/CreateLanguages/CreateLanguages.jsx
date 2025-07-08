import { Breadcrumb, Image, Select } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./CreateLanguages.module.css";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API;

const CreateLanguages = () => {
    const [formProducts, setFormProducts] = useState({
        name: "",
        answer: "",
        description: "",
        image: "",
        categoryLanguages: "",
        brandLanguages: "",
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages`);
            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Không thể tải danh sách danh mục");
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/brand/brandLanguages`);
            if (response.data.success) {
                setBrands(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error("Không thể tải danh sách thương hiệu");
        }
    };

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

    const handleCategoryChange = (value) => {
        setFormProducts(prev => ({ ...prev, categoryLanguages: value }));
    };

    const handleBrandChange = (value) => {
        setFormProducts(prev => ({ ...prev, brandLanguages: value }));
    };

    const handleEditorChange = (content) => {
        setFormProducts(prev => ({ ...prev, description: content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log('Submitting data:', formProducts);

            const response = await axios.post(`${API_URL}/api/v1/language/languages`, {
                name: formProducts.name,
                answer: formProducts.answer,
                description: formProducts.description,
                image: formProducts.image,
                categoryLanguages: formProducts.categoryLanguages,
                brandLanguages: formProducts.brandLanguages
            });

            console.log('Success response:', response.data);
            toast.success('Tạo ngôn ngữ thành công!');

            // Reset form
            setFormProducts({
                name: "",
                answer: "",
                description: "",
                image: "",
                categoryLanguages: "",
                brandLanguages: "",
            });
            setImagePreview("");

        } catch (error) {
            console.log(error);

            toast.error(' Lỗi không thể tạo ngôn ngữ mới');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Breadcrumb
                items={[
                    { title: 'Dashboard' },
                    { title: 'QL bài học' },
                    { title: 'Tạo mới' },
                ]}
                style={{ margin: '10px 0' }}
            />

            <form className={styles.createCategoryCha} onSubmit={handleSubmit}>
                <div className={styles.tableCreateLeft}>
                    <div className={styles.createLeftIn}>
                        <div className={styles.flexCreateIn}>
                            <div style={{ marginTop: "10px" }} className={styles.flexCreateInA}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                    Tên bài học <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nhập tên bài học"
                                    value={formProducts.name}
                                    onChange={handleChange}
                                    className={styles.inputCreate}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div style={{ marginTop: "15px" }} className={styles.flexCreateInA}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                    Mô tả cho tên <span style={{ color: 'red' }}>*</span>
                                </label>
                                <textarea
                                    name="answer"
                                    placeholder="Nhập mô tả chi tiết cho tên"
                                    value={formProducts.answer}
                                    onChange={handleChange}
                                    className={styles.inputCreate}
                                    disabled={isSubmitting}
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label} style={{ fontWeight: "bold", display: "block", marginBottom: "7px" }}>
                                Mô tả <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Editor
                                apiKey="jq89bsmkzsn6b1f9lebu726uarul4fwugf2m9l8fbrdtw4pq"
                                init={{
                                    height: 350,
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
                                value={formProducts.description}
                                onEditorChange={handleEditorChange}
                            />
                        </div>

                        <div className={styles.flexBottomIn}>
                            <div style={{ marginTop: "15px" }} className={styles.flexCreateInA}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                    Danh mục <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Select
                                    placeholder="Chọn danh mục"
                                    showSearch
                                    optionFilterProp="children"
                                    value={formProducts.categoryLanguages || undefined}
                                    onChange={handleCategoryChange}
                                    disabled={isSubmitting}
                                    style={{ width: '100%', height: '40px' }}
                                    filterOption={(input, option) =>
                                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {categories.map(category => (
                                        <Select.Option key={category._id} value={category._id}>
                                            {category.nameC}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div style={{ marginTop: "15px" }} className={styles.flexCreateInA}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                    Ngôn ngữ LT <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Select
                                    placeholder="Chọn ngôn ngữ LT"
                                    showSearch
                                    optionFilterProp="children"
                                    value={formProducts.brandLanguages || undefined}
                                    onChange={handleBrandChange}
                                    disabled={isSubmitting}
                                    style={{ width: '100%', height: '40px' }}
                                    filterOption={(input, option) =>
                                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {brands.map(brand => (
                                        <Select.Option key={brand._id} value={brand._id}>
                                            {brand.nameBrand}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.tableCreateRight}>
                    <h4>Phần ảnh bài học </h4>
                    <hr />
                    <div className={styles.formWrapImage}>
                        <div>
                            <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px", fontSize: "15px" }}>
                                Upload ảnh bài học <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                disabled={isSubmitting}
                                accept="image/jpeg,image/png"
                                style={{
                                    border: "1px solid rgb(183, 181, 181)",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    width: "100%",
                                    cursor: isSubmitting ? "not-allowed" : "pointer",
                                    backgroundColor: "#f0f8ff",
                                    transition: "border-color 0.3s ease",
                                }}
                            />
                            <small style={{ color: '#666', fontSize: '12px' }}>
                                Chỉ chấp nhận JPG/PNG, tối đa 2MB
                            </small>
                        </div>

                        <div className={styles.imagePreviewContainer}>
                            {(imagePreview || formProducts.image) && (
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={imagePreview || formProducts.image}
                                        alt="Preview ngôn ngữ"
                                        style={{ maxWidth: '100%', maxHeight: '300px' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '12px', textAlign: "center" }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: isSubmitting ? "#ccc" : "#1890ff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                            }}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo bài học'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateLanguages;