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
      lastUpdatedTime: new Date('2018-01-01T00:00Z'),
      onHomePage: true,
      newItinName: '',
    };

    this.handleEditPage = this.handleEditPage.bind(this);
    this.handleBackHome = this.handleBackHome.bind(this);
    this.handleAddItin = this.handleAddItin.bind(this);
    this.handleDeleteItin = this.handleDeleteItin.bind(this);
    this.handleDeleteWaypoint = this.handleDeleteWaypoint.bind(this);
    this.handleAddWaypoint = this.handleAddWaypoint.bind(this);
    this.handleItinNameChange = this.handleItinNameChange.bind(this);
  }

  refreshData() {
    axios.get('/realtime')
    // axios.get('/test')
      .then((res) => {
        this.setState({
          itineraries: res.data.itins,
          lastUpdatedTime: new Date(res.data.maxResponseTime),
        });
      });
  }

  componentDidMount() {
    this.refreshData();
  }

  handleEditPage() {
    this.setState({
      onHomePage: false,
    });
  }

  handleBackHome() {
    this.setState({
      onHomePage: true,
    }, () => {
      this.refreshData();
    });
  }

  handleAddWaypoint(newItin) {
    this.setState({
      itineraries: newItin,
    });
  }

  handleDeleteWaypoint(e) {
    const [itinId, stopId] = e.target.id.split('/');
    axios.delete(`/waypoint/${itinId}/${stopId}`)
      .then((res) => {
        this.setState({
          itineraries: res.data,
        });
      });
  }

  handleItinNameChange(e) {
    this.setState({
      newItinName: e.target.value,
    });
  }

  handleAddItin(e) {
    axios.post('/itinerary', {
      name: this.state.newItinName,
      waypoints: [],
    })
      .then((res) => {
        this.setState({
          itineraries: res.data,
          newItinName: '',
        });
      });
  }

  handleDeleteItin(e) {
    axios.delete(`/itinerary/${e.target.id}`)
      .then((res) => {
        this.setState({
          itineraries: res.data,
        });
      });
  }

  formatDateTime(dt) {
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    const hour = String(dt.getHours() % 12).padStart(2, '0');
    const minute = String(dt.getMinutes()).padStart(2, '0');
    const second = String(dt.getSeconds()).padStart(2, '0');
    const ampm = Math.floor(dt.getHours() / 12) ? 'PM' : 'AM';

    return `${month}/${day} ${hour}:${minute}:${second}${ampm}`;
  }

  render() {
    return (
      <div>
      {
        this.state.onHomePage
        ?
        <div id="realTime">
          <div className={styles.appHeader}>MyCommute</div>
          <div className={styles.appSubHeader}>An Ultra-Lightweight MUNI Prediction App with Highly Customizable Itineraries</div>
          <div className={styles.editButtonContainer}>
            <button onClick={this.handleEditPage}>Edit Itineraries</button>
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
          <div id="lastUpdate">Last updated: {this.formatDateTime(this.state.lastUpdatedTime)}</div>
        </div>
        :
        <div id="editItin">
          <div className={styles.appHeader}>Edit Itineraries</div>
          {this.state.itineraries.map(itin => (
            <div key={itin._id}>
              <div className={styles.flexContainer}>
                <div className={styles.itinHeader}>Itinerary:  {itin.name}</div>
                <button className={styles.itinHeader} id={itin._id} onClick={this.handleDeleteItin}>X</button>
              </div>
              {itin.waypoints.map(wp => (
                <div className={styles.waypoint} key={wp.id}>
                  <div className={styles.line}>{wp.line}</div>
                  <div className={styles.direction}>{directionMap[wp.direction]}</div>
                  <div className={styles.stopName}>{wp.name}</div>
                  <button id={`${itin._id}/${wp.id}`} onClick={this.handleDeleteWaypoint}>X</button>
                </div>
              ))}
              <NewWaypoint itinId={itin._id} handleAddWaypoint={this.handleAddWaypoint} />
            </div>
          ))}
          <div>
            New Itinerary:  <input onChange={this.handleItinNameChange}></input>
            <button id="addItin" onClick={this.handleAddItin}>Add</button>
          </div>
          <button id="return" onClick={this.handleBackHome}>Return</button>
        </div>
      }
      </div>
    );
  }
}

export default App;
