import React from 'react';
import Home from '~/pages/Home';
import Cart from '~/pages/Cart';
import type { ChildrenType } from '~/types';

type RouteType = {
  path: string;
  component: React.FC;
  layout?: ({ children }: ChildrenType) => React.JSX.Element;
};

const publicRoutes: RouteType[] = [
  { path: '/', component: Home },
  { path: '/cart', component: Cart },
  // Route "catch-all" (404) thường được đặt ở cuối
  // { path: '*', component: NotFoundPage }
];

const privateRoutes: RouteType[] = [];

export { publicRoutes, privateRoutes };
