const axios = require('axios');
const { Line, Direction, Pattern } = require('./Transit.js');
const { API_TOKEN } = require('./config.js');

// Initial implementation is for select lines to stay under the Open511 API access limits
const selectLines = ['1', '2', '38', '43', '44', 'K', 'L', 'M', 'N'];

axios.get(`http://api.511.org/transit/lines?format=json&api_key=${API_TOKEN}&operator_id=SF`)
  .then((res) => {
    // first character is BOM
    const parsedSelected = JSON.parse(res.data.slice(1)).filter(x => selectLines.includes(x.Id));

    Line.insertMany(parsedSelected, (err, docs) => {
      if (err) console.error(err);
      console.log(`${docs.length} lines inserted.`);
    });
  });

Direction.insertMany([
  { DirectionId: 'IB', Name: 'Inbound' },
  { DirectionId: 'OB', Name: 'Outbound' },
], (err, docs) => {
  if (err) console.error(err);
  console.log(`${docs.length} directions inserted.`);
});

Line.distinct('Id', (err, lineIds) => {
  if (err) console.error(err);

  // lineIds.forEach((line) => {
  selectLines.forEach((line) => {
    axios.get(`http://api.511.org/transit/patterns?format=json&api_key=${API_TOKEN}&operator_id=SF&line_id=${line}`)
      .then((res) => {
        JSON.parse(res.data.slice(1)).journeyPatterns.forEach((pattern) => {
          const { serviceJourneyPatternRef, LineRef, DirectionRef, PointsInSequence } = pattern;

          const data = {
            serviceJourneyPatternRef,
            LineRef,
            DirectionRef,
            StopPointInJourneyPattern: PointsInSequence.StopPointInJourneyPattern,
          };

          Pattern.create(data, (err, docs) => {
            if (err) console.error(err);
            console.log('docs: ', docs);
            console.log(`Pattern inserted: ${serviceJourneyPatternRef}, ${LineRef}, ${DirectionRef}`);
          });
        });
      });
  });
});
