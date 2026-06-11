import nodemailer from 'nodemailer';

import { env, isProduction } from '../config/env.js';

/**
 * Mailer com dois modos:
 * - **SMTP**: se `SMTP_HOST` estiver configurado no .env, envia de verdade.
 * - **dev** (padrão sem SMTP): apenas registra o e-mail no console — útil
 *   para desenvolvimento sem credenciais. Basta preencher o SMTP no .env
 *   para passar a enviar.
 */

const smtpEnabled = Boolean(env.smtp.host);

let transporter = null;
if (smtpEnabled) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
}

/**
 * Envia (ou loga, em dev) o e-mail de redefinição de senha.
 * Retorna `{ delivered, resetUrl }` — em dev devolvemos a URL para facilitar
 * o teste; em produção ela nunca é exposta fora do e-mail.
 */
export async function sendPasswordResetEmail({ to, nome, resetUrl }) {
  const subject = 'Redefinição de senha — Explosion';
  const text =
    `Olá, ${nome}!\n\n` +
    `Recebemos um pedido para redefinir sua senha. Acesse o link abaixo ` +
    `(válido por 1 hora):\n\n${resetUrl}\n\n` +
    `Se você não solicitou, ignore este e-mail.`;

  if (!smtpEnabled) {
    // Modo dev: não há SMTP, então mostramos o link no console do servidor.
    console.log('\n📧 [DEV] E-mail de redefinição de senha');
    console.log(`   Para: ${to}`);
    console.log(`   Link: ${resetUrl}\n`);
    return { delivered: false, resetUrl };
  }

  await transporter.sendMail({ from: env.smtp.from, to, subject, text });
  // Fora de produção, ainda devolvemos a URL para conferência.
  return { delivered: true, resetUrl: isProduction ? undefined : resetUrl };
}
