// Vercel Node function. Credentials stay server-side. No form payload logging.
const { createHash } = require('node:crypto');
const EMAIL = 'ilyalex.yacine@gmail.com';
module.exports = async function contact(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ready = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_DELIVERY_ENABLED === 'true');
  if (req.method === 'GET') return res.status(200).json({ ready });
  if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'method' }); }
  if (!ready) return res.status(503).json({ error: 'unavailable' });
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host || origin !== `https://${host}`) return res.status(403).json({ error: 'origin' });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({ error: 'content_type' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'invalid' }); }
  if (!body || typeof body !== 'object' || JSON.stringify(body).length > 14000) return res.status(400).json({ error: 'invalid' });
  if (body.website) return res.status(400).json({ error: 'invalid' });
  const clean = (key, max) => typeof body[key] === 'string' && body[key].length <= max ? body[key].trim() : '';
  const name = clean('name', 120), email = clean('email', 254), message = clean('message', 6000), service = clean('service', 150);
  if (!name || /[\r\n]/.test(name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) return res.status(400).json({ error: 'invalid' });
  const key = createHash('sha256').update(JSON.stringify([name,email,message,service])).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST', signal:AbortSignal.timeout(10000),
      headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`contact-${key}`},
      body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:[EMAIL],reply_to:email,subject:`AIRFLOW enquiry: ${name}`,text:`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`})
    });
    const result = await response.json();
    if (!response.ok || !result.id) return res.status(502).json({ error:'delivery' });
    return res.status(200).json({ ok:true });
  } catch { return res.status(502).json({ error:'delivery' }); }
};
