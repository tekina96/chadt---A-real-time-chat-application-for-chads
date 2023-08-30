const socket = io("http://localhost:8000", { transports: ["websocket"] });

// get DOM elements in respective JS variables
const form = document.getElementById('send-container');
const message = document.getElementById('messageInp');
const messagecontainer = document.querySelector('.container');
// Audio that'll be played after receiving messages
var audio = new Audio('ting.mp3');

// Function which will append events info on the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messagecontainer.append(messageElement);
    if(position == 'left') audio.play();
}

// Ask the name of new user and send it to the server
const username = prompt("Whats your name ?");
socket.emit('new-user-joined', username);

// when a new user joins, receive their names from server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
})

// when receive a new message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message} `, 'left');
})

// When a user leaves, let the server know / append the info to the container
socket.on('left', name => {
    append(`${name} left the chat `, 'right');
})

// If the form gets submitted send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value;
    append(`you: ${message}`, 'right');
    socket.emit('send', message);
    messageInp.value = '';
})

