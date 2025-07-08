import { Breadcrumb, Image, Select } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./UpdateLanguages.module.css";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate

const API_URL = import.meta.env.VITE_API;

const UpdateLanguages = () => {
    const { slug } = useParams(); // Lấy slug từ URL
    const navigate = useNavigate(); // Sử dụng navigate để điều hướng sau khi cập nhật

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
    const [imagePreview, setImagePreview] = useState(""); // Để hiển thị ảnh preview
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialImage, setInitialImage] = useState(""); // Lưu trữ ảnh gốc từ DB

    useEffect(() => {
        // Fetch categories and brands concurrently
        const fetchDependencies = async () => {
            try {
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/v1/category/categoryLanguages`),
                    axios.get(`${API_URL}/api/v1/brand/brandLanguages`)
                ]);
                if (categoriesResponse.data.success) {
                    setCategories(categoriesResponse.data.data || []);
                }
                if (brandsResponse.data.success) {
                    setBrands(brandsResponse.data.data || []);
                }
            } catch (error) {
                toast.error("Không thể tải danh sách danh mục hoặc thương hiệu");
            }
        };

        // Fetch language data by slug
        const fetchLanguageData = async () => {
            if (!slug) {
                toast.error("Không tìm thấy slug ngôn ngữ.");
                navigate('/admin/languages'); // Redirect if no slug is present
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/api/v1/language/languages/${slug}`);
                if (response.data.success) {
                    const data = response.data.data;
                    setFormProducts({
                        name: data.name || "",
                        answer: data.answer || "",
                        description: data.description || "",
                        image: data.image || "", // Set initial image
                        categoryLanguages: data.categoryLanguages?._id || "", // Lấy _id của category
                        brandLanguages: data.brandLanguages?._id || "",       // Lấy _id của brand
                    });
                    setImagePreview(data.image || ""); // Set image preview to current image
                    setInitialImage(data.image || ""); // Store the initial image to compare later
                } else {
                    toast.error(response.data.message || "Không thể tải dữ liệu ngôn ngữ.");
                    navigate('/admin/languages'); // Redirect if language not found
                }
            } catch (error) {
                console.log(error);
                toast.error("Lỗi khi tải dữ liệu ngôn ngữ.");
                navigate('/admin/languages'); // Redirect on error
            }
        };

        fetchDependencies();
        fetchLanguageData();
    }, [slug, navigate]); // Thêm navigate vào dependency array

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormProducts(prev => ({ ...prev, [name]: reader.result }));
                setImagePreview(reader.result); // Cập nhật preview với ảnh mới
            };
            reader.readAsDataURL(file);
        } else {
            setFormProducts(prev => ({ ...prev, [name]: value }));
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

        // Client-side validation (optional but recommended)
        const errors = [];
        const sanitizedDescriptionText = DOMPurify.sanitize(formProducts.description, { USE_PROFILES: { html: true } }).trim();

        if (!formProducts.name.trim()) errors.push('Vui lòng nhập tên ngôn ngữ');
        if (!formProducts.answer.trim()) errors.push('Vui lòng nhập câu trả lời');
        if (!sanitizedDescriptionText) errors.push('Vui lòng nhập mô tả');
        // Image validation: Only require if it's new creation, or if old image is missing AND no new image is provided
        // For update, if formProducts.image is empty and initialImage is also empty, then it's an error.
        // If formProducts.image is empty but initialImage exists, it means user didn't change image.
        if (!formProducts.image && !initialImage) errors.push('Vui lòng chọn ảnh');

        if (!formProducts.categoryLanguages) errors.push('Vui lòng chọn danh mục');
        if (!formProducts.brandLanguages) errors.push('Vui lòng chọn thương hiệu');

        if (errors.length > 0) {
            errors.forEach(msg => toast.error(msg));
            return;
        }

        setIsSubmitting(true);

        try {
            // Chuẩn bị dữ liệu gửi đi
            const dataToSubmit = {
                name: formProducts.name.trim(),
                answer: formProducts.answer.trim(),
                description: formProducts.description,
                // Gửi ảnh chỉ khi nó đã được thay đổi (là base64 mới)
                // Hoặc nếu không có ảnh ban đầu và có ảnh mới được chọn
                image: formProducts.image !== initialImage ? formProducts.image : undefined,
                categoryLanguages: formProducts.categoryLanguages,
                brandLanguages: formProducts.brandLanguages
            };

            // Remove image property if it's the same as initialImage (no change)
            if (dataToSubmit.image === undefined) {
                delete dataToSubmit.image; // Do not send image if it hasn't changed
            }


            const response = await axios.put(`${API_URL}/api/v1/language/languages/${slug}`, dataToSubmit);

            if (response.data.success) {
                toast.success('Cập nhật ngôn ngữ thành công!');
                navigate('/admin/languages/view'); // Redirect to language list after successful update
            } else {
                toast.error(response.data.message || 'Lỗi không thể cập nhật ngôn ngữ');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Lỗi không thể cập nhật ngôn ngữ';
            toast.error(errorMessage);
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
                    { title: 'Cập nhật' },
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
                                    placeholder="Nhập tên baif học"
                                    value={formProducts.name}
                                    onChange={handleChange}
                                    className={styles.inputCreate}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div style={{ marginTop: "15px" }} className={styles.flexCreateInA}>
                                <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                    Mô tả cho tên <span style={{ color: 'red' }}>*</span>
                                </label>
                                <textarea
                                    name="answer"
                                    placeholder="Nhập mô tả cho tên"
                                    value={formProducts.answer}
                                    onChange={handleChange}
                                    className={styles.inputCreate}
                                    disabled={isSubmitting}
                                    rows={3}
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
                                    placeholder="Chọn ngôn "
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
                    <h4>Phần ảnh bài học</h4>
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
                            {(imagePreview) && ( // Show preview if imagePreview is available
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={imagePreview} // Use imagePreview for display
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
                            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật bài học'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateLanguages;
