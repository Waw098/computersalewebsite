// Simulated user data and authentication state
let isLoggedIn = false;
let currentUser = null;

// Get DOM elements
const userAuthSection = document.querySelector('.user-auth-section');
const userDetailsSection = document.querySelector('.user-details-section');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const userDetailUsername = document.getElementById('user-detail-username');
const userDetailEmail = document.getElementById('user-detail-email');
const userArea = document.querySelector('.user-area');
const userIconLink = document.querySelector('.user-area .user-icon');
const accountDetailsPopup = document.querySelector('.account-details-popup');
const popupWelcomeMessage = accountDetailsPopup ? accountDetailsPopup.querySelector('p') : null;
const popupAuthLink = accountDetailsPopup ? accountDetailsPopup.querySelector('a') : null;

// Function to update the UI based on login status
const updateAuthUI = () => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        isLoggedIn = true;
        currentUser = JSON.parse(storedUser);
    } else {
        isLoggedIn = false;
        currentUser = null;
    }

    if (userAuthSection && userDetailsSection) {
        if (isLoggedIn) {
            userAuthSection.style.display = 'none';
            userDetailsSection.style.display = 'block';
                if (currentUser) {
                    document.getElementById('user-detail-username-display').textContent = currentUser.username;
                    userDetailUsername.textContent = currentUser.username;
                    userDetailEmail.textContent = currentUser.email;
                }
        } else {
            userAuthSection.style.display = 'block';
            userDetailsSection.style.display = 'none';
        }
    }

    if (popupWelcomeMessage && popupAuthLink) {
        if (isLoggedIn) {
            popupWelcomeMessage.textContent = `Welcome, ${currentUser.username}!`;
            popupAuthLink.textContent = 'Logout';
            popupAuthLink.href = '#'; // Logout handled by JS
            popupAuthLink.removeEventListener('click', redirectToUserPage);
            popupAuthLink.addEventListener('click', handleLogout);
        } else {
            popupWelcomeMessage.textContent = 'Welcome, Guest!';
            popupAuthLink.textContent = 'Sign In / Register';
            popupAuthLink.href = 'user.html';
            popupAuthLink.removeEventListener('click', handleLogout);
            popupAuthLink.addEventListener('click', redirectToUserPage);
        }
    }

    if (userIconLink) {
        if (isLoggedIn) {
            userIconLink.href = 'user.html'; // Link to user details page
        } else {
            userIconLink.href = 'user.html'; // Link to login/signup page
        }
    }
};

const redirectToUserPage = (event) => {
    if (window.location.pathname !== '/user.html') {
        // Only prevent default if not already on user.html
        event.preventDefault();
        window.location.href = 'user.html';
    }
};

// Handle Registration
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        // Simulate API call to backend
        console.log('Registering...', { username, email, password });
        // In a real app, send this to your Python backend
        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Automatically log in the user after successful registration
                localStorage.setItem('loggedInUser', JSON.stringify({ username: username, email: email }));
                window.location.href = 'user.html'; // Redirect to user details page
            } else {
                alert(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration.');
        }
    });
}

// Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const identifier = document.getElementById('login-identifier').value; // Can be username or email
        const password = document.getElementById('login-password').value;

        // Simulate API call to backend
        console.log('Logging in...', { identifier, password });
        // In a real app, send this to your Python backend
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            const result = await response.json();
            if (response.ok) {
                // Simulate successful login
                localStorage.setItem('loggedInUser', JSON.stringify({ username: result.username, email: result.email }));
                updateAuthUI();
                alert(result.message);
                window.location.href = 'user.html'; // Redirect to user details page
            } else {
                alert(result.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    });
}

// Handle Logout
const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    isLoggedIn = false;
    currentUser = null;
    updateAuthUI();
    alert('You have been logged out.');
    window.location.href = 'index.html';
};

if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}

// Initial UI update on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    // Handle direct navigation to user.html with #login hash
    if (window.location.hash === '#login' && !isLoggedIn) {
        if (userAuthSection) userAuthSection.style.display = 'block';
        if (userDetailsSection) userDetailsSection.style.display = 'none';
    }
});
