import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TagOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import axios from 'axios';
import styles from './DashBoard.module.css';

import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const API_URL = import.meta.env.VITE_API;

const getNumericalValue = (response, defaultKey = 'data') => {
  if (!response || !response.data) {
    return 0; 
  }

  const responseData = response.data;

  if (typeof responseData === 'number') {
    return responseData;
  }

  if (typeof responseData === 'object') {
    if (typeof responseData.data === 'number') {
        return responseData.data;
    }
    if (typeof responseData.count === 'number') {
        return responseData.count;
    }
    if (Array.isArray(responseData[defaultKey])) {
        return responseData[defaultKey].length;
    }
    if (typeof responseData.data === 'object' && responseData.data !== null && 'count' in responseData.data) {
        return responseData.data.count || 0; 
    }
    if (typeof responseData.count === 'object' && responseData.count !== null && 'count' in responseData.count) {
        return responseData.count.count || 0; 
    }
  }

  return 0;
};


const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    languages: 0,
    categories: 0,
    blogs: 0,
    brands: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const usersPromise = axios.get(`${API_URL}/api/v1/auth/count-users`);
      const languagesPromise = axios.get(`${API_URL}/api/v1/language/count-languages`);
      const categoriesPromise = axios.get(`${API_URL}/api/v1/category/count-categoryLanguages`);
      const blogsPromise = axios.get(`${API_URL}/api/v1/blog/count-blogLanguages`);
      const brandsPromise = axios.get(`${API_URL}/api/v1/brand/count-brandLanguages`);

      const [usersRes, languagesRes, categoriesRes, blogsRes, brandsRes] = await Promise.all([
        usersPromise,
        languagesPromise,
        categoriesPromise,
        blogsPromise,
        brandsPromise
      ]);

      const userCount = getNumericalValue(usersRes, 'count'); 
      const languageCount = getNumericalValue(languagesRes, 'data'); 
      const categoryCount = getNumericalValue(categoriesRes, 'data'); 
      const blogCount = getNumericalValue(blogsRes, 'data'); 
      const brandCount = getNumericalValue(brandsRes, 'data'); 

      setStats({
        users: userCount,
        languages: languageCount,
        categories: categoryCount,
        blogs: blogCount,
        brands: brandCount
      });

      const usersResponse = await axios.get(`${API_URL}/api/v1/auth/users`);
      setRecentUsers(
        usersResponse.data.users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5) || []
      );

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        users: 0,
        languages: 0,
        categories: 0,
        blogs: 0,
        brands: 0
      });
      setRecentUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role === 1 ? 'Admin' : 'User'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    }
  ];

  const statsCards = [
    {
      title: 'Tổng người dùng',
      value: stats.users,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Bài học',
      value: stats.languages,
      icon: <BookOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Danh mục',
      value: stats.categories,
      icon: <TagOutlined />,
      color: '#faad14'
    },
    {
      title: 'Bài viết blog',
      value: stats.blogs,
      icon: <FileTextOutlined />,
      color: '#f5222d'
    },
    {
      title: 'Ngôn ngữ lập trình',
      value: stats.brands,
      icon: <AppstoreOutlined />,
      color: '#722ed1'
    },
    {
      title: 'Tổng nội dung',
      value: stats.languages + stats.blogs + stats.categories + stats.brands,
      icon: <TrophyOutlined />,
      color: '#13c2c2'
    }
  ];

  //dâta cho biểu đồ tronf
  const pieChartData = {
    labels: ['Bài học', 'Danh mục', 'Bài viết blog', 'Ngôn ngữ lập trình'],
    datasets: [
      {
        label: 'Số lượng',
        data: [stats.languages, stats.categories, stats.blogs, stats.brands],
        backgroundColor: [
          'rgba(82, 196, 26, 0.6)',
          'rgba(250, 173, 20, 0.6)',
          'rgba(245, 34, 45, 0.6)',
          'rgba(114, 46, 209, 0.6)',
        ],
        borderColor: [
          'rgba(82, 196, 26, 1)',
          'rgba(250, 173, 20, 1)',
          'rgba(245, 34, 45, 1)',
          'rgba(114, 46, 209, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Phân phối nội dung theo loại',
      },
    },
  };

  // Data  ccho biểu đồ cột (Users vs. Content)
  const barChartData = {
    labels: ['Người dùng', 'Tổng nội dung'],
    datasets: [
      {
        label: 'Số lượng',
        data: [stats.users, stats.languages + stats.blogs + stats.categories + stats.brands],
        backgroundColor: [
          'rgba(24, 144, 255, 0.6)',
          'rgba(19, 194, 194, 0.6)',
        ],
        borderColor: [
          'rgba(24, 144, 255, 1)',
          'rgba(19, 194, 194, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Số lượng Người dùng & Tổng nội dung',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) { if (value % 1 === 0) { return value; } }
        }
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Dashboard</h2>
        <p>Chào mừng bạn đến với trang quản trị The Algorithms</p>
      </div>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} md={8} lg={4} key={index}>
            <Card className={styles.statCard}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  <div
                    className={styles.statIcon}
                    style={{ backgroundColor: stat.color }}
                  >
                    {stat.icon}
                  </div>
                }
                loading={loading}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className={styles.contentRow}>
        <Col xs={24} lg={12}>
          <Card title="Phân phối nội dung" className={styles.chartCard} loading={loading}>
            <div style={{ height: '300px' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Thống kê Người dùng & Nội dung" className={styles.chartCard} loading={loading}>
            <div style={{ height: '300px' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Người dùng mới nhất" className={styles.tableCard} loading={loading}>
            <Table
              dataSource={recentUsers}
              columns={userColumns}
              rowKey="_id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Thống kê nhanh" className={styles.quickStats} loading={loading}>
            <div className={styles.quickStatsContent}>
              <div className={styles.quickStatItem}>
                <div className={styles.quickStatNumber}>{stats.users + stats.languages + stats.blogs + stats.categories + stats.brands}</div>
                <div className={styles.quickStatLabel}>Tổng mục (User + Content)</div>
              </div>
              <div className={styles.quickStatItem}>
                <div className={styles.quickStatNumber}>{stats.categories}</div>
                <div className={styles.quickStatLabel}>Danh mục hoạt động</div>
              </div>
              <div className={styles.quickStatItem}>
                <div className={styles.quickStatNumber}>
                  {stats.languages > 0 ? `${Math.round((stats.blogs / stats.languages) * 100)}%` : '0%'}
                </div>
                <div className={styles.quickStatLabel}>Tỷ lệ blog/ngôn ngữ</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;