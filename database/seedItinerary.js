const { Itinerary } = require('./Transit.js');

Itinerary.create({
  name: 'Morning Commute',
  waypoints: [{
    id: '14852',
    name: 'Lawton St \u0026 7th Ave',
    line: '44',
    direction: 'Inbound',
  }],
}, (err, docs) => {
  if (err) console.error(err);
  console.log('Itinerary created.');
});
