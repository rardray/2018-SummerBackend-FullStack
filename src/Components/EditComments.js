import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Posts from './Posts';
import { onDelete, addComment, editPost , findValue} from "./BlogActions";


class EditComments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            posts: [],
            comment: ''
        }
    }
    componentDidMount() {
        const id = this.props._id
        const comments = this.props.posts.comments
        let filteredComments = comments.filter(com => {
          return id === com._id
        })
        fetch("/client/comments/edit/" + id, {
        })
        .then(res =>  res.json())
        .then(posts => this.setState({ posts: posts}))
        .then(this.setState({comment: filteredComments[0].comment}))
        .catch(err => err)
    }
    
    handleEdit = (e) => {
        e.preventDefault()
        const co = this.state.comment
        const obj = this.state.posts
        const ind = findValue(this.state.posts.comments, this.props._id)
        var cobj = obj.comments[ind]
        var newCobj = {...cobj, comment: co}
        var cArray = obj.comments
        Object.assign(cArray[ind], newCobj)
        const newObj = {...obj, comments: cArray}
       editPost(newObj._id, newObj)
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
              name="comment"
              id="title"
              value={this.state.comment}
              label="Title"
              onChange={this.handleChange.bind(this)}
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

export default EditComments;