import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../../../../../components/Layout/Layout';
import styles from './DetailLanguages.module.css'; 
import Spinner from '../../../../../components/Layout/Spinner';
import { IoMdArrowBack } from "react-icons/io";

const API_URL = import.meta.env.VITE_API;

const DetailLanguages = () => {
  const { slug } = useParams();
  const [language, setLanguage] = useState(null);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/language/languages/${slug}`);
        if (data.success) {
          setLanguage(data.data);
        } else {
          toast.error(data.message || "Không thể tải chi tiết.");
        }
      } catch (error) {
        toast.error("Lỗi kết nối máy chủ!");
      }
    };

    if (slug) {
      fetchLanguage();
    }
  }, [slug]);

  if (!language) {
    return (
      <Layout>
        <Spinner/>
      </Layout>
    );
  }
const handleback = () => {
    window.history.back();
}
  return (
    <Layout title={language.name}>
      <div className={styles.detailContainer}>
      <div className={styles.inDetailController}>
        <div className={styles.inDetailLeft}>
            <button onClick={handleback}><IoMdArrowBack/> quay lại</button>
         
              <h3 className={styles.title}>--Chi tiết về {language.name}--</h3>
        </div>
        <div className={styles.inDetailRight}>
              <h2 className={styles.title}>{language.name}</h2>
        <h3>{language.answer}</h3>
        <img src={language.image} alt={language.name} className={styles.imageDetailLanguages} />
        <p className={styles.description}>{language.description}</p>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default DetailLanguages;
