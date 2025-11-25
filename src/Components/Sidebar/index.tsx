import classNames from 'classnames/bind';
import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = () => {
  return <div className={cx('sidebar')}>Sidebar</div>;
};

export default Sidebar;
