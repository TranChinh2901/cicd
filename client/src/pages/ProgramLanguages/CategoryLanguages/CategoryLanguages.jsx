import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "../../../components/Layout/Layout";
import Spinner from "../../../components/Layout/Spinner";
import BlogLanguages from "./BlogLanguages/BlogLanguages"; 
import styles from "./CategoryLanguages.module.css"; 

const API_URL = import.meta.env.VITE_API;

const CategoryLanguages = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategoriesByBrand = async () => {
      try {
        setLoading(true);
        
        if (!slug) {
          toast.error('Không tìm thấy slug của thương hiệu.'); 
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`${API_URL}/api/v1/category/categoryLanguages/${slug}`);
        
        if (response.data.success) {
          const categoriesData = response.data.categoryLanguages;
          if (categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0) {
            setCategories(categoriesData);
            setBrandName(response.data.brandName || ''); 
          } else {
            setCategories([]);
            setBrandName(response.data.brandName || slug);
          }
        } else {
          toast.error(response.data.message || 'Lỗi khi tải danh mục.');
        }
      } catch (err) { 
        toast.error("Lỗi kết nối máy chủ hoặc dữ liệu không hợp lệ.");
      } finally {
        setLoading(false); 
      }
    };
    
    fetchCategoriesByBrand();
  }, [slug]); 

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  
  const handleClickToLanguages = () => {

  }
  
  return (  
   <Layout>
     <div className={styles.containerCategory}>
        <div className={styles.flexCategoryOne} >
 <div className={styles.headerSectionCategory} >
        <h2>Danh mục cho {brandName || slug}</h2> 
        <p>Hãy cùng nhau khám phá các danh mục khác nhau của {brandName || slug}</p>
      </div>
      <div className={styles.categoriesGrid}>
       {
        categories.map((category) => (
            <Link key={category._id} className={styles.categoryCard} onClick={handleClickToLanguages} style={{ textDecoration: 'none' }} to={`/languages/by-category/${category.slug}`}>
              <div className={styles.categoryImageWrapper}>
                <img 
                  src={category.imageC} 
                  alt={category.nameC} 
                  className={styles.categoryImage}
                 
                />
              </div>
              <div className={styles.categoryContent}> 
                <h3>{category.nameC}</h3>
                <p>
                  {category.descriptionC.substring(0, 70)}...
                </p>
               
              </div>
            </Link>
          ))
       }
      </div>
        </div>
        <div className={styles.flexCategoryTwo}>
            <h2>Tìm hiểu blog</h2>
            <BlogLanguages/>
        </div>
    </div>
   </Layout>
  );
};

export default CategoryLanguages;