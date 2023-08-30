// Node server to handle socket io connections
const io = require('socket.io')(8000);
const users = {};

io.on('connection', socket => {
    // Whenever a new user joins, let other existing users know
    socket.on('new-user-joined', username => {
        // console.log('New user', username);
        users[socket.id] = username;
        socket.broadcast.emit('user-joined', username);
    });

    // Whenever a message is send, broadcast it to others
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // Whenever an existing user left, let other existing users know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});