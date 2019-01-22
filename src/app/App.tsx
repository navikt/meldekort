import * as React from 'react';

import Banner from './components/banner/banner';
import Demo from './components/demo/demo';
import './App.less';
import { Meldekort } from './types/meldekort';
import NavTabs from './components/navtabs/navtabs';
import SendMeldekort from './pages/sendMeldekort/sendMeldekort';
// import { ConnectedRouter } from 'connected-react-router';
// import { Route, Switch } from 'react-router-dom';

interface State {
    meldekort: Meldekort;
    id: string;
    arbeidet: boolean;
}

class App extends React.Component<{}, State> {

    /*public handleOptionChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            arbeidet: changeEvent.target.checked
        });
    }*/

  public render() {

      return (
      <div className="App">
          <Banner tittel="Meldekort"/>
          <Demo />
          <NavTabs/>
          <hr/>
          <h3>Meldekortgreiene</h3>
          <SendMeldekort/>

          <h4> Har du vært i arbeid de siste 14 dagene? </h4>

      </div>
    );
  }
}

export default (App);