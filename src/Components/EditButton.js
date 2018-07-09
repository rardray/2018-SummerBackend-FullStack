import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Posts from './Posts';
import { onDelete, addComment, editPost } from "./BlogActions";


class EditButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            posts: [],
            title: '',
            text: ''
            
        }
    }
    componentDidMount() {
        const id = this.props.match.params.id
        fetch("/client/posts/list", {
        })
        .then(res =>  res.json())
        .then(posts => posts.filter(el => el._id === id ))
        .then(posts => this.setState({ posts: posts, title: posts[0].title, text: posts[0].text }))
        .catch(err => err)
    }
    
    handleEdit = (e) => {
        e.preventDefault()
        const ti = this.state.title
        const te = this.state.text
        const p = this.state.posts[0]
        const obj = { ...p, title: ti, text: te}
        editPost(obj._id, obj)
        this.props.history.push('/posts')
        this.setState({open: false})
    }

    handleChange = (e) => {
        const target = e.target
        const value = target.value
        const name = target.name
        this.setState(
            {
                [name]: value
            }
        )
    }
    
      handleClose = () => {
        this.props.history.push('/posts')
      };
      render() {
          return (

<div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Post</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Make changes to your post
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              id="title"
              value={this.state.title}
              label="Title"
              onChange={this.handleChange.bind(this)}
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              name="text"
              id="text"
              value={this.state.text}
              label="Subject"
              onChange={this.handleChange}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleEdit.bind(this)} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
          )
}
}

export default EditButton;