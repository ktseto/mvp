import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itineraries: [],
      lastUpdatedTime: null,
      onHomePage: true,
    };

    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    // axios.get('/realtime')
    //   .then((res) => {
    //     this.setState({
    //       itineraries: res.data,
    //     });
    //   });
  }

  handleEdit() {
    this.setState({
      onHomePage: false,
    });
  }

  render() {
    return (
      <div>
      {
        this.state.onHomePage
        ?
        <div id="realTime">
          <div id="appHeader">Best Transit App Ever</div>
          <button id="editItin" onClick={this.handleEdit}>Edit Itineraries</button>
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
            </div>
          ))}
          <button>Return</button>
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