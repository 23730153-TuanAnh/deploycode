import React, { useEffect } from 'react'
import Body from './component/Body.js';
import Detail from './component/Detail.js';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const existingFormData = localStorage.getItem('formData');
        if (existingFormData) {
          return;
        }
        const response = await axios.get('https://tdta2002.github.io/sever.json/db.json');
        localStorage.setItem('formData', JSON.stringify(response.data));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ server:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/details/:id" element={<Detail />} />
        {/* <Route path="/edit" element={LazyLoad(() => import("./Edit/Edit.jsx"))()} /> */}
      </Routes>
    </>
  )
}
