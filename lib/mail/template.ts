import "server-only";

type EmailDetail = {
  label: string;
  value: string;
};

type WebsiteEmailOptions = {
  eyebrow: string;
  title: string;
  intro: string;
  details?: readonly EmailDetail[];
  code?: string;
  note?: string;
  cta?: { label: string; href: string };
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function textBlock(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function detailRows(details: readonly EmailDetail[]) {
  if (!details.length) return "";

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;border-top:1px solid #dedbd1;">
    ${details.map(({ label, value }) => `<tr>
      <td style="width:34%;padding:14px 16px 14px 0;border-bottom:1px solid #dedbd1;color:#6c6d66;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.1px;line-height:1.35;text-transform:uppercase;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:14px 0;border-bottom:1px solid #dedbd1;color:#171816;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;vertical-align:top;">${textBlock(value)}</td>
    </tr>`).join("")}
  </table>`;
}

function actionButton(cta?: WebsiteEmailOptions["cta"]) {
  if (!cta || !/^https?:\/\//.test(cta.href)) return "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
    <tr><td bgcolor="#bb803c" style="background:#bb803c;"><a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:13px 18px;color:#171816;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:.4px;text-decoration:none;">${escapeHtml(cta.label)}&nbsp; ↗</a></td></tr>
  </table>`;
}

function websiteUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  // Email recipients need a public, HTTPS-hosted image. Localhost URLs cannot
  // be reached by their mail client during local development.
  return configured && /^https:\/\//i.test(configured) ? configured : "https://starenergies.in";
}

/** A table-based email shell that follows the public site's ink, paper and amber visual system. */
export function websiteEmail({ eyebrow, title, intro, details = [], code, note, cta }: WebsiteEmailOptions) {
  const codeBlock = code ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;border:1px solid #bb803c;background:#171816;"><tr><td align="center" style="padding:22px;color:#d8b071;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;letter-spacing:9px;line-height:1;">${escapeHtml(code)}</td></tr></table>` : "";
  const noteBlock = note ? `<p style="margin:24px 0 0;color:#6c6d66;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">${textBlock(note)}</p>` : "";
  const siteUrl = websiteUrl();
  const logoUrl = `${siteUrl}/images/logo/star-full-256.png`;

  return `<!doctype html>
<html lang="en">
  <head><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>${escapeHtml(title)}</title></head>
  <body style="margin:0;padding:0;background:#dedbd1;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:0;padding:0;background:#dedbd1;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;background:#faf9f5;">
          <tr><td style="padding:24px 32px;background:#171816;border-bottom:3px solid #bb803c;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td valign="middle" style="padding:0 12px 0 0;"><a href="${escapeHtml(siteUrl)}" style="text-decoration:none;"><img src="${escapeHtml(logoUrl)}" width="48" height="48" alt="Star Energies" border="0" style="display:block;width:48px;height:48px;border:0;outline:none;text-decoration:none;" /></a></td>
              <td valign="middle" style="padding:0;"><span style="color:#faf9f5;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;line-height:1;">STAR <span style="font-weight:400;">ENERGIES</span></span></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:38px 32px 34px;">
            <p style="margin:0 0 17px;color:#bb803c;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.3px;line-height:1.4;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:0;color:#171816;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;letter-spacing:-.7px;line-height:1.08;">${textBlock(title)}</h1>
            <p style="margin:19px 0 0;color:#40413d;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;">${textBlock(intro)}</p>
            ${codeBlock}
            ${detailRows(details)}
            ${actionButton(cta)}
            ${noteBlock}
          </td></tr>
          <tr><td style="padding:18px 32px;background:#f1eee5;border-top:1px solid #dedbd1;color:#6c6d66;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:.35px;line-height:1.5;">STAR ENERGIES · WANI, MAHARASHTRA · INDIA</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
