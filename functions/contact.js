import sanitizeHtml from 'sanitize-html';

/**
 * Cloudflare Pages Function for handling contact form submissions.
 * Endpoint: /api/contact (POST)
 *
 * Requires:
 * 1. RESEND_API_KEY as a secret/environment variable.
 * 2. D1_BINDING (e.g., 'DB') bound to a Cloudflare D1 database.
 * 3. TURNSTILE_SECRET_KEY as a secret/environment variable.
 * 4. ALLOWED_ORIGIN as a secret/environment variable (e.g., https://mi.sitio.com).
 */

// Placeholder for the D1 binding name.
const D1_BINDING_NAME = 'DB'; 

// Resend API endpoint
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

// Turnstile validation endpoint
const TURNSTILE_VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Helper function for JSON response
-const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
+const jsonResponse = (body, status = 200, origin) => new Response(JSON.stringify(body), {
     status,
     headers: {
         'Content-Type': 'application/json',
-        'Access-Control-Allow-Origin': '*',
+        'Access-Control-Allow-Origin': origin || '',
     },
 });
@@
-    const origin = request.headers.get('Origin');
+    const origin = request.headers.get('Origin');
     if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
       ...
-      return jsonResponse({ ... }, 403);
+      return jsonResponse({ ... }, 403, origin);
     }
@@
-    return jsonResponse({ success: true, message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.' });
+    return jsonResponse({ success: true, message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.' }, 200, origin);
        // In CF Pages, CORS is often handled by the function itself or the Pages configuration
        'Access-Control-Allow-Origin': '*', 
    },
});

// Helper for strict sanitization (removes all HTML)
const sanitize = (dirty) => sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {},
});

export async function onRequestPost({ request, env }) {
    try {
        // --- 0. Validación de Seguridad (CSRF y Turnstile) ---
        
        // A. Validación de Origen (CSRF)
        const origin = request.headers.get('Origin');
        if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) {
            console.warn('CSRF Warning: Origin mismatch.', { expected: env.ALLOWED_ORIGIN, actual: origin });
            return jsonResponse({ success: false, message: 'Solicitud no permitida (CSRF/Origin Mismatch).' }, 403);
        }

        const data = await request.json();
        
        // B. Validación de Turnstile (Rate-Limit / Anti-Bot)
        const token = data['cf-turnstile-response'];
        const ip = request.headers.get('CF-Connecting-IP');
        const secret = env.TURNSTILE_SECRET_KEY;

        if (!token || !secret) {
            console.error('Turnstile no configurado (token o secret faltante).');
            return jsonResponse({ success: false, message: 'Error de configuración del formulario.' }, 500);
        }

        const formData = new FormData();
        formData.append('secret', secret);
        formData.append('response', token);
        if (ip) formData.append('remoteip', ip);

        const turnstileResponse = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        const turnstileResult = await turnstileResponse.json();
        if (!turnstileResult.success) {
            console.warn('Fallo en la validación de Turnstile:', turnstileResult['error-codes']);
            return jsonResponse({ success: false, message: 'Fallo en la verificación anti-bot.' }, 403);
        }

        // --- 1. Validación de Datos y Sanitización (XSS) ---
        const { name, email, company, message } = data;

        // 1.1 Validación de campos obligatorios
        if (!name || !email || !message) {
            return jsonResponse({ 
                success: false, 
                message: 'Missing required fields: name, email, and message are mandatory.' 
            }, 400);
        }

        // 1.2 Sanitización (Prevención XSS)
        const saneName = sanitize(name);
        const saneEmail = sanitize(email);
        const saneCompany = sanitize(company || '');
        const saneMessage = sanitize(message);

        // Check for D1 and Resend API Key availability
        const db = env[D1_BINDING_NAME];
        const resendApiKey = env.RESEND_API_KEY;

        // --- 2. D1 Integration (Lead Storage) ---
        if (db) {
            try {
                // Use sane variables
                const { success } = await db.prepare(
                    'INSERT INTO leads (name, email, company, message) VALUES (?, ?, ?, ?)'
                ).bind(saneName, saneEmail, saneCompany, saneMessage).run();

                if (!success) {
                    console.error('D1 INSERT failed for lead:', saneEmail);
                    // CRÍTICO: No fallar silenciosamente. Devolver error al cliente.
                    return jsonResponse({ 
                        success: false, 
                        message: 'Error al guardar los datos. Por favor, inténtelo de nuevo.' 
                    }, 500);
                }
            } catch (d1Error) {
                console.error('D1 Database Error:', d1Error.message);
                // CRÍTICO: Devolver error al cliente.
                return jsonResponse({ 
                    success: false, 
                    message: 'Error de base de datos. Por favor, inténtelo de nuevo.' 
                }, 500);
            }
        } else {
            console.warn('D1 binding is missing. Lead not stored.');
        }

        // --- 3. Resend Integration (Email Notification) ---
        if (resendApiKey) {
            try {
                const resendData = {
                    from: 'Contact Form <onboarding@your-domain.com>', // MUST be a verified domain/email in Resend
                    to: ['your-email@example.com'], // Replace with [Tu Email]
                    subject: `New Contact Form Submission from ${saneName}`,
                    html: `
                        <p><strong>Name:</strong> ${saneName}</p>
                        <p><strong>Email:</strong> ${saneEmail}</p>
                        <p><strong>Company:</strong> ${saneCompany || 'N/A'}</p>
                        <p><strong>Message:</strong></p>
                        <p>${saneMessage}</p>
                    `,
                };

                const resendResponse = await fetch(RESEND_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resendData),
                });

                if (!resendResponse.ok) {
                    const errorBody = await resendResponse.json();
                    console.error('Resend API Error:', resendResponse.status, errorBody);
                    // CRÍTICO: Devolver error al cliente.
                    return jsonResponse({ 
                        success: false, 
                        message: 'Error al enviar la notificación. Por favor, inténtelo de nuevo.' 
                    }, 500);
                }
            } catch (resendError) {
                console.error('Resend Fetch Error:', resendError.message);
                // CRÍTICO: Devolver error al cliente.
                return jsonResponse({ 
                    success: false, 
                    message: 'Error de red al enviar la notificación. Por favor, inténtelo de nuevo.' 
                }, 500);
            }
        } else {
            console.warn('RESEND_API_KEY is missing. Email not sent.');
        }

        // 4. Success Response
        return jsonResponse({ 
            success: true, 
            message: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.' 
        });

    } catch (error) {
        console.error('Function Catch Error:', error.message);
        return jsonResponse({ 
            success: false, 
            message: 'Internal server error. Please check function logs.' 
        }, 500);
    }
}
