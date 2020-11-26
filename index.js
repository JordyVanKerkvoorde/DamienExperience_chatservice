const path = require('path')
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ["GET", "POST"],
      credentials: true,
      transports: ['websocket']
    }
  });
const PORT = process.env.PORT || 3000;
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');
const systemName = 'DamienSystem'


//app.use(express.static(path.join(__dirname, 'webclient')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

io.on('connection', (socket) => {
    //console.log('connection')
    socket.on('join room', ({username, email, room}) => {
        //console.log('client joined')
        const user = userJoin(socket.id, username, email, room);

        socket.join(user.room);

        //message on user joins room
        socket.broadcast
            .to(user.room)
            .emit('chat message', formatMessage(systemName, `${username} has joined the chat`));
    });

    //listen to message
    socket.on('chat message', (msg) => {
        //console.log('message received')
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('chat message', formatMessage(user, msg));
    });

    //message on user disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('chat message', formatMessage(systemName, `${user.username} has left the chat`));
        }
    });

    
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
