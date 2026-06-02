import SetingsSection from '../components/SetingsSection';
import UpdateSettingModule from '../components/UpdateSettingModule';
import EmailSettingForm from './EmailSettingForm';
import useLanguage from '@/locale/useLanguage';

export default function EmailSettingsModule({ config }) {
  const translate = useLanguage();
  return (
    <UpdateSettingModule config={config}>
      <SetingsSection
        title={translate('email_settings_title')}
        description={translate('email_settings_help')}
      >
        <EmailSettingForm />
      </SetingsSection>
    </UpdateSettingModule>
  );
}
