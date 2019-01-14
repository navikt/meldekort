import * as React from 'react';
import './App.less';
import Banner from './components/banner/Banner';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
          <Banner tittel={"Meldekort" || ' '}/>
          
      </div>
    );
  }
}

export default App;
