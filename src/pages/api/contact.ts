import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, company, email, message } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.MAILERSEND_API_KEY;
    const fromEmail = process.env.MAILERSEND_FROM_EMAIL;
    const toEmail = process.env.MAILERSEND_TO_EMAIL;
    const replyToEmail = process.env.MAILERSEND_REPLY_TO_EMAIL || email;

    if (!apiKey || !fromEmail || !toEmail) {
      return new Response(JSON.stringify({ error: 'Configuración de MailerSend incompleta.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = {
      from: {
        email: fromEmail,
        name: 'QAwa Website',
      },
      to: [{ email: toEmail }],
      reply_to: { email: replyToEmail },
      subject: 'Nuevo contacto desde el sitio web',
      html: `<strong>Nuevo mensaje de contacto</strong><br /><br />
        <strong>Nombre:</strong> ${name}<br />
        <strong>Empresa / Fundo:</strong> ${company || 'No proporcionado'}<br />
        <strong>Email:</strong> ${email}<br />
        <strong>Mensaje:</strong><br />
        <p>${message.replace(/\n/g, '<br />')}</p>`,
      text: `Nuevo mensaje de contacto\n\nNombre: ${name}\nEmpresa / Fundo: ${company || 'No proporcionado'}\nEmail: ${email}\n\nMensaje:\n${message}`,
    };

    const mailerResponse = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!mailerResponse.ok) {
      const errorText = await mailerResponse.text();
      return new Response(JSON.stringify({ error: 'Error al enviar el correo.', detail: errorText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
