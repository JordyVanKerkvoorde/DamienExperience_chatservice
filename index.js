const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/webclient/index.html');
})

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(3000, () => {
    console.log('listening on 3000')
});