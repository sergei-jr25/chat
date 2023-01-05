const express = require('express')
const app = express()
const route = require('./routes/router')
const cors = require('cors')
const http = require('http')
const { Server } = require("socket.io");
const { addUser, findUser, usersToRoom } = require('./users')

const server = http.createServer(app)
app.use(cors())
app.use('/', route)

const io = new Server(server, {
   cors: {
      origin: "*",
      methods: ['GET', 'POSTS']
   }
});

io.on('connect', (socket) => {
   socket.on('join', ({ username, room }) => {
      socket.join(room)
      const { user, isExist } = addUser({ username, room })

      const userMessage = isExist
         ? `${user.username} here yo go again`
         : ` Hello ${user.username} `

      socket.emit('message', {
         data: { user: { name: 'Admin', message: userMessage } }
      })

      socket.broadcast.to(user.room).emit('message', {
         data: { user: { name: 'Admin', message: `Your in room  ${user.room}` } }
      })
      console.log(user.room);
      io.to(user.room).emit('joinRoom', { data: { users: usersToRoom(user.room) } })

   })

   socket.on('sendMessage', ({ message, params }) => {
      const user = findUser(params)

      if (user) {
         io.to(user.room).emit('message', { data: { user, message } })
      }
   })
   socket.on('leftRoom', ({ params }) => {
      const { username, room } = removeUser(params)

      if (user) {
         io.to(room).emit('message', { data: { user: { name: 'Admin' }, message: `Goodbay ${username}` } })
      }

      io.to(room).emit('joinRoom', { data: { user, message } })

   })

   io.on('disconnect', () => {
      console.log('disconnect');
   })
})

server.listen(5000, () => {
   console.log('Server run start on the port 5000');
})