import React from 'react';
import axios from 'axios';
import NewWaypoint from './newWaypoint.jsx';
import styles from '../../dist/styles/app.css';

const directionMap = {
  Inbound: 'IB',
  Outbound: 'OB',
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itineraries: [],
      lastUpdatedTime: null,
      onHomePage: true,
    };

    this.handleTogglePage = this.handleTogglePage.bind(this);
    this.handleDeleteItin = this.handleDeleteItin.bind(this);
    this.handleDeleteWaypoint = this.handleDeleteWaypoint.bind(this);
  }

  componentDidMount() {
    axios.get('/realtime')
    // axios.get('/test')
      .then((res) => {
        this.setState({
          itineraries: res.data,
        });
      });
  }

  handleTogglePage() {
    const { onHomePage } = this.state;

    this.setState({
      onHomePage: !onHomePage,
    });
  }

  handleDeleteItin(e) {
  }

  handleDeleteWaypoint(e) {
  }

  render() {
    return (
      <div>
      {
        this.state.onHomePage
        ?
        <div id="realTime">
          <div className={styles.appHeader}>Best Transit App Ever</div>
          <div className={styles.editButtonContainer}>
            <button onClick={this.handleTogglePage}>Edit Itineraries</button>
          </div>
          {this.state.itineraries.map(itin => (
            <div key={itin._id}>
              <div className={styles.itinHeader}>Itinerary:  {itin.name}</div>
              {itin.waypoints.map(wp => (
                <div className={styles.waypoint} key={wp.id}>
                  <div className={styles.line}>{wp.line}</div>
                  <div className={styles.direction}>{directionMap[wp.direction]}</div>
                  <div className={styles.stopName}>{wp.name}</div>
                  <div className={styles.estimates}>
                    {wp.arrivalTimes ? `${wp.arrivalTimes.join(', ')} mins` : ''}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div id="lastUpdate">Last update: {this.state.lastUpdatedTime}</div>
        </div>
        :
        <div id="editItin">
          <div className={styles.appHeader}>Edit Itineraries</div>
          {this.state.itineraries.map(itin => (
            <div key={itin._id}>
              <div className={styles.flexContainer}>
                <div className={styles.itinHeader}>Itinerary:  {itin.name}</div>
                <button className={styles.itinHeader} id={itin._id}>X</button>
              </div>
              {itin.waypoints.map(wp => (
                <div className={styles.waypoint} key={wp.id}>
                  <div className={styles.line}>{wp.line}</div>
                  <div className={styles.direction}>{directionMap[wp.direction]}</div>
                  <div className={styles.stopName}>{wp.name}</div>
                  <button id={`${itin._id}/${wp.id}`}>X</button>
                </div>
              ))}
              <NewWaypoint itinId={itin._id}/>
            </div>
          ))}
          <div>
            New Itinerary:  <input></input>
            <button id="addItin">Add</button>
          </div>
          <button id="return" onClick={this.handleTogglePage}>Return</button>
        </div>
      }
      </div>
    );
  }
}

export default App;

/*
    this.state = {
      itineraries: [{
        name: '',
        waypoints: [{
          id: '',
          name: '',
          direction: '',
          arrivalTimes: [],
        }],
      }],
    };
*/