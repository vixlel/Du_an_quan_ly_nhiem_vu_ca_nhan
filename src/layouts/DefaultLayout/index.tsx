import type { ReactNode } from 'react';

type ChildrenType = {
  children: ReactNode | ReactNode[];
};

const DefaultLayout = ({ children }: ChildrenType) => {
  return (
    <>
      <header>Header</header>
      <div>{children}</div>
      <footer>Footer</footer>
    </>
  );
};

export default DefaultLayout;
