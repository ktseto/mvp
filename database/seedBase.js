const axios = require('axios');
const { Line, Direction, Pattern } = require('./Transit.js');
const config = require('./config.js');

// Line, Direction, Pattern };
const linesUri = `http://api.511.org/transit/lines?format=json&api_key=${config.API_TOKEN}&operator_id=SF`;

// request returns a body whose encoding could not be determined
// the first character is BOM
// axios.get(linesUri)
//   .then((res) => {
//     Line.insertMany(JSON.parse(res.data.slice(1)), (err, docs) => {
//       if (err) console.error(err);
//       console.log(`${docs.length} lines inserted.`);
//     });
//   });

Direction.insertMany([
  { DirectionId: 'IB', Name: 'Inbound' },
  { DirectionId: 'OB', Name: 'Outbound' },
], (err, docs) => {
  if (err) console.error(err);
  console.log(`${docs.length} directions inserted.`);
});

Line.distinct('Id', (err, lineIds) => {
  if (err) console.error(err);

  // limiting //////////////////////////////////////////////
  // lineIds.forEach((line) => {
  ['43', 'L'].forEach((line) => {
    axios.get(`http://api.511.org/transit/patterns?format=json&api_key=${config.API_TOKEN}&operator_id=SF&line_id=${line}`)
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


/*

var data = {
  serviceJourneyPatternRef: '12345',
  LineRef: '44',
  DirectionRef: 'OB',
  StopPointInJourneyPattern: [
    {"StopPointInJourneyPatternId":"10579524","Order":"1","ScheduledStopPointRef":"14852","Name":"Lawton St \u0026 7th Ave"},
    {"StopPointInJourneyPatternId":"10579734","Order":"2","ScheduledStopPointRef":"16933","Name":"Woodside Ave \u0026 Balceta Ave"},
  ],
};
Pattern.create(data, (err, docs) => {
  if (err) console.error(err);
  console.log('docs: ', docs);
  console.log(`Pattern inserted: ${data.serviceJourneyPatternRef}, ${data.LineRef}, ${data.DirectionRef}`);
});




*/




/*

const detectCharacterEncoding = require('detect-character-encoding');

request({
  uri: linesUri,
  encoding: null,
}, (err, res, body) => {
  console.log(detectCharacterEncoding(body));
  r = res;
  b = body;
});


request({
  uri: linesUri,
  encoding: 'windows-1252',
}, (err, res, body) => {
  b = body;
});

const axios = require('axios');
axioss.get(linesUri).then(x => {
  bb = x;
})


*/