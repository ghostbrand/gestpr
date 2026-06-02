import { useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Row, Col, Select } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';
import useLanguage from '@/locale/useLanguage';

export default function ItemRow({ field, remove, catalogOptions = [] }) {
  const form = Form.useFormInstance();
  const translate = useLanguage();
  const money = useMoney();

  const qtyWatch = Form.useWatch(['items', field.name, 'quantity'], form);
  const priceWatch = Form.useWatch(['items', field.name, 'price'], form);

  const catalogSelectOptions = useMemo(
    () =>
      (catalogOptions || []).map((row) => {
        const tag = row.itemKind === 'article' ? '[A] ' : '[S] ';
        return {
          value: String(row._id),
          label: `${tag}${row.name}`,
          row,
        };
      }),
    [catalogOptions]
  );

  const lineTotal = useMemo(() => {
    const q = qtyWatch != null && qtyWatch !== '' ? Number(qtyWatch) : 1;
    const p = priceWatch != null && priceWatch !== '' ? Number(priceWatch) : 0;
    if (!Number.isFinite(q) || !Number.isFinite(p)) return 0;
    return calculate.multiply(p, q);
  }, [qtyWatch, priceWatch]);

  useEffect(() => {
    form.setFieldValue(['items', field.name, 'total'], lineTotal);
  }, [lineTotal, field.name, form]);

  const applyCatalogRow = (serviceId) => {
    const idx = field.name;
    if (!serviceId) return;
    const id = String(serviceId);
    const opt = catalogSelectOptions.find((o) => o.value === id);
    if (!opt?.row) return;
    const { row } = opt;
    const prevQty = form.getFieldValue(['items', idx, 'quantity']);
    const qty = prevQty != null && prevQty !== '' ? Number(prevQty) : 1;
    form.setFieldValue(['items', idx, 'itemName'], row.name);
    form.setFieldValue(['items', idx, 'description'], row.description || '');
    form.setFieldValue(['items', idx, 'price'], row.price);
    form.setFieldValue(['items', idx, 'quantity'], qty);
    form.setFieldValue(['items', idx, 'total'], calculate.multiply(row.price, qty));
  };

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }} align="top">
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'serviceItem']}
          normalize={(v) => {
            if (v && typeof v === 'object' && v._id) return String(v._id);
            if (v) return String(v);
            return undefined;
          }}
        >
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={translate('catalog_pick_placeholder')}
            options={catalogSelectOptions}
            onChange={(id) => {
              if (id) applyCatalogRow(id);
            }}
            style={{ width: '100%' }}
            className="erp-catalog-select"
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item
          name={[field.name, 'itemName']}
          rules={[
            { required: true, message: 'Missing itemName name' },
            {
              pattern: /^(?!\s*$)[\s\S]+$/,
              message: 'Item Name must contain alphanumeric or special characters',
            },
          ]}
        >
          <Input placeholder={translate('Item')} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'description']}>
          <Input placeholder={translate('Description')} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item
          name={[field.name, 'quantity']}
          initialValue={1}
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'price']} rules={[{ required: true }]}>
          <InputNumber
            className="moneyInput"
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <InputNumber
          readOnly
          className="moneyInput erp-line-total"
          value={lineTotal}
          min={0}
          controls={false}
          addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
          addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
          formatter={(value) =>
            money.amountFormatter({ amount: value, currency_code: money.currency_code })
          }
        />
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: 36 }}>
        <DeleteOutlined onClick={() => remove(field.name)} style={{ cursor: 'pointer' }} />
      </div>
    </Row>
  );
}
