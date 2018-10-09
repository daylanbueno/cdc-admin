import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Router,Route,browserHistory, IndexRoute} from 'react-router';
import { AutorBox } from './component/Autor';
import Home from './component/Home';

ReactDOM.render(
   (<Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/autor" component={AutorBox} />
            <Route path="/livro" />
       </Route> 
   </Router>),
    document.getElementById('root')
  );