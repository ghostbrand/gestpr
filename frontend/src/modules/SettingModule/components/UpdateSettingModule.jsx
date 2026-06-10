// import { generate as uniqueId } from 'shortid';
// import { SyncOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import UpdateSettingForm from './UpdateSettingForm';

export default function UpdateSettingModule({
  config,
  children,
  withUpload = false,
  uploadSettingKey = null,
}) {
  return (
    <>
      <PageHeader
        className="erp-datatable__header setting-section__header"
        title={config.SETTINGS_TITLE}
        ghost={false}
      />

      <Divider className="setting-section__divider" />
      <UpdateSettingForm
        config={config}
        withUpload={withUpload}
        uploadSettingKey={uploadSettingKey}
      >
        {children}
      </UpdateSettingForm>
    </>
  );
}
