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
    .then((projects) => {
        res.json(projects);
    })
})  

router.get('/projects/:id', (req, res) => {
  Project.findOne({id:req.params.id})
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
    .then((types) => {
        res.json(types);
    })
})  

router.get('/types/:id', (req, res) => {
  Type.findOne({id:req.params.id})
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
   

//use server to serve up routes
app.use('/api', router);
 
// launch our backend into a port
const apiPort = 3001;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));