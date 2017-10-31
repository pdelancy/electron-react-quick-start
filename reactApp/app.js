import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
// import MyEditor from './Main';
import {Editor, EditorState, Modifier, RichUtils} from 'draft-js';


require('../css/Draft.css');

/* This can check if your electron app can communicate with your backend */
fetch('http://localhost:3000')
.then(resp => resp.text())
.then(text => console.log(text))
.catch(err => {throw err;});

ReactDOM.render(
  <MuiThemeProvider>
  <Main />
</MuiThemeProvider>,
   document.getElementById('root'));
