import useLanguage from '@/locale/useLanguage';
import EmailSettingsModule from '@/modules/SettingModule/EmailSettingsModule';

export default function EmailSettings() {
  const translate = useLanguage();
  const entity = 'setting';

  const Labels = {
    PANEL_TITLE: translate('settings'),
    DATATABLE_TITLE: translate('settings_list'),
    ADD_NEW_ENTITY: translate('add_new_settings'),
    ENTITY_NAME: translate('settings'),
    SETTINGS_TITLE: translate('email_settings_title'),
  };

  const configPage = {
    entity,
    settingsCategory: 'email_settings',
    ...Labels,
  };

  return <EmailSettingsModule config={configPage} />;
}
