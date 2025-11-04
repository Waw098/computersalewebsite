document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            try {
                // Replace '/api/contact' with your actual backend endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                });

                if (response.ok) {
                    alert('Your message has been sent successfully!');
                    contactForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json();
                    alert(`Failed to send message: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                alert('There was a problem sending your message. Please try again later.');
            }
        });
    }
});
