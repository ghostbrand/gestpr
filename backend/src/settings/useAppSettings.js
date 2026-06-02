const useAppSettings = () => {
  const settings = {};
  settings['idurar_app_email'] = process.env.MAIL_FROM || 'noreply@example.com';
  settings['idurar_base_url'] = process.env.PUBLIC_APP_URL || 'http://localhost:3000';
  settings['mail_transport'] = process.env.MAIL_TRANSPORT || 'resend';
  return settings;
};

module.exports = useAppSettings;
