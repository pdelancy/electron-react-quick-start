import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import Main from './Main';
// import MyEditor from './Main';
import {Editor, EditorState, Modifier, RichUtils} from 'draft-js';
import { formatAlignLeft, formatAlignRight } from 'material-ui-icons';
import FontIcon from 'material-ui/FontIcon';


require('../css/Draft.css');

// ReactDOM.render(
//   <MyEditor />,
//   document.getElementById('root')
// );
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
