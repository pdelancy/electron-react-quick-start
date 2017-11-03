import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';
import {CirclePicker} from 'react-color';
import Popover from 'material-ui/Popover';
import {Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw} from 'draft-js';
import {Map} from 'immutable';
import axios from 'axios';
import io from 'socket.io-client';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  right: {
    wrapper: <div className = "right-align"/>
  },
  center: {
    wrapper: <div className = "center-align"/>
  }

}));

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      // editorState: EditorState.createEmpty(),
      currentFontSize: 12,
      inlineStyles: {},
      socket: io('http://localhost:3000'),
      params: this.props.match.params
    };
    console.log(this);
    const self = this;

    this.state.socket.on('connect', function() {
      console.log(this);
      self.state.socket.emit('join room', self.state.params.id);
    });
    this.state.socket.on('message', (msg) => {
      console.log(msg);
    });

    this.state.socket.on('update', (contentState, selection)=>{
      console.log('receieved update request');
      const currentSelection = this.state.editorState.getSelection();
      this.setState({
        editorState: EditorState.forceSelection(EditorState.push(this.state.editorState, convertFromRaw(contentState)), selection)
      });
    });
  }

  componentDidMount(){
    console.log(this.props.match.params.id);
    axios.post('http://localhost:3000/addSharedDoc', {
      id: this.props.match.params.id
    })
    .then((response) => {
      this.onChange(EditorState.createWithContent(convertFromRaw(response.data)));
    });
  }

  componentWillUnmount(){
    console.log('in componentWillUnmount');
    this.state.socket.emit('leave room', this.state.params.id);
  }

  onChange(editorState){
    const selection = window.getSelection();
    console.log(selection.anchorNode, selection.anchorOffset, selection.focusNode);
    this.setState({
      editorState
    });
    this.state.socket.emit('update', convertToRaw(editorState.getCurrentContent()), editorState.getSelection());
  }


  toggleFormat(e, style, block){
    // this.refs.editor.focus();
    e.preventDefault();
    if(block){
      this.setState({
        editorState: RichUtils.toggleBlockType(this.state.editorState, style, block)
      });
    }else{
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      });
    }
  }

  formatButton({icon, style, block}) {
    return(
      <RaisedButton
        backgroundColor = {
          this.state.editorState.getCurrentInlineStyle().has(style) ?
          String(colors.gray200) :
          String(colors.gray800)
        }
        onMouseDown = {(e) => this.toggleFormat(e, style, block)}
        icon={<FontIcon className="material-icons"> {icon} </FontIcon>}
  />
    );
  }

  formatColor(color){
    console.log('inlinestyles', this.state.inlineStyles);
    var newInlineStyles = Object.assign({}, this.state.inlineStyles, {[color.hex]: {color: color.hex}});
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    });
  }

  applyIncreaseFontSize(shrink){
    console.log('increase font size', this.state.inlineStyles);
    var newFontSize = this.state.currentFontSize + (shrink ? -4 : 4);
    var newInlineStyles = Object.assign({}, this.state.inlineStyles, {[newFontSize]: {fontSize: `${newFontSize}px`}});
    var i = RichUtils.toggleInlineStyle(this.state.editorState, String(this.state.currentFontSize));
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(i, String(newFontSize)),
      currentFontSize: newFontSize
    });
  }

  increaseFontSize(shrink){
    return(
      <RaisedButton
        backgroundColor = {String(colors.gray200)}
        onMouseDown = {()=> this.applyIncreaseFontSize(shrink)}
        icon={<FontIcon className="material-icons"> {shrink ? 'zoom_out' : 'zoom_in'} </FontIcon>}
      />
    );
  }

  openColorPicker(e){
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker(){
    this.setState({
      colorPickerOpen: false
    });
  }

  colorPicker(){
    return(
      <div style = {{display: 'inline-block'}}>
      <RaisedButton
        backgroundColor = {String(colors.gray200)}
        icon={<FontIcon className="material-icons"> format_paint</FontIcon>}
        onClick = {this.openColorPicker.bind(this)}
      />
      <Popover
          open={this.state.colorPickerOpen}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeColorPicker.bind(this)}
        >
          <CirclePicker onChangeComplete = {this.formatColor.bind(this)} />
        </Popover>
      </div>
    );
  }

  updateDoc(id, editorState){
    // console.log('id in updateDoc', id);
    // console.log(typeof id);
    // console.log('editorState', editorState);
    axios.post('http://localhost:3000/updatedoc', {
      id,
      body: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    })
    .then(resp=>{
      alert('Document Saved!');
    })
    .catch(err=>console.log(err));
  }

  saveChanges(){
    return(
      <RaisedButton
        backgroundColor = {String(colors.gray200)}
        onMouseDown ={()=>(this.updateDoc(this.props.match.params.id, this.state.editorState))}
        icon={<FontIcon className="material-icons"> save </FontIcon>}
      />
    );
  }

  returnhome(){
    var returnHomePage = confirm("Are you sure you want to return to main page?");
    if (returnHomePage){
      this.props.history.push('/document');
    }else{
      return;
    }
  }

  render(){
    console.log(this.props.match.params.id);
    return (
    <div>
      <div>Document ID: {this.props.match.params.id}</div>
      <div className = "toolbar">
        {this.formatButton({icon: 'format_bold', style: 'BOLD'})}
        {this.formatButton({icon: 'format_italic', style: 'ITALIC'})}
        {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE'})}
        {this.colorPicker()}
        {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true})}
        {this.formatButton({icon: 'format_list_numbered', style: 'unordered-list-item', block: true})}
        {this.formatButton({icon: 'format_align_left', style: 'unstyled', block: true})}
        {this.formatButton({icon: 'format_align_center', style: 'center', block: true})}
        {this.formatButton({icon: 'format_align_right', style: 'right', block: true})}
        {this.increaseFontSize(false)}
        {this.increaseFontSize(true)}
      </div>
      <div className = "toolbar">
        {this.saveChanges()}
        <RaisedButton
          backgroundColor = {String(colors.gray800)}
          onMouseDown = {()=>this.returnhome()}
          icon={<FontIcon className="material-icons"> home </FontIcon>}/>
      </div>
      <div style={{borderTop: '2px solid lightGrey', margin: '20px', marginRight: '40px', marginLeft: '40px', padding: '10px'}}>
        <Editor
          ref = 'editor'
          blockRenderMap={myBlockTypes}
          customStyleMap = {this.state.inlineStyles}
          onChange = {this.onChange.bind(this)}
          editorState = {this.state.editorState}
        />
      </div>

    </div>
    );
  }
}

export default Main;
