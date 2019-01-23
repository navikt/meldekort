import * as React from 'react';
import './App.less';
import Banner from './components/banner/banner';
import Demo from './components/demo/demo';
import NavTabs from './components/navtabs/navtabs';

const App = () => {
    return (
        <div className="App">
            <Banner tittel="Meldekort"/>
            <Demo />
            <NavTabs/>
            <hr/>
            <h3>Meldekortgreiene</h3>
            <br/>
            
        </div>
    );
};

export default (App);