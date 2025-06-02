import { HomeLayout } from '@/modules/home/ui/layouts/home-layout';

interface LayoutProps {
  children: Readonly<React.ReactNode>;
}

const Layout = ({ children }: LayoutProps) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
