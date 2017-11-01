import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
// import Login from './Login';
// import Register from './Register';
import DocumentPortal from './DocumentPortal';
import {Editor, EditorState, Modifier, RichUtils} from 'draft-js';
import {HashRouter} from 'react-router-dom';

require('../css/Draft.css');

/* This can check if your electron app can communicate with your backend */
fetch('http://localhost:3000')
.then(resp => resp.text())
.then(text => console.log(text))
.catch(err => {throw err;});

ReactDOM.render(
  <HashRouter>
  <MuiThemeProvider>
  <Main />
  </MuiThemeProvider>
</HashRouter>,
   document.getElementById('root'));
