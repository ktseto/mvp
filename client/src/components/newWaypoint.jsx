import React from 'react';
import axios from 'axios';
import styles from '../../dist/styles/newWaypoint.css';

const directionMap = {
  'IB': 'Inbound',
  'OB': 'Outbound',
};

class NewWaypoint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allLines: [],
      allDirections: [],
      availableStops: [],

      selectedLine: '',
      selectedDirection: '',
      selectedStop: '',
    };
    
    this.handleLines = this.handleLines.bind(this);
    this.handleDirections = this.handleDirections.bind(this);
    this.handleStops = this.handleStops.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    axios.get('/lines')
      .then((res) => {
        this.setState({
          allLines: res.data,
        });

        return axios.get('/directions');
      })
      .then((res) => {
        this.setState({
          allDirections: res.data,
        });
      });
  }

  handleLines(e) {
    this.setState({
      selectedLine: e.target.value,
    }, () => {
      const { selectedLine, selectedDirection } = this.state;

      if (selectedLine && selectedDirection) {
        axios.get(`/stops/${selectedLine}/${selectedDirection}`)
          .then((res) => {
            this.setState({
              availableStops: res.data,
            });
          });
      } else {
        this.setState({
          availableStops: [],
        });
      };
    });
  }

  handleDirections(e) {
    this.setState({
      selectedDirection: e.target.value,
    }, () => {
      const { selectedLine, selectedDirection } = this.state;

      if (selectedLine && selectedDirection) {
        axios.get(`/stops/${selectedLine}/${selectedDirection}`)
          .then((res) => {
            this.setState({
              availableStops: res.data,
            });
          });
      } else {
        this.setState({
          availableStops: [],
        });
      }
    });
  }

  handleStops(e) {
    const index = e.target.options.selectedIndex;

    this.setState({
      selectedStop: {
        ScheduledStopPointRef: e.target.options[index].getAttribute('sspr'),
        Name: e.target.options[index].getAttribute('name'),
      },
    });
  }

  handleAdd() {
    const { selectedLine, selectedDirection, selectedStop } = this.state;

    if (selectedLine && selectedDirection && selectedStop) {
      axios.post(`/waypoint/${this.props.itinId}`, {
        id: selectedStop.ScheduledStopPointRef,
        name: selectedStop.Name,
        line: selectedLine,
        direction: directionMap[selectedDirection],
      })
      .then((res) => {
        this.setState({
          selectedLine: '',
          selectedDirection: '',
          selectedStop: '',
        });
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <select className={styles.line} onChange={this.handleLines} value={this.state.selectedLine}>
          <option></option>
          {this.state.allLines.map(line => <option value={line} key={line}>{line}</option>)}
        </select>
        <select className={styles.direction} onChange={this.handleDirections}>
          <option></option>
          {this.state.allDirections.map(dir => <option value={dir} key={dir}>{dir}</option>)}
        </select>
        <select className={styles.stopName} onChange={this.handleStops}>
          <option></option>
          {this.state.availableStops.map(stop =>
            <option
              sspr={stop.ScheduledStopPointRef}
              name={stop.Name}
              key={stop.ScheduledStopPointRef}
          >{stop.Name}</option>)}
        </select>
        <button onClick={this.handleAdd}>Add</button>
      </div>
    );
  }
}

export default NewWaypoint;
