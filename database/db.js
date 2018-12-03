const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost/transit';

module.exports = mongoose.connect(mongoUri);
