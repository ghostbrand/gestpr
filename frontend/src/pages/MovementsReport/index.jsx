import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { FilePdfOutlined, ReloadOutlined } from '@ant-design/icons';

import { ErpLayout } from '@/layout';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function authHeaders() {
  const auth = storePersist.get('auth');
  if (auth?.current?.token) {
    return { Authorization: `Bearer ${auth.current.token}` };
  }
  return {};
}

function buildQueryParams(period, { dayVal, monthVal, yearVal, yearOnlyVal, rangeVal }) {
  const p = { period };
  if (period === 'daily') {
    p.date = dayjs(dayVal).format('YYYY-MM-DD');
  } else if (period === 'monthly') {
    const m = dayjs(monthVal);
    p.year = m.year();
    p.month = m.month() + 1;
  } else if (period === 'yearly') {
    p.year = dayjs(yearOnlyVal).year();
  } else if (period === 'range' && rangeVal?.[0] && rangeVal?.[1]) {
    p.start = dayjs(rangeVal[0]).startOf('day').toISOString();
    p.end = dayjs(rangeVal[1]).endOf('day').toISOString();
  }
  return p;
}

export default function MovementsReport() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();

  const [form] = Form.useForm();
  const period = Form.useWatch('period', form) || 'monthly';

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const initialValues = useMemo(
    () => ({
      period: 'monthly',
      dayVal: dayjs(),
      monthVal: dayjs(),
      yearOnlyVal: dayjs(),
      rangeVal: [dayjs().subtract(30, 'day'), dayjs()],
    }),
    []
  );

  const fetchReport = useCallback(async (valuesOverride) => {
    const values = valuesOverride || form.getFieldsValue();
    const params = buildQueryParams(values.period, values);
    if (values.period === 'range') {
      if (!values.rangeVal?.[0] || !values.rangeVal?.[1]) {
        message.warning(translate('movements_report_range_required'));
        return;
      }
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}report/movements`, {
        params,
        headers: authHeaders(),
      });
      if (data.success) {
        setReport(data.result);
      } else {
        message.error(data.message || 'Error');
      }
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, [form, translate]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    fetchReport(initialValues);
    // montagem inicial apenas — filtros atualizados com «Atualizar»
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPdf = async () => {
    const values = form.getFieldsValue();
    const params = buildQueryParams(values.period, values);
    if (values.period === 'range') {
      if (!values.rangeVal?.[0] || !values.rangeVal?.[1]) {
        message.warning(translate('movements_report_range_required'));
        return;
      }
    }
    try {
      const res = await axios.get(`${API_BASE_URL}report/movements/pdf`, {
        params,
        responseType: 'blob',
        headers: authHeaders(),
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-movimentos-${values.period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    }
  };

  const invoiceColumns = [
    {
      title: translate('number'),
      key: 'num',
      render: (_, r) => `${r.number}/${r.year}`,
    },
    {
      title: translate('date'),
      dataIndex: 'date',
      render: (d) => (d ? dayjs(d).format(dateFormat) : '—'),
    },
    { title: translate('client'), dataIndex: ['client', 'name'], render: (n) => n || '—' },
    { title: translate('status'), dataIndex: 'paymentStatus', render: (s) => s || '—' },
    {
      title: translate('total'),
      dataIndex: 'total',
      align: 'right',
      render: (t) => moneyFormatter(t || 0),
    },
  ];

  const paymentColumns = [
    { title: translate('number'), dataIndex: 'number' },
    {
      title: translate('date'),
      dataIndex: 'date',
      render: (d) => (d ? dayjs(d).format(dateFormat) : '—'),
    },
    { title: translate('client'), dataIndex: ['client', 'name'], render: (n) => n || '—' },
    {
      title: translate('invoice'),
      key: 'inv',
      render: (_, r) =>
        r.invoice ? `${r.invoice.number}/${r.invoice.year}` : '—',
    },
    {
      title: translate('total'),
      dataIndex: 'amount',
      align: 'right',
      render: (t) => moneyFormatter(t || 0),
    },
  ];

  const quoteColumns = [
    {
      title: translate('number'),
      key: 'num',
      render: (_, r) => `${r.number}/${r.year}`,
    },
    {
      title: translate('date'),
      dataIndex: 'date',
      render: (d) => (d ? dayjs(d).format(dateFormat) : '—'),
    },
    { title: translate('client'), dataIndex: ['client', 'name'], render: (n) => n || '—' },
    { title: translate('status'), dataIndex: 'status', render: (s) => s || '—' },
    {
      title: translate('total'),
      dataIndex: 'total',
      align: 'right',
      render: (t) => moneyFormatter(t || 0),
    },
  ];

  return (
    <ErpLayout>
      <div className="pad20" style={{ marginBottom: 16 }}>
        <Title level={2} className="erp-page-title" style={{ marginBottom: 4 }}>
          {translate('movements_report')}
        </Title>
        <Text type="secondary">{translate('movements_report_subtitle')}</Text>
      </div>

      <Card size="small" style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical" initialValues={initialValues}>
          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="period" label={translate('movements_period')}>
                <Select
                  options={[
                    { value: 'daily', label: translate('movements_period_daily') },
                    { value: 'monthly', label: translate('movements_period_monthly') },
                    { value: 'yearly', label: translate('movements_period_yearly') },
                    { value: 'range', label: translate('movements_period_range') },
                  ]}
                />
              </Form.Item>
            </Col>
            {period === 'daily' && (
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="dayVal" label={translate('date')}>
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            )}
            {period === 'monthly' && (
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="monthVal" label={translate('movements_month')}>
                  <DatePicker picker="month" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {period === 'yearly' && (
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="yearOnlyVal" label={translate('movements_year')}>
                  <DatePicker picker="year" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {period === 'range' && (
              <Col xs={24} sm={16} md={12}>
                <Form.Item name="rangeVal" label={translate('movements_date_range')}>
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Space wrap>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  loading={loading}
                  onClick={() => fetchReport()}
                >
                  {translate('movements_apply')}
                </Button>
                <Button icon={<FilePdfOutlined />} onClick={downloadPdf}>
                  {translate('movements_export_pdf')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {report && (
        <>
          <Card size="small" style={{ marginBottom: 16 }} className="movements-summary-card">
            <Text strong>{report.periodLabel}</Text>
            <div style={{ marginTop: 8 }}>
              <Space wrap size="large">
                <span>
                  {translate('invoices')}: {report.summary.invoiceCount} —{' '}
                  {moneyFormatter(report.summary.invoiceTotal)}
                </span>
                <span>
                  {translate('payments')}: {report.summary.paymentCount} —{' '}
                  {moneyFormatter(report.summary.paymentTotal)}
                </span>
                <span>
                  {translate('quotes')}: {report.summary.quoteCount} —{' '}
                  {moneyFormatter(report.summary.quoteTotal)}
                </span>
              </Space>
            </div>
          </Card>

          <Card title={translate('invoices')} size="small" style={{ marginBottom: 16 }}>
            <Table
              rowKey={(r) => r._id}
              loading={loading}
              columns={invoiceColumns}
              dataSource={report.invoices}
              pagination={{ pageSize: 8 }}
              size="small"
            />
          </Card>
          <Card title={translate('payments')} size="small" style={{ marginBottom: 16 }}>
            <Table
              rowKey={(r) => r._id}
              loading={loading}
              columns={paymentColumns}
              dataSource={report.payments}
              pagination={{ pageSize: 8 }}
              size="small"
            />
          </Card>
          <Card title={translate('quotes')} size="small">
            <Table
              rowKey={(r) => r._id}
              loading={loading}
              columns={quoteColumns}
              dataSource={report.quotes}
              pagination={{ pageSize: 8 }}
              size="small"
            />
          </Card>
        </>
      )}
    </ErpLayout>
  );
}
