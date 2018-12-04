const express = require('express');
const axios = require('axios');
const path = require('path');
const Promise = require('bluebird');
const { API_TOKEN } = require('../database/config.js');
const { Itinerary, Line, Direction, Pattern } = require('../database/Transit.js');

const app = express();
const PORT = 8000;

app.use('/', express.static(path.join(__dirname, '/../client/dist')));

app.get('/realtime', (req, res) => {
  Itinerary.find({}, (err, itinsRaw) => {
    const itins = JSON.parse(JSON.stringify(itinsRaw));
    const waypoints = itins.reduce((a, b) => a.concat(b.waypoints), []);
    const stopIds = [...(new Set(waypoints.map(w => w.id)))];

    Promise.all(stopIds.map(id => axios.get(`http://api.511.org/transit/StopMonitoring?format=json&api_key=${API_TOKEN}&agency=SF&stopCode=${id}`)))
      .then((allRes) => {
        const arrivals = [];

        allRes.forEach((response) => {
          JSON.parse(response.data.slice(1))
            .ServiceDelivery
            .StopMonitoringDelivery
            .MonitoredStopVisit
            .forEach((obj) => {
              arrivals.push({
                LineRef: obj.MonitoredVehicleJourney.LineRef,
                DirectionRef: obj.MonitoredVehicleJourney.DirectionRef,
                StopPointRef: obj.MonitoredVehicleJourney.MonitoredCall.StopPointRef,
                AimedArrivalTime: obj.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime,
              });
            });
        });

        arrivals.forEach((a) => {
          waypoints.forEach((w) => {
            if (a.StopPointRef === w.id && a.LineRef === w.line && a.DirectionRef && w.direction) {
              const mins = Math.floor((new Date(a.AimedArrivalTime) - new Date()) / 1000 / 60);

              if (w.arrivalTimes) {
                w.arrivalTimes.push(mins);
              } else {
                w.arrivalTimes = [mins];
              }
            }
          });
        });

        res.send(itins);
      });
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});





    // stopIds.forEach((id) => {
    //   axios.get(`http://api.511.org/transit/StopMonitoring?format=json&api_key=${API_TOKEN}&agency=SF&stopCode=${id}`)
    //     .then((response) => {
    //       const arrivals = [];

    //       JSON.parse(response.data.slice(1))
    //         .ServiceDelivery
    //         .StopMonitoringDelivery
    //         .MonitoredStopVisit
    //         .forEach((obj) => {
    //           arrivals.push({
    //             LineRef: obj.MonitoredVehicleJourney.LineRef,
    //             DirectionRef: obj.MonitoredVehicleJourney.DirectionRef,
    //             StopPointRef: obj.MonitoredVehicleJourney.MonitoredCall.StopPointRef,
    //             AimedArrivalTime: obj.MonitoredVehicleJourney.MonitoredCall.AimedArrivalTime,
    //           });
    //         });

    //       console.log(arrivals);

    //       // arrivals.forEach((a) => {
    //       //   waypoints.forEach((w) => {
    //       //     console.log(a.StopPointRef);
    //       //     console.log(w.id);
    //       //     console.log(a.LineRef);
    //       //     console.log(w.line);
    //       //     console.log(a.DirectionRef);
    //       //     console.log(w.direction);
    //       //     console.log('#######################');
    //       //     if (a.StopPointRef === w.id && a.LineRef === w.line && a.DirectionRef && w.direction) {
    //       //       const mins = Math.floor((new Date(a.AimedArrivalTime) - new Date()) / 1000 / 60);

    //       //       console.log(w.arrivalTimes);
    //       //       if (w.arrivalTimes) {
    //       //         console.log('AAAA');
    //       //         w.arrivalTimes.push(mins);
    //       //         console.log(w);
    //       //       } else {
    //       //         console.log('BBBB');
    //       //         w.arrivalTimes = [mins];
    //       //         console.log(w);
    //       //       }
                
    //       //       console.log(mins);
    //       //       console.log(w);
    //       //     }
    //       //   });
    //       // });

    //       for (let a of arrivals) {
    //         for (let w of waypoints) {
    //           console.log(a.StopPointRef);
    //           console.log(w.id);
    //           console.log(a.LineRef);
    //           console.log(w.line);
    //           console.log(a.DirectionRef);
    //           console.log(w.direction);
    //           console.log('#######################');
    //           if (a.StopPointRef === w.id && a.LineRef === w.line && a.DirectionRef && w.direction) {
    //             const mins = Math.floor((new Date(a.AimedArrivalTime) - new Date()) / 1000 / 60);

    //             console.log(w.arrivalTimes);
    //             if (w.arrivalTimes) {
    //               console.log('AAAA');
    //               w.arrivalTimes.push(mins);
    //               console.log(w);
    //             } else {
    //               console.log('BBBB');
    //               w.arrivalTimes = [mins];
    //               console.log(w);
    //             }
                
    //             console.log(mins);
    //             console.log(w);
    //           }
    //         };
    //       };
    //     });
    // });

    // // res.send(itins[0].waypoints[0].arrivalTimes);
    // res.send(itins);