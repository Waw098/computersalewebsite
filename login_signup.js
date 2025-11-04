// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to erase a cookie
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const backendUrl = 'http://localhost:5000'; // Replace with your actual backend URL

document.addEventListener('DOMContentLoaded', () => {
    const userAuthIcon = document.getElementById('user-auth-icon');
    const authToken = getCookie('authToken');

    if (userAuthIcon) {
        // Redirect to user-detail.html if logged in, otherwise to user-auth.html
        if (authToken) {
            userAuthIcon.href = 'user-detail.html';
        } else {
            userAuthIcon.href = 'user-auth.html';
        }
    }

    // Logic for user-auth.html
    if (document.getElementById('signup-form')) {
        const showSignupBtn = document.getElementById('show-signup');
        const showLoginBtn = document.getElementById('show-login');
        const signupForm = document.getElementById('signup-form');
        const loginForm = document.getElementById('login-form');
        const signupMessage = document.getElementById('signup-message');
        const loginMessage = document.getElementById('login-message');

        showSignupBtn.addEventListener('click', () => {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
            showSignupBtn.classList.add('active');
            showLoginBtn.classList.remove('active');
            signupMessage.textContent = '';
            loginMessage.textContent = '';
        });

        showLoginBtn.addEventListener('click', () => {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            showLoginBtn.classList.add('active');
            showSignupBtn.classList.remove('active');
            signupMessage.textContent = '';
            loginMessage.textContent = '';
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const response = await fetch(`${backendUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    signupMessage.textContent = data.message;
                    signupMessage.style.color = 'green';
                    // Optionally, switch to login form after successful registration
                    showLoginBtn.click();
                } else {
                    signupMessage.textContent = data.error || 'Registration failed.';
                    signupMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during registration:', error);
                signupMessage.textContent = 'An error occurred. Please try again.';
                signupMessage.style.color = 'red';
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = document.getElementById('login-identifier').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(`${backendUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ identifier, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    setCookie('authToken', data.token, 7); // Store token for 7 days
                    loginMessage.textContent = 'Login successful!';
                    loginMessage.style.color = 'green';
                    window.location.href = 'user-detail.html'; // Redirect to user detail page
                } else {
                    loginMessage.textContent = data.error || 'Login failed.';
                    loginMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during login:', error);
                loginMessage.textContent = 'An error occurred. Please try again.';
                loginMessage.style.color = 'red';
            }
        });
    }

    // Logic for user-detail.html
    if (document.getElementById('display-username')) {
        const displayUsername = document.getElementById('display-username');
        const displayEmail = document.getElementById('display-email');
        const logoutButton = document.getElementById('logout-button');

        if (!authToken) {
            window.location.href = 'user-auth.html'; // Redirect if not logged in
            return;
        }

        // Fetch user details
        async function fetchUserDetails() {
            try {
                const response = await fetch(`${backendUrl}/user-details`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    displayUsername.textContent = data.username;
                    displayEmail.textContent = data.email;
                } else {
                    alert(data.error || 'Failed to fetch user details.');
                    eraseCookie('authToken');
                    window.location.href = 'user-auth.html';
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                alert('An error occurred while fetching user details. Please log in again.');
                eraseCookie('authToken');
                window.location.href = 'user-auth.html';
            }
        }

        fetchUserDetails();

        logoutButton.addEventListener('click', () => {
            eraseCookie('authToken');
            window.location.href = 'user-auth.html'; // Redirect to login page after logout
        });
    }
});