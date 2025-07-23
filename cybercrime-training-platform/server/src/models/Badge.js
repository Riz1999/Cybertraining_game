/**
 * Badge model
 */
const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please add a badge ID'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  criteria: {
    type: String,
    required: [true, 'Please add criteria for earning the badge']
  },
  moduleId: {
    type: String,
    required: [true, 'Please add the associated module ID']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', BadgeSchema);