import { useMemo } from 'react';
import { Col, Progress, Spin } from 'antd';
import useLanguage from '@/locale/useLanguage';

const STATUS_COLORS = {
  draft: '#94a3b8',
  sent: '#6366f1',
  pending: '#06b6d4',
  unpaid: '#f59e0b',
  overdue: '#f43f5e',
  partially: '#14b8a6',
  paid: '#10b981',
  declined: '#ef4444',
  accepted: '#22c55e',
  expired: '#a16207',
};

const defaultStatistics = [
  { tag: 'draft', value: 0 },
  { tag: 'pending', value: 0 },
  { tag: 'sent', value: 0 },
  { tag: 'accepted', value: 0 },
  { tag: 'declined', value: 0 },
  { tag: 'expired', value: 0 },
];

const defaultInvoiceStatistics = [
  { tag: 'draft', value: 0 },
  { tag: 'pending', value: 0 },
  { tag: 'overdue', value: 0 },
  { tag: 'paid', value: 0 },
  { tag: 'unpaid', value: 0 },
  { tag: 'partially', value: 0 },
];

function PreviewRow({ tag, value }) {
  const translate = useLanguage();
  const color = STATUS_COLORS[tag] || '#6366f1';

  return (
    <div className="preview-row">
      <div className="preview-row__header">
        <span>{translate(tag)}</span>
        <span className="preview-row__pct">{value}%</span>
      </div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{ from: color, to: color }}
        trailColor="rgba(99, 102, 241, 0.08)"
        size="small"
      />
    </div>
  );
}

export default function PreviewCard({
  title = 'Preview',
  statistics = defaultStatistics,
  isLoading = false,
  entity = 'invoice',
}) {
  const statisticsMap = useMemo(() => {
    const defaults = entity === 'invoice' ? defaultInvoiceStatistics : defaultStatistics;
    return defaults.map((defaultStat) => {
      const matched = Array.isArray(statistics)
        ? statistics.find((stat) => stat.tag === defaultStat.tag)
        : null;
      return matched || defaultStat;
    });
  }, [statistics, entity]);

  return (
    <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
      <h3 className="section-title">{title}</h3>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : (
        statisticsMap.map((status, index) => (
          <PreviewRow key={index} tag={status.tag} value={status?.value} />
        ))
      )}
    </Col>
  );
}
