const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const Promise = require('bluebird');
const { ObjectId } = require('mongoose').Types;
const { API_TOKEN } = require('../database/config.js');
const { Itinerary, Line, Direction, Pattern } = require('../database/Transit.js');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '/../client/dist')));

app.get('/realtime', (req, res) => {
  Itinerary.find({}, (err, itinsRaw) => {
    if (err) console.error(err);

    const itins = JSON.parse(JSON.stringify(itinsRaw));
    const waypoints = itins.reduce((a, b) => a.concat(b.waypoints), []);
    const stopIds = [...(new Set(waypoints.map(w => w.id)))];

    Promise.all(stopIds.map(id => axios.get(`http://api.511.org/transit/StopMonitoring?format=json&api_key=${API_TOKEN}&agency=SF&stopCode=${id}`)))
      .then((allRes) => {
        const arrivals = [];
        let maxResponseTime = '';

        allRes.forEach((response) => {
          const parsedResponse = JSON.parse(response.data.slice(1));
          
          if (parsedResponse.ServiceDelivery.ResponseTimestamp > maxResponseTime) {
            maxResponseTime = parsedResponse.ServiceDelivery.ResponseTimestamp;
          }

          parsedResponse
            .ServiceDelivery
            .StopMonitoringDelivery
            .MonitoredStopVisit
            .forEach((obj) => {
              arrivals.push({
                RecordedAtTime: obj.RecordedAtTime,
                LineRef: obj.MonitoredVehicleJourney.LineRef,
                DirectionRef: obj.MonitoredVehicleJourney.DirectionRef,
                StopPointRef: obj.MonitoredVehicleJourney.MonitoredCall.StopPointRef,
                AimedArrivalTime: obj.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime,
              });
            });
        });

        arrivals.forEach((a) => {
          waypoints.forEach((wp) => {
            if (a.StopPointRef === wp.id && a.LineRef === wp.line && a.DirectionRef && wp.direction) {
              const mins = Math.floor((new Date(a.AimedArrivalTime) - new Date()) / 1000 / 60);

              if (wp.arrivalTimes) {
                wp.arrivalTimes.push(mins);
              } else {
                wp.arrivalTimes = [mins];
              }
            }
          });
        });

        res.send({ maxResponseTime, itins });
      });
  });
});

app.get('/test', (req, res) => {
  Itinerary.find({}, (err, itinsRaw) => {
    if (err) console.error(err);
    const itins = JSON.parse(JSON.stringify(itinsRaw));
    itins.forEach((it) => {
      it.waypoints.forEach((wp) => {
        wp.arrivalTimes = [];
      });
    });

    res.send({ maxResponseTime: '2018-01-01T00:00Z', itins });
  });
});

app.get('/lines', (req, res) => {
  Line.find({}, (err, linesRaw) => {
    if (err) console.error(err);
    const lineIds = linesRaw.map(l => l.Id).sort();
    res.send(lineIds);
  });
});

app.get('/directions', (req, res) => {
  Direction.find({}, (err, dirRaw) => {
    if (err) console.error(err);
    const directions = dirRaw.map(d => d.DirectionId).sort();
    res.send(directions);
  });
});

app.get('/stops/:line/:dirId', (req, res) => {
  Pattern.find({
    LineRef: req.params.line,
    DirectionRef: req.params.dirId,
  }, (err, pattRaw) => {
    if (err) console.error(err);

    pattRaw.sort((a, b) => a.StopPointInJourneyPattern.length - b.StopPointInJourneyPattern.length);
    res.send(pattRaw[0].StopPointInJourneyPattern.map(({
      ScheduledStopPointRef,
      Name,
    }) => ({
      ScheduledStopPointRef,
      Name,
    })));
  });
});

app.post('/waypoint/:itinId', (req, res) => {
  //.update() doesn't accept docs in the callback
  Itinerary.findOneAndUpdate({ _id: new ObjectId(req.params.itinId) }, {
    $push: { waypoints: req.body },
  }, (err, docs) => {
    if (err) console.error(err);
    console.log('Added new waypoint.');

    Itinerary.find({}, (err, itinsRaw) => {
      if (err) console.error(err);
      res.send(itinsRaw);
    });
  });
});

app.delete('/waypoint/:itinId/:stopId', (req, res) => {
  Itinerary.findOneAndUpdate({ _id: new ObjectId(req.params.itinId) }, {
    $pull: { waypoints: { id: req.params.stopId } },
  }, (err, docs) => {
    if (err) console.error(err);
    console.log('Waypoint deleted.');

    Itinerary.find({}, (err2, itinsRaw) => {
      if (err) console.error(err2);
      res.send(itinsRaw);
    });
  });
});

app.post('/itinerary', (req, res) => {
  Itinerary.create(req.body, (err, docs) => {
    if (err) console.error(err);
    console.log('Added new itinerary.');

    Itinerary.find({}, (err, itinsRaw) => {
      if (err) console.error(err);
      res.send(itinsRaw);
    });
  });
});

app.delete('/itinerary/:itinId', (req, res) => {
  Itinerary.deleteOne({ _id: new ObjectId(req.params.itinId) }, (err) => {
    if (err) console.error(err);

    Itinerary.find({}, (err2, itinsRaw) => {
      if (err) console.error(err2);
      res.send(itinsRaw);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
