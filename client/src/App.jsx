import  { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';

const App = () => {
  const [brandName, setBrandName] = useState([]);
  useEffect(() => {
    const fetchBrandName = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/brand/brandLanguages");
        console.log('API Response:', res.data);
        setBrandName(res.data.data);
      } catch (error) {
        console.error('Error fetching brand name:', error);
      }
    }
    fetchBrandName();
  }, [])

  return (
    <div>
      <Header/>
      <h1>Brand Names</h1>
      <h1>Welcome to the Algo</h1>
      {
        brandName?.map((brand, index) => (
          <div key={index}>
            <h2>{brand.nameBrand}</h2>
            <img src={brand.logoBrand} alt={brand.nameBrand} />
          </div>
        ))
      }
      <Footer/>
    </div>
  )
}

export default App;
