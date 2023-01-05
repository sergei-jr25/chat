const trimStr = require("./utils")

const users = []

const findUser = (user) => {
   const userName = trimStr(user.username || '')
   const userRoom = trimStr(user.room || '')

   return users.find(u => trimStr(u.username) === userName && trimStr(u.room) === userRoom)
}


const addUser = (user) => {

   const isExist = findUser(user)
   !isExist && users.push(user)
   const currentUser = isExist || user

   return { isExist: !!isExist, user: currentUser }
}

const usersToRoom = (room) => {
   return users.filter(u => u.room === room)
}

const removeUser = (user) => {
   const found = findUser(user)

   if (user) {
      users = users.filter(u.room === found.room && u.username !== found.username)
   }

   return found
}
module.exports = { addUser, findUser, usersToRoom, removeUser }
