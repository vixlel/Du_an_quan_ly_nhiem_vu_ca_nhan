import classNames from 'classnames/bind';
import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

// Sidebar.tsx
const Sidebar = () => {
  return (
    <div
      className={cx('sidebar')}
      // SỬA: height từ '100vh' thành '100%'
      style={{ width: 240, height: '100%', background: 'gray' }}
    >
      Sidebar
    </div>
  );
};

export default Sidebar;
