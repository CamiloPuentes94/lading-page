export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from 'resend';
import { z } from "zod";

const emailSchema = z.string().email();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = emailSchema.safeParse(body.email);

    if (!result.success) {
      return new Response(JSON.stringify({ message: "Email inválido" }), {
        status: 400,
      });
    }

    const email = result.data;
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const RESEND_AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID;

    // MODO DEV (Sin API Key)
    if (!RESEND_API_KEY) {
      console.log(`[DEV MODE] Email recibido para guardar: ${email}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return new Response(
        JSON.stringify({ message: "Simulación exitosa (Configura RESEND_API_KEY)" }),
        { status: 200 }
      );
    }

    // MODO PROD (Con Resend SDK)
    const resend = new Resend(RESEND_API_KEY);

    try {
        const { data, error } = await resend.contacts.create({
            email: email,
            unsubscribed: false,
            audienceId: RESEND_AUDIENCE_ID // Si esto es undefined, la SDK nos dirá si es obligatorio
        });

        if (error) {
            console.error("Resend API Error:", error);
            // Si el error es por falta de Audience ID, lo logueamos claro
            return new Response(JSON.stringify({ message: "No se pudo guardar el contacto." }), { status: 500 });
        }

        return new Response(
            JSON.stringify({ message: "¡Suscripción exitosa!" }),
            { status: 200 }
        );

    } catch (apiError) {
        console.error("Resend SDK Exception:", apiError);
        return new Response(JSON.stringify({ message: "Error de conexión con Resend" }), { status: 500 });
    }

  } catch (e) {
    console.error("Server Error:", e);
    return new Response(JSON.stringify({ message: "Error interno del servidor" }), {
      status: 500,
    });
  }
};