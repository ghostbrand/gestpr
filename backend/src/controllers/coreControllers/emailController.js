const sendMail = require('@/controllers/middlewaresControllers/createAuthMiddleware/sendMail');
const loadSettings = require('@/middlewares/settings/loadSettings');
const { useAppSettings } = require('@/settings');

exports.test = async (req, res) => {
  try {
    const defaults = useAppSettings();
    const db = await loadSettings();
    const settings = { ...defaults, ...db };
    const to = req.body?.to || req.admin?.email;
    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Indique o destinatário (to) ou associe um e-mail ao administrador.',
      });
    }

    const base = settings.idurar_base_url || process.env.PUBLIC_APP_URL || 'http://localhost:3000';
    await sendMail({
      email: to,
      name: req.admin?.name || 'Administrador',
      link: base,
      subject: 'Teste de e-mail — CRIS & FAMA',
      idurar_app_email: settings.idurar_app_email,
      settings,
    });

    return res.status(200).json({
      success: true,
      message: 'E-mail de teste enviado. Verifique a caixa de entrada (e spam).',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Falha ao enviar e-mail',
    });
  }
};
