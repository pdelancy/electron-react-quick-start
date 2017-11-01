import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';
import {Editor, EditorState, Modifier, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';
import {Map} from 'immutable';

class SharedDoc extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A new document is added' + this.state.value);
    event.preventDefault();
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <label>Add shared document</label><br></br>
        <input type="text"
              name="shared_doc_ID"
              placeholder="Shared document ID"
              value={this.state.value}
              onChange={this.handleChange} />
        <div>
        <RaisedButton
          type="submit"
          value="Submit"
          label="Add shared document"
          backgroundColor = {String(colors.gray200)} />
          </div>
      </form>
    );
  }
}

class NewDoc extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A new document is added' + this.state.value);
    event.preventDefault();
  }

  render(){
    return(
    <form onSubmit={this.handleSubmit}>
      <label>Add new document</label><br></br>
      <input type="text"
            name="new_doc_name"
            placeholder="Enter new document name"
            value={this.state.value}
            onChange={this.handleChange} />
      <div>
      <RaisedButton
        type="submit"
        value="Submit"
        label="Create new document"
        backgroundColor = {String(colors.gray200)}/>
        </div>
    </form>
    );
  }
}


var newDocs = ['doc1', 'doc2', 'doc3'];

class MyDocuments extends React.Component {
  render(){
    return(
      <div className = 'container'>
        <h3> My Documents </h3>
        <ul>
        {newDocs.map((doc)=>{return(
          <li>{doc}</li>)
        })}
      </ul>
      </div>
    );
  }
}


class DocumentPortal extends React.Component {
  render() {
    return (
      <div>
      <AppBar title = "RE_EDIT Document Portal"/>
      <NewDoc />
      <MyDocuments />
      <SharedDoc />
      </div>
    );
  }
}
export default DocumentPortal;
