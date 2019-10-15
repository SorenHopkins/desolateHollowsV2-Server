const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  potions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'}],
  ingredients:
    [
      {
        name: String,
        description: String,
        available: Boolean
      }
    ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Inventory', inventorySchema)
