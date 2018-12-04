const { Itinerary } = require('./Transit.js');

Itinerary.create({
  name: 'Morning Commute',
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
  name: 'Evening Commute',
  waypoints: [
    {
      id: '16994',
      name: 'Metro Montgomery Station/Outbound',
      line: 'M',
      direction: 'Outbound',
    },
    {
      id: '15244',
      name: 'Laguna Honda Blvd & Dewey Blvd',
      line: '44',
      direction: 'Inbound',
    },
  ],
}, (err, docs) => {
  if (err) console.error(err);
  console.log('Itinerary created.');
});