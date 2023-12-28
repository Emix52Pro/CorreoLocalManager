const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

let currentUser = null;

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        showEmailManager();
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
}

function showEmailManager() {
    const loginContainer = document.getElementById('login-container');
    const emailManagerContainer = document.getElementById('email-manager-container');
    const inboxList = document.getElementById('inbox-list');
    const welcomeMessage = document.getElementById('welcome-message');

    loginContainer.classList.add('hidden');
    emailManagerContainer.classList.remove('hidden');

    // Show welcome message
    welcomeMessage.textContent = `Bienvenido, ${currentUser.username}!`;

    // Retrieve emails from local storage
    const emails = getEmails(currentUser.username);

    inboxList.innerHTML = '';
    emails.forEach((email, index) => {
        const li = document.createElement('li');

        // Check if the email is deleted
        if (!email.deleted) {
            // Display the message along with buttons for delete and pin
            li.innerHTML = `${email.from}: ${email.subject}: ${email.message}
                <button onclick="deleteEmail(${index})">Borrar Mensaje</button>
                <button onclick="markEmail(${index})">Marcar como leido</button>`;

            // Check if the email is pinned
            if (email.pinned) {
                li.style.fontWeight = 'bold';
            }

            inboxList.appendChild(li);
        }
    });
}


function sendEmail() {
    const toInput = document.getElementById('to');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const to = toInput.value;
    const subject = subjectInput.value;
    const message = messageInput.value;


    // Save the same email to the recipient's local storage
    const recipient = users.find(u => u.username === to);
    if (recipient) {
        // Correct the sender to be the current user and recipient to be the target user
        saveEmail(recipient.username, { from: currentUser.username, to: recipient.username, subject, message, pinned: false, deleted: false });
    } else {
        console.error(`Recipient ${to} not found`);
    }

    // Refresh inbox display
    showEmailManager();
}





function logout() {
    const loginContainer = document.getElementById('login-container');
    const emailManagerContainer = document.getElementById('email-manager-container');

    loginContainer.classList.remove('hidden');
    emailManagerContainer.classList.add('hidden');

    // Clear current user
    currentUser = null;
}

function saveEmail(username, email) {
    // Retrieve existing emails from local storage
    const existingEmails = getEmails(username);

    // Add the new email to the existing ones
    const updatedEmails = [...existingEmails, email];

    // Save the updated emails back to local storage
    localStorage.setItem(username, JSON.stringify(updatedEmails));
}

function getEmails(username) {
    // Retrieve emails from local storage for the given username
    const storedEmails = localStorage.getItem(username);

    // Parse the stored JSON data, or return an empty array if no data is found
    return storedEmails ? JSON.parse(storedEmails) : [];
}

function deleteEmail(index) {
    const emails = getEmails(currentUser.username);

    // Mark the email as deleted
    emails[index].deleted = true;

    // Save the updated emails back to local storage
    localStorage.setItem(currentUser.username, JSON.stringify(emails));

    // Refresh inbox display
    showEmailManager();
}

function markEmail(index) {
    const emails = getEmails(currentUser.username);

    // Toggle the pinned status of the email
    emails[index].pinned = !emails[index].pinned;

    // Save the updated emails back to local storage
    localStorage.setItem(currentUser.username, JSON.stringify(emails));

    // Refresh inbox display
    showEmailManager();
}