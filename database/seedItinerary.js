const { Itinerary } = require('./Transit.js');

Itinerary.create({
  name: 'Morning Commute - Regular',
  waypoints: [
    {
      id: '14853',
      name: 'Lawton St & 7th Ave',
      line: '44',
      direction: 'Outbound',
    },
    {
      id: '15730',
      name: 'Metro Forest Hill Station/Downtown',
      line: 'L',
      direction: 'Inbound',
    },
  ],
}, (err, docs) => {
  if (err) console.error(err);
  console.log('Itinerary created.');
});

Itinerary.create({
  name: 'Morning Commute - Problems in Twin Peaks Tunnel',
  waypoints: [
    {
      id: '15122',
      name: 'Irving St & 7th Ave',
      line: 'N',
      direction: 'Inbound',
    },
  ],
}, (err, docs) => {
  if (err) console.error(err);
  console.log('Itinerary created.');
});