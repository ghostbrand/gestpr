import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import { ErpLayout } from '@/layout';
import useLanguage from '@/locale/useLanguage';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const { Title, Text } = Typography;

function authHeaders() {
  const auth = storePersist.get('auth');
  if (auth?.current?.token) {
    return { Authorization: `Bearer ${auth.current.token}` };
  }
  return {};
}

export default function AdminUsers() {
  const translate = useLanguage();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const isOwner = currentAdmin?.role === 'owner';

  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, count: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const pageSize = 10;

  const fetchList = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}admin/directory/list`, {
        params: { page, items: pageSize, sortBy: 'created', sortValue: -1 },
        headers: authHeaders(),
      });
      if (data.success) {
        setDataSource(data.result || []);
        setPagination(data.pagination || { page: 1, pages: 1, count: 0 });
      }
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(1);
  }, [fetchList]);

  const roleTag = (role) => {
    const colors = { owner: 'gold', manager: 'blue', staff: 'default' };
    const labels = {
      owner: translate('role_owner'),
      manager: translate('role_manager'),
      staff: translate('role_staff'),
    };
    return <Tag color={colors[role] || 'default'}>{labels[role] || role}</Tag>;
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      enabled: true,
      role: isOwner ? 'staff' : 'staff',
    });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      surname: record.surname,
      role: record.role,
      enabled: record.enabled,
    });
    setModalOpen(true);
  };

  const roleOptions = () => {
    if (isOwner) {
      return [
        { value: 'owner', label: translate('role_owner') },
        { value: 'manager', label: translate('role_manager') },
        { value: 'staff', label: translate('role_staff') },
      ];
    }
    return [{ value: 'staff', label: translate('role_staff') }];
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        const { data } = await axios.patch(
          `${API_BASE_URL}admin/directory/update/${editing._id}`,
          {
            name: values.name,
            surname: values.surname,
            role: values.role,
            enabled: values.enabled,
          },
          { headers: authHeaders() }
        );
        if (data.success) {
          message.success(data.message);
          setModalOpen(false);
          fetchList(pagination.page);
        }
      } else {
        const { data } = await axios.post(
          `${API_BASE_URL}admin/directory/create`,
          {
            email: values.email,
            password: values.password,
            name: values.name,
            surname: values.surname,
            role: values.role,
            enabled: values.enabled !== false,
          },
          { headers: authHeaders() }
        );
        if (data.success) {
          message.success(data.message);
          setModalOpen(false);
          fetchList(1);
        }
      }
    } catch (e) {
      if (e?.errorFields) return;
      message.error(e.response?.data?.message || e.message);
    }
  };

  const handleDelete = async (record) => {
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}admin/directory/delete/${record._id}`,
        { headers: authHeaders() }
      );
      if (data.success) {
        message.success(data.message);
        fetchList(pagination.page);
      }
    } catch (e) {
      message.error(e.response?.data?.message || e.message);
    }
  };

  const columns = [
    {
      title: translate('name'),
      key: 'name',
      render: (_, r) => [r.name, r.surname].filter(Boolean).join(' ') || '—',
    },
    { title: translate('email'), dataIndex: 'email' },
    {
      title: translate('access_level'),
      dataIndex: 'role',
      render: (r) => roleTag(r),
    },
    {
      title: translate('status'),
      dataIndex: 'enabled',
      render: (v) =>
        v ? <Tag color="success">{translate('active')}</Tag> : <Tag>{translate('inactive')}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            {translate('edit')}
          </Button>
          {String(record._id) !== String(currentAdmin?._id) ? (
            <Popconfirm
              title={translate('admin_user_delete_confirm')}
              onConfirm={() => handleDelete(record)}
              okText={translate('yes')}
              cancelText={translate('no')}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                {translate('delete')}
              </Button>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <ErpLayout>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <TeamOutlined style={{ fontSize: 36, color: 'var(--app-primary, #0c4a6e)' }} />
        <div>
          <Title level={2} className="erp-page-title" style={{ margin: 0 }}>
            {translate('admin_users_title')}
          </Title>
          <Text type="secondary">{translate('admin_users_subtitle')}</Text>
        </div>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {translate('admin_user_add')}
          </Button>
        </Space>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            current: pagination.page,
            total: pagination.count,
            pageSize,
            onChange: (p) => fetchList(p),
            showSizeChanger: false,
          }}
        />
      </Card>

      <Modal
        title={editing ? translate('admin_user_edit') : translate('admin_user_add')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={translate('Save')}
        destroyOnClose
        width={480}
      >
        <Form form={form} layout="vertical">
          {!editing && (
            <>
              <Form.Item
                name="email"
                label={translate('email')}
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label={translate('password')}
                rules={[{ required: true, min: 6, message: translate('password_min_6') }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item name="name" label={translate('name')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="surname" label={translate('surname')}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label={translate('access_level')} rules={[{ required: true }]}>
            <Select options={roleOptions()} />
          </Form.Item>
          <Form.Item name="enabled" label={translate('status')} valuePropName="checked">
            <Switch checkedChildren={translate('active')} unCheckedChildren={translate('inactive')} />
          </Form.Item>
        </Form>
      </Modal>
    </ErpLayout>
  );
}
