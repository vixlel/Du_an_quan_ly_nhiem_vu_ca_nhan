/* src/components/Layout/Sidebar/Sidebar.tsx */
import { useState } from 'react';
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
  Users, // Icon cho Group
  PlusCircle, // Icon để thêm Group
  Hash, // Icon đại diện cho ID hoặc Group
} from 'lucide-react';
import styles from './Sidebar.module.scss'; // Lưu ý check lại tên file (viết hoa/thường)
import GroupModal from '~/components/GroupModal/GroupModal';

const cx = classNames.bind(styles);

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

// 1. Định nghĩa Interface cho Group
interface Group {
  id: string;
  name: string;
  memberCount: number;
}

// 2. Fake Data cho Groups
const MOCK_GROUPS: Group[] = [
  { id: 'dev-team', name: 'Dev Team Frontend', memberCount: 5 },
  { id: 'marketing', name: 'Marketing Campaign', memberCount: 8 },
  { id: 'study', name: 'English Class', memberCount: 12 },
];

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

  // 3. State điều khiển Modal
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

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

      {/* Navigation Menu (Personal) */}
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

        {/* --- 3. Phần Groups Mới --- */}
        <div className={cx('group-section')}>
          <div className={cx('group-label')}>
            <span>GROUPS</span>
            <span className={cx('badge')}>{MOCK_GROUPS.length}</span>
          </div>

          {/* List các Group đã tham gia */}
          {MOCK_GROUPS.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`} // Đường dẫn giả định
              className={cx('menu-item', 'group-item', {
                active: isActive(`/groups/${group.id}`),
              })}
            >
              <Hash size={18} className={cx('group-icon')} />
              <span className={cx('group-name')}>{group.name}</span>
            </Link>
          ))}

          {/* 4. Sửa nút Button để gọi hàm mở Modal */}
          <button
            className={cx('add-group-btn')}
            onClick={() => setIsGroupModalOpen(true)} // <--- Thêm sự kiện onClick
          >
            <PlusCircle size={18} />
            <span>Join or Create Group</span>
          </button>
        </div>
      </nav>

      {/* Logout Button */}
      <button className={cx('logout')}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      {/* 5. Render Modal ở cuối cùng (ngoài thẻ nav nhưng trong div sidebar hoặc ngoài cùng đều được vì nó là fixed position) */}
      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
