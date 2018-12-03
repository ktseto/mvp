require('./db.js');
const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  name: String,
  waypoints: [{
    id: String,
    name: String,
    line: String,
    direction: String,
  }],
});

const lineSchema = new mongoose.Schema({
  Id: String,
  Name: String,
  TransportMode: String,
});

const directionSchema = new mongoose.Schema({
  DirectionId: String,
  Name: String,
});

const patternSchema = new mongoose.Schema({
  serviceJourneyPatternRef: String,
  LineRef: String,
  DirectionRef: String,
  StopPointInJourneyPattern: [{
    StopPointInJourneyPatternId: String,
    Order: String,
    ScheduledStopPointRef: String,
    Name: String,
  }],
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
const Line = mongoose.model('Line', lineSchema);
const Direction = mongoose.model('Direction', directionSchema);
const Pattern = mongoose.model('Pattern', patternSchema);

module.exports = { Itinerary, Line, Direction, Pattern };
