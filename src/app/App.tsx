import * as React from 'react';
import * as asyncactions from './actions/async-actions';

import { connect } from 'react-redux';
import { DemoActions } from './types/demo';
import { MeldekortActions } from './types/meldekort';
import { Dispatch } from 'redux';
import { RootState } from './store/store';

import Banner from './components/banner/banner';
import './App.less';
import { Meldekort } from './types/meldekort';

// import { ConnectedRouter } from 'connected-react-router';
// import { Route, Switch } from 'react-router-dom';

type ReduxType =
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

interface State {
    inputText: string;
    meldekort: Meldekort;
    id:string;
    arbeidet:boolean;
}

class App extends React.Component<ReduxType, State> {
    public state: State = { inputText: '', meldekort:{id:'0', arbeidet:true}, id:'1', arbeidet:false};

    public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({inputText: e.target.value});
    }

    public onAddClick = () => {
        this.props.addItem(this.state.inputText);
        this.setState({inputText: ''});
    }

    public onAddClickMK = () => {
        this.props.leggTilMeldekort(this.state.meldekort);
        this.setState({this.props.meldekort.id: ''});
    }

    public handleOptionChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            arbeidet: changeEvent.target.checked
        });
    }

  public render() {

      const { list, loading} = this.props;

      return (
      <div className="App">
          <Banner tittel="Meldekort"/>
          <div style={{margin: '20px'}}>
              <input value={this.state.inputText} onChange={this.onInputChange}/>
              <button onClick={this.onAddClick}>Add</button>
              <ul>
                  {list.map(l => <li key={l}>{l}</li>)}
              </ul>
              {loading && <div>Loading...</div>}
          </div>
          <hr/>
          <h3>Meldekortgreiene</h3>

          <h4> Har du vært i arbeid de siste 14 dagene? </h4>
          <form>
              <div className="form-check">
                  <label>
                      <input
                          type="radio"
                          name="react-tips"
                          checked={this.state.arbeidet === true}
                          className="form-check-input"
                          onChange={this.handleOptionChange}

                      />
                      Ja
                  </label>
              </div>

              <div className="form-check">
                  <label>
                      <input
                          type="radio"
                          name="react-tips"
                          checked={this.state.arbeidet === false}
                          className="form-check-input"
                          onChange={this.handleOptionChange}
                      />
                      Nei
                  </label>
              </div>
          </form>
          <input value={this.state.id} onChange={this.onInputChangeID}/>
          <button onClick={this.onAddClickMK}>Legg til Meldekort</button>
      </div>
    );
  }
}
// mapper de variabelene du trenger til en komponent fra denne global staten
const mapStateToProps = ({demo}: RootState) => {
    const { list, loading } = demo;
    return { list, loading };
};

// mapper de redux-actions man skriver til en komponent som props
const mapDispatcherToProps = (dispatch: Dispatch<DemoActions>) => {
    return {
        addItem: (item: string) =>
            asyncactions.addItemAsync(dispatch, item)
        leggTilMeldekort: (mk: Meldekort) =>

    };
};

export default connect(mapStateToProps, mapDispatcherToProps)(App);