import { Typography } from 'antd';

const { Text } = Typography;

export default function BrandLogo({ size = 'md', showSubtitle = true, onClick, className = '' }) {
  const sizes = {
    sm: { icon: 32, title: 14, sub: 11 },
    md: { icon: 40, title: 17, sub: 12 },
    lg: { icon: 52, title: 22, sub: 14 },
  };
  const s = sizes[size] || sizes.md;

  const Wrapper = onClick ? 'button' : 'div';
  const wrapperProps = onClick
    ? { type: 'button', onClick, className: `brand-logo brand-logo--btn ${className}` }
    : { className: `brand-logo ${className}` };

  return (
    <Wrapper {...wrapperProps}>
      <div className="brand-logo__icon" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 40 40" fill="none" aria-hidden>
          <rect width="40" height="40" rx="12" fill="url(#brand-grad)" />
          <path
            d="M12 26V14h6.2c3.4 0 5.6 1.8 5.6 4.6 0 2-1.1 3.4-2.8 4l3.4 3.4H18l-3-3.2v3.2H12zm4-7.2h2c1.2 0 1.9-.6 1.9-1.5S19.2 16 18 16h-2v2.8zM26 26l-4.2-12h4.4l2.2 7.4L30.6 14H35l-4.2 12H26z"
            fill="#fff"
          />
          <defs>
            <linearGradient id="brand-grad" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="brand-logo__text">
        <Text strong className="brand-logo__title" style={{ fontSize: s.title }}>
          CRIS & FAMA
        </Text>
        {showSubtitle ? (
          <Text className="brand-logo__subtitle" style={{ fontSize: s.sub }}>
            , Lda.
          </Text>
        ) : null}
      </div>
    </Wrapper>
  );
}
