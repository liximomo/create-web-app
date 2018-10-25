import React, { Component } from 'react';
import Foo from './b';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="s" className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

new App({}, {});
new Foo();

export default App;
