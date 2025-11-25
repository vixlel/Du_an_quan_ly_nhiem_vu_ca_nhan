import React from 'react';
import Footer from '~/components/Footer';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header'; // Import Header

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 1. Header nằm trên cùng, chiếm full chiều ngang */}
      <div style={{ flexShrink: 0 }}>
        <Header />
      </div>

      {/* 2. Container dưới chứa Sidebar và Nội dung chính */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar nằm bên trái */}
        <Sidebar />

        {/* Khu vực Nội dung + Footer bên phải */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Vùng hiển thị nội dung trang (Calendar) - Cho phép cuộn nếu nội dung dài */}
          <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>

          {/* Footer nằm dưới cùng của vùng nội dung */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
