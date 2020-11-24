const path = require('path')
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 3000 || process.env.PORT;
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');
const systemName = 'DamienSystem'

app.use(express.static(path.join(__dirname, 'webclient')));

io.on('connection', (socket) => {
    socket.on('join room', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //message on user joins room
        socket.broadcast
            .to(user.room)
            .emit('chat message', formatMessage(systemName, `${username} has joined the chat`));
    });

    //listen to message
    socket.on('chat message', (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('chat message', formatMessage(user.username, msg));
    });

    //message on user disconnect
    socket.on('disconnect', () => {
        io.emit('chat message', formatMessage(systemName, 'a user has left the chat'))
    });

    
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
