document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm') as HTMLFormElement | null;
    const statusMessage = document.getElementById('statusMessage') as HTMLDivElement | null;
    const submitButton = document.getElementById('submitButton') as HTMLButtonElement | null;

    if (!form || !statusMessage || !submitButton) return;

    const showMessage = (message: string, type: 'success' | 'error') => {
        statusMessage.textContent = message;
        statusMessage.className = `py-2 text-center font-medium rounded-md ${type === 'success' ? 'bg-manus-success-100 text-manus-success-700' : 'bg-manus-alert-100 text-manus-alert-700'}`;
        statusMessage.style.display = 'block';
    };

    const toggleFormState = (isDisabled: boolean) => {
        submitButton.disabled = isDisabled;
        submitButton.textContent = isDisabled ? 'Sende...' : 'Nachricht Senden';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusMessage.style.display = 'none';
        toggleFormState(true);

        const formData = new FormData(form);
        const data: Record<string, any> = Object.fromEntries(formData.entries());

        // Add Turnstile response token to the data object
        const turnstileToken = formData.get('cf-turnstile-response');
        if (turnstileToken) {
            data['cf-turnstile-response'] = turnstileToken;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
                form.reset();
            } else {
                // Fallback for non-200 but handled errors from the function
                showMessage(result.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showMessage('Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.', 'error');
        } finally {
            toggleFormState(false);
        }
    });
});
