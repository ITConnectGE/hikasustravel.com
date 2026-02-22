export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (request.method !== 'POST' || new URL(request.url).pathname !== '/send') {
      return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders })
    }

    if (origin !== env.ALLOWED_ORIGIN) {
      return Response.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders })
    }

    try {
      const body = await request.json()
      const { name, email, phone, travelers, startDate, endDate, message, tour_title } = body

      if (!name || !email || !travelers || !tour_title) {
        return Response.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders })
      }

      const html = `
        <h2>New Tour Inquiry: ${tour_title}</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
          ${phone ? `<tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${phone}</td></tr>` : ''}
          <tr><td style="padding:6px 12px;font-weight:bold;">Travelers</td><td style="padding:6px 12px;">${travelers}</td></tr>
          ${startDate ? `<tr><td style="padding:6px 12px;font-weight:bold;">Start Date</td><td style="padding:6px 12px;">${startDate}</td></tr>` : ''}
          ${endDate ? `<tr><td style="padding:6px 12px;font-weight:bold;">End Date</td><td style="padding:6px 12px;">${endDate}</td></tr>` : ''}
          ${message ? `<tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${message}</td></tr>` : ''}
        </table>
      `

      const form = new FormData()
      form.append('from', `Hikasus Travel <noreply@${env.MAILGUN_DOMAIN}>`)
      form.append('to', 'info@hikasustravel.com')
      form.append('subject', `New Tour Inquiry: ${tour_title}`)
      form.append('h:Reply-To', email)
      form.append('html', html)

      const resp = await fetch(`https://api.eu.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa('api:' + env.MAILGUN_API_KEY) },
        body: form,
      })

      if (!resp.ok) {
        const text = await resp.text()
        console.error('Mailgun error:', text)
        return Response.json({ error: 'Failed to send email' }, { status: 502, headers: corsHeaders })
      }

      return Response.json({ success: true }, { headers: corsHeaders })
    } catch (err) {
      console.error('Worker error:', err)
      return Response.json({ error: 'Internal error' }, { status: 500, headers: corsHeaders })
    }
  },
}
