const mongoose = require('mongoose');

const DessertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  ingredients: [{ type: String }]
});

module.exports = mongoose.model('Dessert', DessertSchema);