import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmation(order) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: 'cliente@email.com', // Obtener email del usuario en la BD
    subject: `Confirmación de Pedido #${order._id} - R.A.P.E.L`,
    html: `
      <h1>¡Gracias por tu compra, ${order.userId}!</h1>
      <p>Tu pedido ha sido <strong>${order.status}</strong>.</p>
      <p>Total: $${order.total.toLocaleString('es-AR')}</p>
      <p>Pronto recibirás los detalles de envío.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado');
  } catch (error) {
    console.error('Error enviando email:', error);
  }
}
