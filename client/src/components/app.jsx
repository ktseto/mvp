import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itineraries: [],
      lastUpdatedTime: null,
    };
  }

  componentDidMount() {
    axios.get('/realtime')
      .then((res) => {
        this.setState({
          itineraries: res.data,
        });
      });
  }

  // {this.state.itineraries.map(itin => (<div>'AAAAA'</div>))}

  render() {
    console.log(this.state.itineraries);
    return (
      <div>
        <div>Best Transit App Ever</div>
        <button>Edit Itineraries</button>
        {this.state.itineraries.map(itin => (
          <div key={itin['_id']}>
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
        <div>Last update: {this.state.lastUpdatedTime}</div>
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