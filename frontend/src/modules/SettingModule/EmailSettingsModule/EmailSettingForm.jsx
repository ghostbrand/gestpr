import { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
  Typography,
  Alert,
} from 'antd';
import { SendOutlined, GoogleOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import { notification } from 'antd';

const { Text } = Typography;

export default function EmailSettingForm() {
  const translate = useLanguage();
  const form = Form.useFormInstance();
  const [testTo, setTestTo] = useState('');

  const applyGmailPreset = () => {
    form.setFieldsValue({
      mail_transport: 'smtp',
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_secure: false,
    });
    notification.info({
      message: translate('gmail_preset_button'),
      description: translate('gmail_help_alert'),
    });
  };

  const sendTest = async () => {
    try {
      const data = await request.post({
        entity: 'email/test',
        jsonData: { to: testTo || undefined },
      });
      if (data.success) {
        notification.success({ message: translate('test_email_sent') });
      } else {
        notification.error({ message: data.message || translate('test_email_failed') });
      }
    } catch (e) {
      notification.error({
        message: translate('test_email_failed'),
        description: e?.message,
      });
    }
  };

  return (
    <div>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={translate('email_storage_title')}
        description={translate('email_settings_help')}
      />
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 20 }}
        message="Gmail"
        description={translate('gmail_help_alert')}
      />

      <Form.Item
        label={translate('mail_transport')}
        name="mail_transport"
        initialValue="resend"
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { value: 'resend', label: translate('mail_transport_resend') },
            { value: 'smtp', label: translate('mail_transport_smtp') },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button type="dashed" icon={<GoogleOutlined />} onClick={applyGmailPreset} block>
          {translate('gmail_preset_button')}
        </Button>
      </Form.Item>

      <Form.Item label={translate('smtp_host')} name="smtp_host">
        <Input autoComplete="off" placeholder="smtp.gmail.com" />
      </Form.Item>
      <Form.Item label={translate('smtp_port')} name="smtp_port">
        <InputNumber min={1} max={65535} style={{ width: '100%' }} placeholder="587" />
      </Form.Item>
      <Form.Item
        label={translate('smtp_secure')}
        name="smtp_secure"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label={translate('smtp_user')}
        name="smtp_user"
        extra="Com Gmail: o seu endereço completo, ex. empresa@gmail.com"
      >
        <Input autoComplete="off" placeholder="nome@gmail.com" />
      </Form.Item>
      <Form.Item
        label={translate('smtp_password')}
        name="smtp_password"
        extra="Com Gmail: use a palavra-passe de aplicação de 16 caracteres (não a palavra-passe da conta)."
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>

      <Space direction="vertical" style={{ width: '100%', marginBottom: 12 }}>
        <Text type="secondary">{translate('email')} (teste)</Text>
        <Input
          type="email"
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="Opcional — por omissão usa o e-mail do administrador"
        />
        <Button type="default" icon={<SendOutlined />} onClick={sendTest}>
          {translate('test_email_button')}
        </Button>
      </Space>

      <Text type="secondary" style={{ fontSize: 12 }}>
        {translate('email_settings_footer')}
      </Text>
    </div>
  );
}
