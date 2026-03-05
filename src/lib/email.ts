import type { ContactFormData } from '@/types';

export interface EmailResult {
  success: boolean;
  error?: string;
}

const TO_ADDRESS = 'voiceandvision.AI@gmail.com';

/* ─── HTML escape utility ────────────────────────────────────────── */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ─── HTML email template ────────────────────────────────────────── */
function buildEmailHtml(data: ContactFormData): string {
  const submittedAt = new Date().toLocaleString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const detailRows: [string, string][] = [
    ['Full Name', escapeHtml(data.name)],
    ['Business Email', `<a href="mailto:${escapeHtml(data.email)}" style="color:#00796b;text-decoration:none;">${escapeHtml(data.email)}</a>`],
    ['Company', escapeHtml(data.company)],
    ['Job Title', escapeHtml(data.jobTitle)],
    ...(data.phone ? [['Phone', `<a href="tel:${escapeHtml(data.phone)}" style="color:#00796b;text-decoration:none;">${escapeHtml(data.phone)}</a>`] as [string, string]] : []),
    ['Product Interest', escapeHtml(data.productInterest)],
    ['Submitted', submittedAt],
  ];

  const detailTableRows = detailRows
    .map(([label, value]) => `
      <tr>
        <td style="padding:11px 24px;vertical-align:top;width:150px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9e9e9e;white-space:nowrap;border-bottom:1px solid #f5f5f5;">${label}</td>
        <td style="padding:11px 24px;font-size:14px;color:#212121;border-bottom:1px solid #f5f5f5;">${value}</td>
      </tr>`)
    .join('');

  const messageBlock = data.message
    ? `<div style="padding:20px 24px 24px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9e9e9e;margin-bottom:10px;">Message</div>
        <div style="font-size:14px;color:#212121;line-height:1.7;background:#fafafa;border-left:3px solid #00C9A7;padding:14px 16px;border-radius:0 6px 6px 0;">
          ${escapeHtml(data.message).replace(/\n/g, '<br />')}
        </div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Lead — Voice&amp;Vision AI</title>
</head>
<body style="margin:0;padding:0;background:#eeeeee;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <div style="max-width:620px;margin:36px auto;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">

    <!-- ── Top bar ────────────────────────────────────── -->
    <div style="background:#00C9A7;padding:10px 24px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#003d33;">
      New Lead · Voice&amp;Vision AI
    </div>

    <!-- ── Hero block ─────────────────────────────────── -->
    <div style="background:#0d0d0d;padding:32px 24px 28px;">
      <!-- Name -->
      <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">
        ${escapeHtml(data.name)}
      </div>
      <!-- Company + Job Title -->
      <div style="margin-top:6px;font-size:15px;color:#aaaaaa;">
        ${escapeHtml(data.jobTitle)} &nbsp;·&nbsp; ${escapeHtml(data.company)}
      </div>
      <!-- Product badge -->
      <div style="margin-top:16px;display:inline-block;background:#00C9A715;border:1px solid #00C9A740;color:#00C9A7;border-radius:100px;padding:5px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
        ${escapeHtml(data.productInterest)}
      </div>
    </div>

    <!-- ── Quick contact strip ────────────────────────── -->
    <div style="background:#1a1a1a;padding:14px 24px;display:flex;gap:24px;">
      <span style="font-size:13px;color:#aaaaaa;">
        ✉&nbsp; <a href="mailto:${escapeHtml(data.email)}" style="color:#00C9A7;text-decoration:none;">${escapeHtml(data.email)}</a>
      </span>
      ${data.phone ? `<span style="font-size:13px;color:#aaaaaa;">📞&nbsp; <a href="tel:${escapeHtml(data.phone)}" style="color:#00C9A7;text-decoration:none;">${escapeHtml(data.phone)}</a></span>` : ''}
      <span style="font-size:13px;color:#555555;margin-left:auto;">🕐&nbsp; ${submittedAt}</span>
    </div>

    <!-- ── Detail table ───────────────────────────────── -->
    <div style="background:#ffffff;">
      <div style="padding:18px 24px 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#bdbdbd;">
        Submission Details
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tbody>${detailTableRows}</tbody>
      </table>
      ${messageBlock}
    </div>

    <!-- ── Footer ─────────────────────────────────────── -->
    <div style="background:#f5f5f5;padding:16px 24px;border-top:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;color:#9e9e9e;">Voice<span style="color:#00C9A7">&amp;</span>Vision AI · Lead Form</span>
      <span style="font-size:12px;color:#9e9e9e;">Reply within 1 business day</span>
    </div>

  </div>
</body>
</html>`;
}

/* ─── Main send function ─────────────────────────────────────────── */
export async function sendLeadEmail(data: ContactFormData): Promise<EmailResult> {
  const subject = `New Lead: ${data.company} — ${data.productInterest}`;
  const html = buildEmailHtml(data);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not set');
    return { success: false, error: 'Email not configured (missing API key)' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const { data: sent, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: TO_ADDRESS,
      subject,
      html,
    });
    if (error) {
      console.error('[email] Resend error:', error);
      return { success: false, error: `Resend: ${error.message}` };
    }
    console.log('[email] Sent via Resend, id:', sent?.id);
    return { success: true };
  } catch (err) {
    console.error('[email] Resend threw:', err);
    return { success: false, error: String(err) };
  }
}
