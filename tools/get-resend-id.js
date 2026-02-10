import 'dotenv/config'; // Esto carga las variables del .env automáticamente
import { Resend } from 'resend';

// Leemos la KEY
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: No encontré RESEND_API_KEY en tu archivo .env");
    console.error("👉 Uso: RESEND_API_KEY=re_123... node tools/get-resend-id.js");
    process.exit(1);
}

const resend = new Resend(apiKey);

async function findAudience() {
    console.log("🔍 Buscando audiencias en tu cuenta de Resend...");
    try {
        // Listamos las audiencias
        const { data, error } = await resend.audiences.list();

        if (error) {
            console.error("❌ Error de Resend:", error);
            return;
        }

        if (!data || data.data.length === 0) {
            console.log("⚠️ No encontré ninguna audiencia creada.");
            console.log("💡 Creando una por defecto llamada 'Landing Leads'...");
            
            // Si no hay, creamos una para salvarte las papas
            const create = await resend.audiences.create({ name: 'Landing Leads' });
            
            if (create.error) {
                console.error("❌ Error al crear audiencia:", create.error);
            } else {
                console.log("\n✅ ¡LISTO! Audiencia creada.");
                console.log("🆔 TU AUDIENCE ID ES: " + create.data.id);
                console.log("📝 Copialo a tu archivo .env");
            }
        } else {
            console.log("\n✅ ¡ENCONTRADO! Aquí tenés tus audiencias:");
            data.data.forEach(aud => {
                console.log(`----------------------------------------`);
                console.log(`📛 Nombre: ${aud.name}`);
                console.log(`🆔 ID:     ${aud.id}`);
            });
            console.log(`----------------------------------------`);
            console.log("📝 Copiá el ID de la que quieras usar a tu archivo .env");
        }

    } catch (e) {
        console.error("❌ Error inesperado:", e);
    }
}

findAudience();