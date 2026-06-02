import { Switch, Form, Input, InputNumber, Radio, Space, Typography } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

export default function ServiceItemForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  const itemKind = Form.useWatch('itemKind');
  const isArticle = itemKind === 'article';

  return (
    <>
      <Form.Item
        label={translate('item_kind_label')}
        name="itemKind"
        rules={[{ required: true }]}
        extra={<Text type="secondary">{translate('item_kind_help')}</Text>}
      >
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          disabled={isUpdateForm}
          options={[
            { value: 'service', label: translate('item_kind_service') },
            { value: 'article', label: translate('item_kind_article') },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={translate('service_item_name')}
        name="name"
        rules={[{ required: true }]}
      >
        <Input placeholder={translate('service_item_name')} />
      </Form.Item>
      <Form.Item label={translate('Description')} name="description">
        <Input.TextArea rows={3} placeholder={translate('Description')} />
      </Form.Item>
      <Form.Item
        label={translate('Price')}
        name="price"
        rules={[{ required: true, type: 'number', min: 0 }]}
      >
        <InputNumber min={0} step={0.01} style={{ width: '100%' }} precision={2} />
      </Form.Item>

      {isArticle ? (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text type="secondary">{translate('article_stock_section')}</Text>
          <Form.Item label={translate('sku_label')} name="sku">
            <Input placeholder={translate('sku_placeholder')} />
          </Form.Item>
          <Form.Item
            label={translate('stock_quantity')}
            name="stockQuantity"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber min={0} step={1} style={{ width: '100%' }} precision={0} />
          </Form.Item>
          <Form.Item label={translate('min_stock_level')} name="minStockLevel">
            <InputNumber min={0} step={1} style={{ width: '100%' }} precision={0} />
          </Form.Item>
          <Form.Item label={translate('unit_label')} name="unit">
            <Input placeholder="un" />
          </Form.Item>
        </Space>
      ) : null}

      <Form.Item
        label={translate('enabled')}
        name="enabled"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
