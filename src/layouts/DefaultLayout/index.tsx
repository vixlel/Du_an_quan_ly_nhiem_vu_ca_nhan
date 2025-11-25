/* DefaultLayout.tsx */
import React from 'react';
import Footer from '~/components/Footer';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 1. Header cố định chiều cao */}
      <div style={{ flexShrink: 0 }}>
        <Header />
      </div>

      {/* 2. Container chính: Sidebar (Trái) - Content (Phải) */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Khu vực Nội dung + Footer */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden', // KHÓA SCROLL CỦA LAYOUT CHÍNH
          }}
        >
          {/* Vùng chứa nội dung (Calendar/Dashboard...):
             - flex: 1 để chiếm hết khoảng trống còn lại.
             - overflow: hidden để nhường quyền cuộn cho component con (Calendar).
          */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Wrapper này đảm bảo children nhận height 100% */}
            <div style={{ width: '100%', height: '100%' }}>{children}</div>
          </div>

          {/* Footer nằm dưới cùng, không bị che, không đè lên content */}
          <div style={{ flexShrink: 0 }}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
