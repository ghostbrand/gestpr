exports.accountWelcome = ({
  title = 'A sua conta foi criada',
  name = '',
  email = '',
  password = '',
  link = '',
}) => {
  return `
    <div>
      <head data-id="__react-email-head">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>${title}</title>
      </head>
      <body data-id="__react-email-body" style="font-family: Arial, sans-serif; color: #1e293b;">
        <h2 data-id="react-email-heading">${title}</h2>
        <hr style="width:100%;border:none;border-top:1px solid #eaeaea" />
        <p style="font-size:14px;line-height:24px;margin:16px 0">Olá ${name},</p>
        <p style="font-size:14px;line-height:24px;margin:16px 0">
          Foi criada uma conta para si no GestPR. Utilize os dados abaixo para iniciar sessão:
        </p>
        <p style="font-size:14px;line-height:24px;margin:16px 0">
          <strong>E-mail:</strong> ${email}<br />
          <strong>Palavra-passe:</strong> ${password}
        </p>
        <p style="font-size:14px;line-height:24px;margin:16px 0">
          <a href="${link}" style="color:#4f46e5">Iniciar sessão</a>
        </p>
        <p style="font-size:13px;line-height:22px;margin:16px 0;color:#64748b">
          Recomendamos que altere a palavra-passe após o primeiro acesso em Definições → Perfil.
        </p>
      </body>
    </div>
  `;
};
