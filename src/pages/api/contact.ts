export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message ?? 'Invalid data';
      return new Response(JSON.stringify({ ok: false, error: firstError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { name, email, message } = result.data;

    // Support both Vite env (build time) and process.env (Docker runtime injection)
    const RESEND_API_KEY =
      import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.log('[DEV MODE] Contact form submission received — no RESEND_API_KEY configured');
      console.log({ name, email, message });
      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Contacto Web <onboarding@resend.dev>',
      to: 'camandrefactory@gmail.com',
      subject: `Nuevo contacto: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0EA472;">Nuevo mensaje de contacto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; width: 80px;">Nombre:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Mensaje:</td>
              <td style="padding: 8px 0; white-space: pre-line;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Error sending email. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Server Error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
