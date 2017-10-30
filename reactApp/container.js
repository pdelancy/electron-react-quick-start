var React = require('react');
var ReactDOM = require('react-dom');
import {Editor, EditorState, RichUtils} from 'draft-js';



const yellow = {
  color: 'Yellow'
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItaClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onUnderlineClick(){
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onColorClick(){
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, ))
  }




  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    return (
      <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1> My Editor </h1>
        <div >
        <button className = "btn-danger" onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button className = "btn-primary" onClick={this._onItaClick.bind(this)}>Italic</button>
        <button className = "btn-success" onClick={this._onUnderlineClick.bind(this)}>Underline</button>
        </div>
        <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
      />
      </div>
    );
  }
  }

export default Container;
