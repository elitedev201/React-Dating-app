const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
require('dotenv').config();

const app = express();

const { newConnection } = require('./socket/newConnection');
const {
  getConnectedUsers,
  setConnectedUsers,
} = require('./socket/connectedUsers');
const disconnection = require('./socket/disconnection');
const newMessage = require('./socket/newMessage');
const joinChatroom = require('./socket/joinChatroom');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://ypetitjean.fr:3000'];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header(
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Credentials',
      'PUT, POST, GET, DELETE, OPTIONS',
    );
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token, Authorization',
  );
  next();
});

app.use('/users', require('./rest/components(C-M-R)/user/routes'));
app.use('/genders', require('./rest/components(C-M-R)/gender/routes'));
app.use('/interests', require('./rest/components(C-M-R)/interests/routes'));
app.use('/auth', require('./rest/components(C-M-R)/auth/routes'));
app.use('/visits', require('./rest/components(C-M-R)/visit/routes'));
app.use('/matchs', require('./rest/components(C-M-R)/match/routes'));
app.use('/likes', require('./rest/components(C-M-R)/like/routes'));
app.use('/block', require('./rest/components(C-M-R)/block/routes'));
app.use('/report', require('./rest/components(C-M-R)/report/routes'));
app.use('/chat', require('./rest/components(C-M-R)/chatroom/routes'));
app.use(
  '/notification',
  require('./rest/components(C-M-R)/notification/routes'),
);

app.use(
  '/validation',
  require('./rest/components(C-M-R)/userValidation/routes'),
);
app.use('/images', require('./rest/components(C-M-R)/images/routes'));

const server = require('http').Server(app);
const io = require('socket.io')(server);
// io.set('transports', ['xhr-polling']);
server.listen(3001, () => {
  console.log('Matcha is listening on port 3001!');
});

io.on('connection', async socket => {
  newConnection(io, socket, getConnectedUsers());
  socket.on('joinchatroom', function(match) {
    joinChatroom(match, getConnectedUsers()[socket.id], socket);
  });
  socket.on('error', function(err) {
    // console.log(err.stack);
  });
  socket.on('disconnect', function() {
    disconnection(io, getConnectedUsers(), socket);
  });

  socket.on('chat message', function(msg, match) {
    console.log('new msg', msg, match, getConnectedUsers()[socket.id]);
    newMessage(msg, match, getConnectedUsers()[socket.id], socket, io);
  });
});
