import type { ReactNode } from 'react';
import Sidebar from '~/Components/Sidebar';

type ChildrenType = {
  children: ReactNode | ReactNode[];
};

const DefaultLayout = ({ children }: ChildrenType) => {
  return (
    <>
      <header>Header</header>
      <div>
        <Sidebar />
        {children}
      </div>
      <footer>Footer</footer>
    </>
  );
};

export default DefaultLayout;
