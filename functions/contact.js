/**
 * Cloudflare Pages Function for handling contact form submissions.
 * Endpoint: /api/contact (POST)
 *
 * Requires:
 * 1. RESEND_API_KEY as a secret/environment variable.
 * 2. D1_BINDING (e.g., 'DB') bound to a Cloudflare D1 database.
 */

// Placeholder for the D1 binding name.
// This must match the name used in your Cloudflare Pages project settings (e.g., 'DB').
const D1_BINDING_NAME = 'DB'; 

// Resend API endpoint
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

// Helper function for JSON response
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust for production
    },
});

export async function onRequestPost({ request, env }) {
    try {
        const data = await request.json();
        const { name, email, company, message } = data;

        // 1. Validation
        if (!name || !email || !message) {
            return jsonResponse({ 
                success: false, 
                message: 'Missing required fields: name, email, and message are mandatory.' 
            }, 400);
        }

        // Check for D1 and Resend API Key availability
        const db = env[D1_BINDING_NAME];
        const resendApiKey = env.RESEND_API_KEY;

        if (!db || !resendApiKey) {
            console.error('Missing D1 binding or RESEND_API_KEY in environment variables.');
            // Still proceed with the email if one is missing, but log the error
        }

        // --- 2. D1 Integration (Lead Storage) ---
        if (db) {
            try {
                // Ensure the table exists (uncomment this for first run or use a migration)
                // await db.exec(`
                //     CREATE TABLE IF NOT EXISTS leads (
                //         id INTEGER PRIMARY KEY,
                //         name TEXT NOT NULL,
                //         email TEXT NOT NULL,
                //         company TEXT,
                //         message TEXT NOT NULL,
                //         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                //     );
                // `);

                const { success } = await db.prepare(
                    'INSERT INTO leads (name, email, company, message) VALUES (?, ?, ?, ?)'
                ).bind(name, email, company || null, message).run();

                if (!success) {
                    console.error('D1 INSERT failed for lead:', email);
                }
            } catch (d1Error) {
                console.error('D1 Database Error:', d1Error.message);
                // Non-critical error, continue to send email
            }
        }

        // --- 3. Resend Integration (Email Notification) ---
        if (resendApiKey) {
            try {
                const resendData = {
                    from: 'Contact Form <onboarding@your-domain.com>', // MUST be a verified domain/email in Resend
                    to: ['your-email@example.com'], // Replace with [Tu Email]
                    subject: `New Contact Form Submission from ${name}`,
                    html: `
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Company:</strong> ${company || 'N/A'}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
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
                    // Non-critical error, continue to return success to user
                }
            } catch (resendError) {
                console.error('Resend Fetch Error:', resendError.message);
                // Non-critical error, continue to return success to user
            }
        }

        // 4. Success Response
        return jsonResponse({ 
            success: true, 
            message: 'Your message has been successfully sent and recorded.' 
        });

    } catch (error) {
        console.error('Function Error:', error.message);
        return jsonResponse({ 
            success: false, 
            message: 'Internal server error. Please check function logs.' 
        }, 500);
    }
}
