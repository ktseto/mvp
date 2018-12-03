const express = require('express');
const path = require('path');
const { Itinerary, Line, Direction, Pattern } = require('../database/Transit.js');

const app = express();
const PORT = 8000;

app.use('/', express.static(path.join(__dirname, '/../client/dist')));

app.get('/realtime', (req, res) => {
  const itineraries = Itinerary.find();
  const waypoints = itineraries.reduce((a, b) => a.waypoints.concat(b.waypoints), []);
  const stopIds = new Set(waypoints.map(w => w.id));

  const data = [];
  stopIds.forEach(id => {
    axios.get(`http://api.511.org/transit/StopMonitoring?format=json&api_key=${config.API_TOKEN}&agency=SF&stopCode=${id}`)
      .then((res) => {
        JSON.parse(res.data.slice(1)).MonitoredStopVisit.forEach((obj) => {
          data.push({
            LineRef: obj.MonitoredVehicleJourney.LineRef,
            DirectionRef: obj.MonitoredVehicleJourney.DirectionRef,
            StopPointRef: obj.MonitoredVehicleJourney.MonitoredCall.StopPointRef,
            AimedArrivalTime: obj.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime,
          });
        });
      });
  });

});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
