import * as React from 'react';
import './App.less';
import Banner from './components/banner/Banner';

// import { ConnectedRouter } from 'connected-react-router';
// import { Route, Switch } from 'react-router-dom';

class App extends React.Component {
  public render() {

      // needs to return a reducer function
         /* <ConnectedRouter history={}>
          <Switch>

          </Switch>
  </ConnectedRouter>*/
    return (
      <div className="App">
          <Banner tittel="Meldekort"/>
      </div>
    );
  }
}

export default App;
