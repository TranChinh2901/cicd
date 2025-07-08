import { Breadcrumb, Image, Select } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./CreateCategory.module.css";
import axios from "axios";
const API_URL = import.meta.env.VITE_API;

const CreateCategory = () => {
    const [formProducts, setFormProducts] = useState({
        nameC: "",
        imageC: "",
        descriptionC: "",
        brandLanguages: "",
    });
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetchBrands();
    }, []);

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
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormProducts({ ...formProducts, [name]: reader.result });
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormProducts({ ...formProducts, [name]: value });
        }
    };

    const handleSelectChange = (value) => {
        setFormProducts({ ...formProducts, brandLanguages: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/v1/category/categoryLanguage`, formProducts);
            console.log(response.data);
            toast.success('Tạo mới thành công');
            setFormProducts({
                nameC: "",
                imageC: "",
                descriptionC: "",
                brandLanguages: "",
            });
        } catch (error) {
            toast.error('Lỗi không thể tạo danh mục mới');
            console.error("Lỗi không thể tạo danh mục mới", error);
        }
    };
    return (
        <div>
            <Breadcrumb
                items={[
                    { title: 'Trang chủ' },
                    { title: 'QL danh mục' },
                    { title: 'Tạo mới' },
                ]}
                style={{ margin: '16px 0' }}
            />

            <form className={styles.createCategoryCha} onSubmit={handleSubmit}>
                <div className={styles.tableCreateLeft}>
                    <div className={styles.createLeftIn}>
                        <div style={{ marginTop: "10px" }}>
                            <label htmlFor="categoryName" style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                Tên danh mục
                            </label>
                            <input
                                type="text"
                                name="nameC"
                                id="categoryName"
                                placeholder="Tên danh mục"
                                value={formProducts.nameC}
                                onChange={handleChange}
                                className={styles.inputCreate}

                                required
                            />
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <label htmlFor="categoryDescription" style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                Mô tả danh mục
                            </label>
                            <input
                                type="text"
                                name="descriptionC"
                                id="categoryDescription"
                                placeholder="Mô tả danh mục"
                                value={formProducts.descriptionC}
                                onChange={handleChange}
                                className={styles.inputCreate}
                                required
                            />
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <label style={{ fontWeight: "bold", display: "block", marginBottom: "12px" }}>
                                Ngôn ngữ lập trình
                            </label>
                            <Select
                                placeholder="Chọn ngôn ngữ lập trình"
                                showSearch
                                optionFilterProp="children"
                                value={formProducts.brandLanguages || undefined}
                                onChange={handleSelectChange}
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
                <div className={styles.tableCreateRight}>
                    <h4 >Phần ảnh danh mục</h4>
                    <hr />
                    <div className={styles.formWrapImage} >
                        <div >
                            <label htmlFor="mainImage" style={{ fontWeight: "bold", display: "block", marginBottom: "12px", fontSize: "15px" }}>
                                Upload danh mục (1)
                            </label>
                            <input
                                type="file"
                                name="imageC"
                                onChange={handleChange}
                                style={{
                                    border: "1px solid rgb(183, 181, 181)",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    width: "100%",
                                    cursor: "pointer",
                                    backgroundColor: "#f0f8ff",
                                    transition: "border-color 0.3s ease",
                                }}
                            />
                        </div>
                        <div className={styles.imagePreviewContainer}>
                            {formProducts.imageC && (
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={formProducts.imageC}
                                        alt="Hình ảnh danh mục"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '12px', textAlign: "center" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#1890ff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Tạo danh mục
                        </button>
                    </div>
                </div>
            </form >
        </div >
    );
};

export default CreateCategory;
