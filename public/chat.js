const output = document.getElementById('output');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const feedback = document.getElementById('feedback');
const roomMessage = document.querySelector('.room-message');
const usersList = document.querySelector('.users');

const socket = io.connect('https://web-production-58b7.up.railway.app/');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomname = urlParams.get('roomname');

roomMessage.textContent = `Connected to room ${roomname}`;

socket.emit('joined-user', {
    username: username,
    roomname: roomname
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        socket.emit('chat', {
            username: username,
            message: message,
            roomname: roomname
        });
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', () => {
    socket.emit('typing', {
        username: username,
        roomname: roomname
    });
});

socket.on('joined-user', (data) => {
    output.innerHTML += `<p>--> <strong><em>${data.username}</strong> has Joined the Room</em></p>`;
});

socket.on('chat', (data) => {
    output.innerHTML += `<p><strong>${data.username}</strong>: ${data.message}</p>`;
    feedback.innerHTML = '';
    output.scrollTop = output.scrollHeight;
});

socket.on('typing', (user) => {
    feedback.innerHTML = `<p><em>${user.username} is typing...</em></p>`;
});

socket.on('online-users', (data) => {
    usersList.innerHTML = '';
    data.forEach(user => {
        usersList.innerHTML += `<p>${user}</p>`;
    });
});
