import nodemailer from 'nodemailer'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestMap = new Map()

const REQUIRED_SMTP_ENV_VARS = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']

const normalizeIp = (request) => {
  const forwarded = request.headers['x-forwarded-for']

  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0]
  }

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }

  return request.socket?.remoteAddress || 'unknown'
}

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const isRateLimited = (ip) => {
  const now = Date.now()
  const previousHits = requestMap.get(ip) || []
  const validHits = previousHits.filter((time) => now - time < RATE_LIMIT_WINDOW_MS)

  if (validHits.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestMap.set(ip, validHits)
    return true
  }

  validHits.push(now)
  requestMap.set(ip, validHits)
  return false
}

const validatePayload = ({ name, email, message }) => {
  const safeName = typeof name === 'string' ? name.trim() : ''
  const safeEmail = typeof email === 'string' ? email.trim() : ''
  const safeMessage = typeof message === 'string' ? message.trim() : ''

  if (safeName.length < 2 || safeName.length > 80) {
    return { error: 'Name must be between 2 and 80 characters.' }
  }

  if (safeMessage.length < 10 || safeMessage.length > 3000) {
    return { error: 'Message must be between 10 and 3000 characters.' }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(safeEmail)) {
    return { error: 'Please provide a valid email address.' }
  }

  return {
    payload: {
      name: safeName,
      email: safeEmail,
      message: safeMessage,
    },
  }
}

const missingSmtpVars = () => REQUIRED_SMTP_ENV_VARS.filter((key) => !process.env[key])

const getSmtpPassword = () => {
  const rawPassword = process.env.SMTP_PASS ?? ''
  const host = (process.env.SMTP_HOST ?? '').toLowerCase()

  // Gmail app passwords are often copied with separators (spaces or dashes).
  if (host.includes('gmail')) {
    return rawPassword.replace(/[\s-]/g, '')
  }

  return rawPassword
}

const getSmtpConfigError = () => {
  const host = (process.env.SMTP_HOST ?? '').toLowerCase()

  if (host.includes('gmail')) {
    const normalizedPassword = getSmtpPassword()

    if (normalizedPassword.length !== 16) {
      return 'Gmail app password must be exactly 16 characters (excluding spaces or dashes).'
    }
  }

  return null
}

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: getSmtpPassword(),
    },
  })

const parseBody = (requestBody) => {
  if (!requestBody) {
    return {}
  }

  if (typeof requestBody === 'string') {
    try {
      return JSON.parse(requestBody)
    } catch {
      return {}
    }
  }

  if (typeof requestBody === 'object') {
    return requestBody
  }

  return {}
}

const json = (response, status, payload) => response.status(status).json(payload)

export default async function handler(request, response) {
  if (request.method === 'GET') {
    return json(response, 200, { ok: true })
  }

  if (request.method !== 'POST') {
    return json(response, 405, { ok: false, message: 'Method not allowed.' })
  }

  const clientIp = normalizeIp(request)

  if (isRateLimited(clientIp)) {
    return json(response, 429, { ok: false, message: 'Too many requests. Please wait and try again.' })
  }

  const validation = validatePayload(parseBody(request.body))

  if (!validation.payload) {
    return json(response, 400, { ok: false, message: validation.error })
  }

  const missingVars = missingSmtpVars()

  if (missingVars.length > 0) {
    console.error('SMTP environment not configured. Missing:', missingVars.join(', '))
    return json(response, 500, { ok: false, message: 'Email backend is not configured yet.' })
  }

  const smtpConfigError = getSmtpConfigError()

  if (smtpConfigError) {
    return json(response, 500, { ok: false, message: smtpConfigError })
  }

  const { name, email, message } = validation.payload
  const sentAt = new Date().toISOString()
  const recipient = process.env.CONTACT_RECEIVER || process.env.SMTP_USER

  const text = [
    'New portfolio contact message',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Time: ${sentAt}`,
    '',
    'Message:',
    message,
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">New portfolio contact message</h2>
      <p style="margin: 0 0 4px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 4px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 16px 0;"><strong>Time:</strong> ${escapeHtml(sentAt)}</p>
      <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
    </div>
  `

  const transporter = createTransporter()

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      replyTo: email,
      subject: `Portfolio Inquiry from ${name}`,
      text,
      html,
    })

    return json(response, 200, { ok: true })
  } catch (error) {
    console.error('SMTP send failed:', error)

    if (error && typeof error === 'object' && 'code' in error && error.code === 'EAUTH') {
      return json(response, 502, {
        ok: false,
        message: 'SMTP authentication failed. Check SMTP_USER and Gmail app password in your environment variables.',
      })
    }

    return json(response, 502, {
      ok: false,
      message: 'Unable to send your message right now. Please try again later.',
    })
  }
}
