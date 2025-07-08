// File: src/pages/LanguagesByCategory/LanguagesByCategory.js

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './Languages.module.css';
import { MdOutlineNavigateNext } from "react-icons/md";
import DOMPurify from 'dompurify';
import Layout from '../../../../components/Layout/Layout';

const API_URL = import.meta.env.VITE_API;

const Languages = () => {
  const { slug } = useParams();
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/language/languages/by-category/${slug}`);
        setLanguages(data.data);
      } catch {
        toast.error('Lỗi kết nối máy chủ!');
      }
    };

    if (slug) {
      fetchLanguages();
    }
  }, [slug]);

  return (
    <Layout title={`Bài học`}>
      <div className={styles.containerLanguages}>
        <h1 className={styles.titleLanguages}>
          Các bài học trong danh mục:
        </h1>
        <p className={styles.resultCountLanguages}>
          Tìm thấy {languages.length} bài học về ngôn ngữ lập trình mà bạn có thể học.
        </p>
        <div className={styles.languagesGrid}>
          {languages.map((lang, index) => (
            <div key={lang._id} className={styles.languageCard}>
              <h3 className={styles.languageName}>
                {index + 1}. {lang.name}
              </h3>
              <img src={lang.image} alt={lang.name} className={styles.languageImage} />
              <div className={styles.languageContent}>
                <div
                  className={styles.languageDescription}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lang.description.substring(0, 180)) + '...' }}
                />

                <Link to={`/language_detail/${lang.slug}`} className={styles.detailButton}>
                  Xem chi tiết taị đây<MdOutlineNavigateNext />
                </Link>
              </div>
            </div>
          ))}

        </div>
      </div>
    </Layout>
  );
};

export default Languages;
