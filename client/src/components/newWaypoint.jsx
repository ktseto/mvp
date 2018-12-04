import React from 'react';
import axios from 'axios';

class NewWaypoint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allLines: [],
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
      });
  }

  handleLines() {

  }

  handleDirections() {
    
  }

  handleStops() {
    
  }

  handleAdd() {
    
  }

  render() {
    return (
      <div>
        <select>
          <option></option>
          {this.state.allLines.map(line => <option value={line} key={line}>{line}</option>)}
        </select>
        <select>
          <option></option>
          {this.state.allLines.map(line => <option value={line} key={line}>{line}</option>)}
        </select>
        <select>
          <option></option>
          {this.state.allLines.map(line => <option value={line} key={line}>{line}</option>)}
        </select>
      </div>
    );
  }
}

export default NewWaypoint;
