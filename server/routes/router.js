const Router = require('express')
const route = new Router()

route.get('/', (req, res) => {
   console.log(res.send('this thing working'));
})

module.exports = route 