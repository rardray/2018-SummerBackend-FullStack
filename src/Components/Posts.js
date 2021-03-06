import React, { Component } from 'react';
import { onDelete, addComment, editPost, renderDate, colorPicker } from "./BlogActions";
import Button from '@material-ui/core/Button';
import { withStyles, createStyleSheet } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MainPostStyle from './StyleComponents/MainPostStyle';
import Drawer from './StyleComponents/Drawer';
import './stylesheets/posts.css';
import TextField from '@material-ui/core/TextField';
import ConfirmDelDialog from './StyleComponents/ConfirmDelDialog'

const styles = theme => ({
  title: {
   color: 'white',
   fontSize: 16,
   margin: 0,
   padding: 0
    },
    subheader: {
      color: 'ivory',
      padding: 0,
    },
  });
  

class Posts extends Component {
    constructor(props){
        super(props)
        this.state = {
            posts: [],
        }
    }
    componentDidMount() {
     this.getPosts()
    }

    handleDelete = (i, e) => {
        e.preventDefault()
        onDelete(this.state.posts[i]._id) 
        let bPosts = this.state.posts.filter(post => {
            return this.state.posts[i]._id !== post._id
        })
        this.setState(prevState => {
                return prevState.posts = bPosts
        })
    }

    getPosts = () =>{
        fetch("/client/posts/list")
        .then(res =>  res.json())
        .then(posts => this.setState({ posts: posts }))
    }
    submitComment = (i, e) => {
        e.preventDefault()
        const name = this.props.userInfo.userName
        let { value } = this.input
        const date = renderDate()
        const obj = this.state.posts[i]
        const newObj = { 
            ... obj, comments:[...obj.comments, {name, comment: value, date}]
        }
        if(value === '') {
            return
        }
        fetch('/client/posts/comment/' + obj._id, {
            method: 'PUT',
            body: JSON.stringify(newObj),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
            .then(res => {
                if (res.ok) {
                    return res.json().then(this.getPosts()).then(this.input.value = '')
                }
            })
            .catch(err => err)
    }   
    handleEdit = (id) => {
        this.props.history.push('/edit/' + id)
    }
        
    handleEditComment = (i, id) => {
        this.props.passId(this.state.posts[i], id)
        this.props.history.push('/comments/edit/' + id)
    }
        
    handleDeleteComment = (i, id, e) => {
        e.preventDefault()
        const obj = this.state.posts[i]
        const comList = this.state.posts[i].comments
        const filteredComments = comList.filter(c => {
            return c._id !== id
        })
        const newObj = {...obj, comments: filteredComments}
        editPost(newObj._id, newObj)
        this.setState(prevState => {
            return prevState.posts[i] = newObj
        })
    }
    
    handleProfile = (i, id) => {
        this.props.passId(this.state.posts[i], id)
        this.props.history.push('/users/' + id)
    }
    
    render() {
        
        const classes = this.props.classes
        const postHtml = this.state.posts.map((el, i) => {
            const postComments = el.comments.map(cel => {
                const colors = colorPicker(cel.name.charAt(0))
                return (
                    <Card style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 0, paddingTop: 0}}>
                      <CardContent style={{marginLeft: 60, backgroundColor: 'rgb(245, 250, 255', borderRadius: 40, margin: 4, padding: 3}} >
                        <span style={{display: 'inline-block', 
                            backgroundColor: colors, 
                            height: 25, 
                            width: 25, 
                            borderRadius: '100%', 
                            fontSize: 20, color: 'white', 
                            verticalAlign: 'center', 
                            textAlign: 'center', 
                            marginRight: 6, 
                            paddingTop: 3,}}>
                            {cel.name.charAt(0)}</span>
                        <Typography 
                            style={{
                                display: 'inline-block', 
                                color: 'darkslateblue'}}
                            paragraph variant="body2">
                          {cel.name === undefined ? 'guest' : cel.name}
                        </Typography>
                     <span 
                        style = {{
                            fontSize: 12, 
                            marginLeft: 20, 
                            display: 'inline-block'}}>
                        {cel.comment}
                     </span> 
                     <div style={{float: 'right' }}>
            {cel.name === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
                <Button 
                    style = {{
                        padding: 0, 
                        fontSize: 10, 
                        color: 'lightblue'}}
                    onClick={this.handleEditComment.bind(this, i, cel._id)}>Edit</Button> : '' }
            {cel.name === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
                 <ConfirmDelDialog>
                 <Button 
                    style={{
                        padding: 0, 
                        fontSize: 14, 
                        color: 'red'}}
                        onClick={this.handleDeleteComment.bind(this, i, cel._id)}>
                    Delete 
                    </Button></ConfirmDelDialog> : '' }
                    </div>
                </CardContent>
                <p style={{
                    fontSize: 8, 
                    textAlign: 'right', 
                    margin: 4}}>
                {cel.date}
                </p>
                 </Card>
                 
                )
            })
            return (
                
                <div id={el._id} key={el._id}>
               <MainPostStyle>
                <CardHeader 
                classes = {{
                    title: classes.title,
                    subheader: classes.subheader
                     }}
                    style={{backgroundColor: 'steelblue', padding: 4}}
                avatar={
                 <img src={el.author === undefined ? 'http://localhost:3001/public/defaultICO.jpg' : el.profileImage} 
                    style= {{
                        width: 50, 
                        height: 50, 
                        borderRadius: '100%', 
                        objectFit: 'cover',
                        cursor: 'pointer'}} 
                    onClick={el.uid === undefined ? '' : this.handleProfile.bind(this, i, el.uid)}/>
            }
                title={el.title}
                subheader={el.author === undefined ? 'guest' : el.author}
          />
            <CardContent style={{paddingTop: 8, paddingBottom: 4}}>
            <Typography component="p">
            {el.text}
            </Typography>
            <p style={{
                fontSize: 10, 
                textAlign: 'right', 
                marginBottom: 0}}>
            {el.date}
            </p>
            {el.author === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
              <Button style = {{
                  padding: 0, 
                  fontSize: 10, 
                  color: 'lightblue'}} 
                onClick={this.handleEdit.bind(this, el._id)}>
                    Edit
                </Button> : '' }
            {el.author === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
                 <ConfirmDelDialog >
                 <Button 
                    className='buttons' 
                    style = {{
                        padding: 0, 
                        fontSize: 14, 
                        color: 'red'}} 
                    onClick={this.handleDelete.bind(this, i)}>
                    Delete
                </Button>
                </ConfirmDelDialog> : '' }
                
            </CardContent>
                {postComments}
        </MainPostStyle>
        <Drawer>
            <form onSubmit={this.submitComment.bind(this, i)}>
                <input 
                    name="comment" 
                    ref={node => this.input = node} 
                    placeholder="Comment..." 
                    style = {{ 
                        width: '100%', 
                        borderRadius: 8, 
                        borderWidth: 0, 
                        padding: 6, 
                        backgroundColor: 'rgb(250,250,255)'}}
                    label = "Comment" 
                    margin= "normal" />
            </form>
                </Drawer >
                </div>
            )
        })
        return (
            <div>
                {postHtml}
            </div>
        )
    }
}
export default withStyles(styles)(Posts);