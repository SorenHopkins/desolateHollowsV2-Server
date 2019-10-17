// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for inventorys
const inventory = require('../models/inventory')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { inventory: { title: '', text: 'foo' } } -> { inventory: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

const inventorySeed = require('./inventorySeed/inventorySeed.js')

// INDEX
// GET /inventorys
router.get('/inventorys', requireToken, (req, res, next) => {
  inventory.find({ owner: req.user.id })
    .populate(inventory.potions)
    .then(inventorys => {
      // `inventorys` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return inventorys.map(inventory => inventory.toObject())
    })
    // respond with status 200 and JSON of the inventorys
    .then(inventorys => res.status(200).json({ inventorys: inventorys }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /inventorys/5a7db6c74d55bc51bdf39793
router.get('/inventorys/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  inventory.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "inventory" JSON
    .then(inventory => res.status(200).json({ inventory: inventory.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /inventorys
router.post('/inventorys', requireToken, (req, res, next) => {
  // set owner of new inventory to be current user
  const inventoryGenerate = inventorySeed
  inventoryGenerate.owner = req.user.id

  inventory.find({ owner: req.user.id }).populate('potions')
    .then(inventorys => {
      // if inventorys length != 0, just return the result of our get
      if (inventorys.length) {
        console.log(inventorys)
        const returnInventorys = inventorys.map(inventory => inventory.toObject())
        return res.status(200).json({ inventorys: returnInventorys })
        // else, create an inventory object from our template
      } else {
        return inventory.create(inventoryGenerate)
      }
    }
    )
    .then(() => inventory.find({ owner: req.user.id }).populate('potions'))
    .then(goggle => {
      // `inventorys` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      console.log(goggle)
      return goggle.map(inventory => inventory.toObject())
    })
    .then(inventorys => {
      res.status(200).json({ inventorys: inventorys })
    })
    .catch(next)
})

// UPDATE
// PATCH /inventorys/5a7db6c74d55bc51bdf39793
router.patch('/inventorys/:id', requireToken, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.inventory.owner
  delete req.body.inventory.id

  // const potions = req.body.inventory.potions

  inventory.findById(req.params.id)
    .then(handle404)
    .then(inventory => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, inventory)

      // pass the result of Mongoose's `.update` to the next `.then`
      return inventory.set(req.body.inventory).save()
    })
    // if that succeeded, get the Inventory back toi return
    .then(data => {
      console.log(data)
      return inventory.find({ owner: req.user.id }).populate('potions')
    })
    .then(inventorys => {
      // `inventorys` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return inventorys.map(inventory => inventory.toObject())
    })
    .then(inventorys => {
      res.status(200).json({ inventorys: inventorys })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.patch('/ingredients/:id/', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.inventorys.owner

  inventory.findById(req.params.id)
    .then(handle404)
    .then(inventory => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, inventory)

      // pass the result of Mongoose's `.update` to the next `.then`
      inventory.updateOne(req.body.inventorys)
    })
    // if that succeeded, get the Inventory back toi return
    .then(data => {
      return inventory.find({ owner: req.user.id })
    })
    .then(inventorys => {
      // `inventorys` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return inventorys.map(inventory => inventory.toObject())
    })
    .then(inventorys => {
      res.status(200).json({ inventorys: inventorys })
    })
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /inventorys/5a7db6c74d55bc51bdf39793
router.delete('/inventorys/:id', requireToken, (req, res, next) => {
  inventory.findById(req.params.id)
    .then(handle404)
    .then(inventory => {
      // throw an error if current user doesn't own `inventory`
      requireOwnership(req, inventory)
      // delete the inventory ONLY IF the above didn't throw
      inventory.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
