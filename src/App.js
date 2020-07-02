import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Profilepage from './Components/Profilepage/Profilepage';
import './App.css';

axios.defaults.withCredentials = true;

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/profile/:username" component={Profilepage} />
      </Switch>
    </Router>
  );
}
