const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  potions: [String],
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
