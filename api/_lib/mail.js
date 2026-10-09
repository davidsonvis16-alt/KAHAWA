// Sends email through Resend (resend.com). Without RESEND_API_KEY + MAIL_FROM set,
// the email is printed in the terminal instead — handy while developing.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

async function sendMail({ to, subject, text, html }) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  if (!key || !from) {
    console.log(`\n──── ✉  email (dev: not sent) ────\nTo: ${to}\nSubject: ${subject}\n\n${text}\n──────────────────────────────────\n`)
    return
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text, html }),
    })
    if (!r.ok) console.error('[mail] Resend error', r.status, await r.text())
  } catch (e) {
    console.error('[mail] failed', e)
  }
}

function layout(title, body, button, link) {
  return `<!doctype html><html><body style="margin:0;background:#FBF4E8;font-family:Arial,sans-serif;color:#2A1810">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px">
    <div style="font-size:24px;font-weight:900;letter-spacing:-.5px">Kahawa<span style="color:#E0533A">&amp;</span>Crumb</div>
    <h1 style="font-size:22px;margin:28px 0 8px">${title}</h1>
    <p style="font-size:16px;line-height:1.5;margin:0 0 24px">${body}</p>
    <a href="${esc(link)}" style="display:inline-block;background:#E0533A;color:#fff;font-weight:700;padding:14px 26px;border-radius:999px;text-decoration:none">${button}</a>
    <p style="font-size:13px;color:#7a6a60;margin-top:28px">If you didn't ask for this, you can ignore this email.</p>
  </div></body></html>`
}

export function sendVerifyEmail(user, link) {
  const first = esc(user.name.split(' ')[0])
  return sendMail({
    to: user.email,
    subject: 'Confirm your Kahawa & Crumb email',
    text: `Hi ${user.name.split(' ')[0]},\n\nConfirm your email to finish setting up your account:\n${link}\n\nThis link expires in 24 hours.`,
    html: layout(`Karibu, ${first}!`, 'Confirm your email to finish setting up your account. This link expires in 24 hours.', 'Confirm email', link),
  })
}

export function sendResetEmail(user, link) {
  return sendMail({
    to: user.email,
    subject: 'Reset your Kahawa & Crumb password',
    text: `Someone asked to reset the password for this account.\n\nChoose a new password here:\n${link}\n\nThis link expires in 30 minutes and works once.`,
    html: layout('Reset your password', 'Someone asked to reset the password for this account. This link expires in 30 minutes and works once.', 'Choose a new password', link),
  })
}
