var express = require('express');
var app = express();
var http = require('http').createServer(app);
const PORT = 8080;
const io = require("socket.io")(http, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
const path = require('path');
var cors = require('cors');

var STATIC_CHANNELS = [{
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: [],
    messages: []
}, {
    name: 'Ayo',
    participants: 0,
    id: 2,
    sockets: [],
    messages: []
}];

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Accept', '*');
    next();
})

// app.use(cors());

app.get('/', function (req, res) {
    // res.sendFile(path.join(__dirname, '/piss.html'));
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);

    socket.on('channel-join', id => {
        console.log('channel joined')
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) === -1) {
                    c.sockets.push(socket.id)
                    c.participants++;
                    io.emit('channel', c);
                }

            }
            else {
                let index = c.sockets.indexOf(socket.id);
                if (index !== -1) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });
        return id;
    });

    socket.on('send-message', message => {
        console.log('send-message')
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });


});



/**
 * @description This methos retirves the static channels
 */
app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});