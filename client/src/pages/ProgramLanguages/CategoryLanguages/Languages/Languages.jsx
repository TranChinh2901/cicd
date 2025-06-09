import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Spinner from "../../../../components/Layout/Spinner";
import Layout from "../../../../components/Layout/Layout";
import styles from "./Languages.module.css";

const API_URL = import.meta.env.VITE_API;

// ...existing code...
const Languages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {
    fromCategory = '',
    fromBrand = '',
    categoryId = '',
    brandSlug = ''
  } = location.state || {};

  // Thêm function handleGoBack
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước
  };

  // Thêm function handleLanguageClick
  const handleLanguageClick = (language) => {
    navigate(`/language/${language.slug}`);
  };

  // ...existing code...
useEffect(() => {
  const fetchLanguages = async () => {
    try {
      setLoading(true);
      
      let response;
      
      // Nếu có categoryId và brandSlug, gọi API filter
      if (categoryId && brandSlug) {
        response = await axios.get(`${API_URL}/api/v1/language/category/${brandSlug}/${categoryId}`);
      } else {
        // Nếu không có, gọi API lấy tất cả
        response = await axios.get(`${API_URL}/api/v1/language/languages`);
      }

      console.log('API Response:', response.data); // Debug log

      if (response.data.success) {
        // Sửa lại để lấy đúng field languages
        const languagesData = response.data.data?.languages || response.data.languages || [];
        console.log('Languages Data:', languagesData); // Debug log
        
        if (Array.isArray(languagesData)) {
          setLanguages(languagesData);
        } else {
          console.error('Languages data is not an array:', languagesData);
          setLanguages([]);
          toast.error('Dữ liệu không hợp lệ.');
        }
      } else {
        toast.error(response.data.message || 'Lỗi khi tải danh sách ngôn ngữ.');
        setLanguages([]);
      }
    } catch (err) {
      console.error('Error fetching languages:', err);
      toast.error("Lỗi kết nối máy chủ hoặc dữ liệu không hợp lệ.");
      setLanguages([]); // Đảm bảo languages luôn là array
    } finally {
      setLoading(false);
    }
  };

  fetchLanguages();
}, [categoryId, brandSlug]);
// ...existing code...

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  // ...existing code...
return (
  <Layout>
    <div className={styles.containerLanguages}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Quay lại
        </button>
        <div className={styles.headerContent}>
          <h1>Tất cả ngôn ngữ lập trình</h1>
          {fromCategory && fromBrand && (
            <p className={styles.fromInfo}>
              Được truy cập từ: <strong>{fromCategory}</strong> - <strong>{fromBrand}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Languages Grid */}
      <div className={styles.languagesSection}>
        <h2>Danh sách ngôn ngữ ({Array.isArray(languages) ? languages.length : 0})</h2>
        {!Array.isArray(languages) || languages.length === 0 ? (
          <p className={styles.noData}>Chưa có ngôn ngữ nào trong hệ thống.</p>
        ) : (
          <div className={styles.languagesGrid}>
            {languages.map((language) => (
              <div 
                key={language._id} 
                className={styles.languageCard}
                onClick={() => handleLanguageClick(language)}
              >
                {/* Rest of the card content */}
                <div className={styles.languageImageWrapper}>
                  <img 
                    src={language.image} 
                    alt={language.name}
                    className={styles.languageImage}
                  />
                </div>
                <div className={styles.languageContent}>
                  <h3>{language.name}</h3>
                  <p className={styles.languageAnswer}>{language.answer}</p>
                  <p className={styles.languageDescription}>
                    {language.description.length > 100 
                      ? `${language.description.substring(0, 100)}...`
                      : language.description
                    }
                  </p>
                  <div className={styles.languageMeta}>
                    <div className={styles.metaInfo}>
                      <span className={styles.brandBadge}>
                        {language.brandLanguages?.nameBrand}
                      </span>
                      <span className={styles.categoryBadge}>
                        {language.categoryLanguages?.nameC}
                      </span>
                    </div>
                    <span className={styles.createdDate}>
                      {new Date(language.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </Layout>
);
};

export default Languages;