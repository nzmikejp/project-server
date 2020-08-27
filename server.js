//this is a NODE Express server
var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var cors = require('cors')
var mongoose = require('mongoose');

// the model
var Project = require('./project-model')

// the type
var Type = require('./type-model')

// the user
var User = require('./user-model')

//setup express server
var app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'))

//setup database connection
var connectionString = 'mongodb://admin:3Vl80y12@cluster0-shard-00-00.zjhza.mongodb.net:27017,cluster0-shard-00-01.zjhza.mongodb.net:27017,cluster0-shard-00-02.zjhza.mongodb.net:27017/testdb?ssl=true&replicaSet=atlas-l8lxtv-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(connectionString,{ useNewUrlParser: true })
var  db = mongoose.connection
db.once('open', () => console.log('Database connected'))
db.on('error', () => console.log('Database error'))

//setup routes
var router = express.Router();

//CRUD for projects
router.get('/projects', (req, res) => {
    Project.find()
    .populate('type')
    .then((project) => {
        res.json(project);
    })
})  

router.get('/projects/:id', (req, res) => {
  Project.findOne({id:req.params.id})
  .populate('type')
  .then((project) => {
      res.json(project);
  })
})  

router.post('/projects', (req, res) => {

  var project = new Project()
  project.id = Date.now()
  
  var data = req.body
  console.log(data)
  Object.assign(project,data)
  project.save()
  .then((project) => {
      res.json(project)
  })
  
})

router.put('/projects/:id', (req, res) => {

    Project.findOne({id:req.params.id})
    .then((project) => {
        var data = req.body
        Object.assign(project,data)
        return project.save()   
    })
    .then((project) => {
         res.json(project)
    })

})

router.delete('/projects/:id', (req, res) => {

    Project.deleteOne({id: req.params.id})
    .then(() => {
      res.json('deleted')
    })

})

//CRUD for type
router.get('/types', (req, res) => {
    Type.find()
    .populate('projects')
    .then((type) => {
        res.json(type);
    })
})  

router.get('/types/:id', (req, res) => {
  Type.findOne({id:req.params.id})
  .populate('projects')
  .then((type) => {
      res.json(type);
  })
})  

router.post('/types', (req, res) => {

  var type = new Type()
  type.id = Date.now()
  
  var data = req.body
  console.log(data)
  Object.assign(type,data)
  type.save()
  .then((type) => {
      res.json(type)
  })
  
})

router.put('/types/:id', (req, res) => {

    Type.findOne({id:req.params.id})
    .then((type) => {
        var data = req.body
        Object.assign(type,data)
        return type.save()   
    })
    .then((type) => {
         res.json(type)
    })

})

router.delete('/types/:id', (req, res) => {

    Type.deleteOne({id: req.params.id})
    .then(() => {
      res.json('deleted')
    })

})

//CRUD for user
router.get('/users', (req, res) => {
    User.find()
    .then((user) => {
        res.json(user);
    })
})  

router.get('/users/:id', (req, res) => {
  User.findOne({id:req.params.id})
  .then((user) => {
      res.json(user);
  })
})  

router.post('/users', (req, res) => {

  var user = new User()
  user.id = Date.now()
  
  var data = req.body
  console.log(data)
  Object.assign(user,data)
  user.save()
  .then((user) => {
      res.json(user)
  })
  
})

router.put('/users/:id', (req, res) => {

    User.findOne({id:req.params.id})
    .then((user) => {
        var data = req.body
        Object.assign(user,data)
        return user.save()   
    })
    .then((user) => {
         res.json(user)
    })

})

router.delete('/users/:id', (req, res) => {

    User.deleteOne({id: req.params.id})
    .then(() => {
      res.json('deleted')
    })

})
   

//use server to serve up routes
app.use('/api', router);
 
// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));