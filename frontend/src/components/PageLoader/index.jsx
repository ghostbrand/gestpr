import { Spin } from 'antd';
import BrandLogo from '@/components/BrandLogo/BrandLogo';

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__orb page-loader__orb--1" />
      <div className="page-loader__orb page-loader__orb--2" />
      <div className="page-loader__content animate-scale-in">
        <BrandLogo size="lg" showSubtitle />
        <Spin size="large" className="page-loader__spin" />
        <span className="page-loader__label">A carregar…</span>
      </div>
    </div>
  );
}
