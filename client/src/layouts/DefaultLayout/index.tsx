import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { ChevronUp } from 'lucide-react'; // Icon mũi tên lên

import Footer from '~/components/Footer/Footer';
import Header from '~/components/Header/Header';
import Sidebar from '~/components/Sidebar/Sidebar';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  // State quản lý việc hiển thị Footer
  const [showFooter, setShowFooter] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 1. Header */}
      <div style={{ flexShrink: 0 }}>
        <Header />
      </div>

      {/* 2. Container chính */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Content Area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden', // Quan trọng: đè scroll của con
              position: 'relative',
            }}
          >
            <div style={{ width: '100%', height: '100%' }}>{children}</div>
          </div>

          {/* Footer Area */}
          {showFooter ? (
            <div style={{ flexShrink: 0, marginTop: 0 }}>
              {' '}
              {/* Bỏ marginTop cứng nếu muốn liền mạch */}
              <Footer onToggle={() => setShowFooter(false)} />
            </div>
          ) : (
            /* Nút mở lại Footer (Khi Footer bị ẩn) */
            <div
              className={cx('restoreFooterBtn')}
              onClick={() => setShowFooter(true)}
            >
              <ChevronUp size={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
