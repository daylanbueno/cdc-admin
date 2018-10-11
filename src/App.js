import React, { Component } from 'react';
import './App.css';
import './css/pure-min.css';
import './css/side-menu.css';
import {Link} from 'react-router';



class App extends Component {

  render() { // comporamento que retorna o html a baixo.
    return (
    <div id="layout">
 
    <a href="#menu" id="menuLink" className="menu-link">
        <span></span>
    </a>

    <div id="menu">
        <div className="pure-menu">
           
            <a className="pure-menu-heading" href="#">CDC-ADMIN</a>

            <ul className="pure-menu-list">
                <li className="pure-menu-item">
                    <Link to="#" className="pure-menu-link">Home</Link>
                </li>

                <li className="pure-menu-item">
                    <Link to="/Autor" className="pure-menu-link">Autor</Link>
                </li>

                <li className="pure-menu-item menu-item-divided pure-menu-selected">
                    <Link to="/Livro" className="pure-menu-link">Livro</Link>
                </li>
               {/* somente para fazer um teste.
                <li className="pure-menu-item menu-item-divided pure-menu-selected">
                    <Link to="/Tabela" className="pure-menu-link">Tabela</Link>
                </li>
               */}
            </ul>
        </div>
    </div>

     <div id="main">
        {this.props.children}
    </div> 

 </div>

    );
  }
}

export default App;
