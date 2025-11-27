import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import {
  LayoutDashboard,
  Zap,
  CheckSquare,
  List,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const Sidebar = ({ user }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/vital-task', label: 'Vital Task', icon: Zap },
    { path: '/my-task', label: 'My Task', icon: CheckSquare },
    { path: '/task-categories', label: 'Task Categories', icon: List },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cx('sidebar')}>
      {/* User Profile Section */}
      <div className={cx('profile')}>
        <div className={cx('avatar')}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className={cx('avatar-placeholder')}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <h3 className={cx('name')}>{user?.name || 'Guest User'}</h3>
        <p className={cx('email')}>{user?.email || 'guest@example.com'}</p>
      </div>

      {/* Navigation Menu */}
      <nav className={cx('menu')}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cx('menu-item', { active: isActive(item.path) })}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button className={cx('logout')}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
