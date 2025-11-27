import React, { Fragment } from 'react'; // Fragment dùng làm layout trống nếu chưa có AuthLayout
import Cart from '~/pages/Cart';
import Calendar from '~/pages/Calendar';
import Dashboard from '~/pages/Dashboard';
import { Login, Register } from '~/pages/Auth'; // Import từ file index.tsx bạn đã tạo
import DefaultLayout from '~/layouts/DefaultLayout';
import TaskCategories from '~/pages/TaskCategories';
import MyTask from '~/pages/MyTask';
// Giả sử bạn đã tạo AuthLayout, nếu chưa thì import tạm DefaultLayout hoặc null
import AuthLayout from '~/layouts/AuthLayout';

type RouteType = {
  path: string;
  component: React.FC;
  layout?: React.FC<{ children: React.ReactNode }> | null;
};

// 1. PUBLIC ROUTES (Ai cũng vào được: Login, Register)
const publicRoutes: RouteType[] = [
  { path: '/login', component: Login, layout: AuthLayout },
  { path: '/register', component: Register, layout: AuthLayout },
  { path: '/cart', component: Cart, layout: DefaultLayout }, // Tạm để cart ở đây
];

// 2. PRIVATE ROUTES (Phải đăng nhập mới vào được: Dashboard)
const privateRoutes: RouteType[] = [
  { path: '/', component: Dashboard, layout: DefaultLayout },
  { path: '/calendar', component: Calendar, layout: DefaultLayout },
  { path: '/my-task', component: MyTask, layout: DefaultLayout },
  {
    path: '/task-categories',
    component: TaskCategories,
    layout: DefaultLayout,
  },
];

export { publicRoutes, privateRoutes };
