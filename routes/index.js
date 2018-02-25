const routes = require('express').Router();
const battle = require('./battle')

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Winter Is Coming!!!' });
});

//Add battels API >>>>>>>>>>>>>
routes.use('/battles', battle)

module.exports = routes;