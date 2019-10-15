const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredient1: {
    type: String,
    required: true
  },
  ingredient2: {
    type: String,
    required: true
  },
  ingredient3: {
    type: String,
    required: true
  },
  effect: String,
  description: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Recipe', recipeSchema)
