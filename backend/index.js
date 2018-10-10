// Library imports
var express    = require('express')
var app        = express()
var bodyParser = require('body-parser')
var Web3 = require('web3')
var tokenIssue = require('./tokenIssue')
const privateKeyProvider = require('./utils/privateKeyProviderEngine')
const Promise = require('bluebird')
var jwt    = require('jsonwebtoken')

// Config imports
var config = require('./config')

// Web3 setup
var web3 = new Web3(new privateKeyProvider(config.private_key, config.rpc_address)) //Genache for now make configurable
if (typeof web3.eth.getAccountsPromise === 'undefined') {
  Promise.promisifyAll(web3.eth, { suffix: 'Promise' })
}

// JWT setup
app.set('superSecret', config.secret)

// Express extentions
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var router = express.Router()

// Middleware JWT Protection
// ==========================================================
// route middleware to verify a token
router.use(function(req, res, next) {

  // check post parameters for token
  var token = req.headers['Authorization']

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        const nonceSig = 'TODO:: not implemented'
        const jwt = 'TODO:: not implemented'
        return res.json({ success: false, nonce, nonceSig, jwt, message: 'Failed to authenticate token.' })
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })
  } else {
    const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    const nonceSig = 'TODO:: not implemented'
    const jwt = 'TODO:: not implemented'
    return res.json({ success: false, nonce, nonceSig, jwt, message: 'Failed to authenticate token.' })
  }
})

router.get('/', function(req, res) {
  res.json({ message: 'Welcome' })
})

router.post('/token/issue', function(req, res) {
  const address = req.body._from
  id = 1
  console.log(tokenIssue.computeMintedSignature(id, _from, gasAndIssuing, web3))
  id++
  res.json({ message: 'token issued' })
})

router.post('/fetchKeyword', function(req, res) {
  const tokenIndex = req.body.tokenIndex
  res.json({ message: 'it worked', id: tokenIndex })
})

// Base route
app.use('/api', router)

app.listen(config.port)

console.log('Server is running on port: %i', config.port)
console.log('Server Node Version: %s', process.version)
console.log('Server Web3 version: %s', web3.version)
// console.log('Server account address is: %s', gasPayingAccount.address)
console.log('http://localhost:%i/api', config.port)
