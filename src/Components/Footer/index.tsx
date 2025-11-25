import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import styles from './Footer.module.scss';

// Props nhận dữ liệu task (có thể truyền từ DefaultLayout hoặc Global State sau này)
interface FooterProps {
  totalTasks?: number;
  completedTasks?: number;
}

const Footer: React.FC<FooterProps> = ({
  totalTasks = 10, // Giá trị mặc định giả lập (mock)
  completedTasks = 7, // Giá trị mặc định giả lập (mock)
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm kiểm tra route hiện tại để highlight button
  const isActive = (path: string) => location.pathname === path;

  // Tính phần trăm
  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <footer className={styles.footerContainer}>
      {/* --- Phần Status (Tiến độ công việc) --- */}
      <div className={styles.statusSection}>
        <div className={styles.progressInfo}>
          <CheckCircle2 size={20} className={styles.iconSuccess} />
          <span className={styles.statusText}>
            Đã xong{' '}
            <strong>
              {completedTasks}/{totalTasks}
            </strong>
          </span>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* --- Phần Navigation --- */}
      <nav className={styles.navSection}>
        <button
          className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          <LayoutDashboard size={20} />
          <span className={styles.navLabel}>Board</span>
        </button>

        <button
          className={`${styles.navItem} ${
            isActive('/calendar') ? styles.active : ''
          }`}
          onClick={() => navigate('/calendar')}
        >
          <Calendar size={20} />
          <span className={styles.navLabel}>Lịch</span>
        </button>

        <button
          className={`${styles.navItem} ${
            isActive('/settings') ? styles.active : ''
          }`}
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
          <span className={styles.navLabel}>Cài đặt</span>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
