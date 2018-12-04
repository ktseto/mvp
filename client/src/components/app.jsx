import React from 'react';
import axios from 'axios';
import NewWaypoint from './newWaypoint.jsx';
import styles from '../../dist/styles/app.css';

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
    // axios.get('/realtime')
    axios.get('/test')
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
          <div id="appHeader">Best Transit App Ever</div>
          <button id="editItin" onClick={this.handleTogglePage}>Edit Itineraries</button>
          {this.state.itineraries.map(itin => (
            <div key={itin._id}>
              <div>Itinerary:  {itin.name}</div>
              {itin.waypoints.map(wp => (
                <div key={wp.id}>
                  <div>{wp.line}</div>
                  <div>{wp.direction}</div>
                  <div>{wp.name}</div>
                  <div>{`${wp.arrivalTimes.join(', ')} mins`}</div>
                </div>
              ))}
            </div>
          ))}
          <div id="lastUpdate">Last update: {this.state.lastUpdatedTime}</div>
        </div>
        :
        <div id="editItin">
          <div id="editHeader">Edit Itineraries</div>
          {this.state.itineraries.map(itin => (
            <div key={itin._id}>
              <div>Itinerary:  {itin.name}</div>
              <button id={itin._id}>X</button>
              {itin.waypoints.map(wp => (
                <div key={wp.id}>
                  <div>{wp.line}</div>
                  <div>{wp.direction}</div>
                  <div>{wp.name}</div>
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