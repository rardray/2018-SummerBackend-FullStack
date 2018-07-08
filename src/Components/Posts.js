import React, { Component } from 'react';
import EditButton from './EditButton';
import { onDelete, addComment, editPost, renderDate } from "./BlogActions";
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MainPostStyle from './MainPostStyle';
import Drawer from './Drawer';
import './stylesheets/posts.css';
import TextField from '@material-ui/core/TextField';
const styles = theme => ({
  title: {
   color: 'white',
   fontSize: 20
    },
    subheader: {
      color: 'ivory',
    },
  });
  

class Posts extends Component {
    constructor(props){
        super(props)
        this.state = {
            posts: [],
            date: '',
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
    handleComment = ( e )=> {
        const target = e.target
        const value = target.value
        const name = target.name
        this.setState(
            {
                [name]: value
            }
        )
    } 

    getPosts = () =>{
        fetch("/client/posts/list")
        .then(res =>  res.json())
        .then(posts => this.setState({ posts: posts }))
        .then(()=> this.setState({date: ''}))
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
        addComment(obj._id, newObj, this.getPosts())
    }   
    handleEdit = (i, id) => {
        this.props.passId(this.state.posts[i], id)
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
                return (
                    <Card style={{paddingLeft: 20, paddingRight: 20}}>
                      <CardContent style={{marginLeft: 60, backgroundColor: 'rgb(245, 250, 255', borderRadius: 40, margin: 10}} >
                        <Typography paragraph variant="body2">
                          {cel.name === undefined ? 'guest' : cel.name}
                        </Typography>
                     <Typography paragraph>
                        {cel.comment}
                     </Typography> 
                     <p style={{fontSize: 10, textAlign: 'right'}}>{cel.date}</p>
            {cel.name === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
                <Button onClick={this.handleEditComment.bind(this, i, cel._id)}>Edit</Button> : '' }
            {cel.name === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
                 <Button onClick={this.handleDeleteComment.bind(this, i, cel._id)}>
                    Delete 
                    </Button> : '' }
                </CardContent>
                 </Card>
                )
            })
            return (
                
                <div id={el._id} key={i}>
               <MainPostStyle>
                <CardHeader 
                classes = {{
                    title: classes.title,
                    subheader: classes.subheader
                }}
                    style={{backgroundColor: 'steelblue'}}
            avatar={
              <img src={el.author === undefined ? 'http://localhost:3001/public/defaultICO.jpg' : el.profileImage} style= {{width: 90, height: 90, borderRadius: '100%'}}    onClick={el.uid === undefined ? '' : this.handleProfile.bind(this, i, el.uid)}/>
            }
            title={el.title}
            subheader={el.author === undefined ? 'guest' : el.author}
          />
      
          <CardContent>
            <Typography component="p">
            {el.text}
            </Typography>
            <p style={{fontSize: 10, textAlign: 'right'}}>{el.date}</p>
            {el.author === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
                 <Button className='buttons' onClick={this.handleDelete.bind(this, i)}>Delete</Button> : '' }
           {el.author === this.props.userInfo.userName || this.props.userInfo.admin === true ?  
              <Button className = 'buttons' onClick={this.handleEdit.bind(this, i, el._id)}>Edit</Button> : '' }
          </CardContent>
       
                    {postComments}
                    </MainPostStyle>
                    <Drawer>
                <form onSubmit={this.submitComment.bind(this, i)}>
        
        <input name="comment" ref={node => this.input = node} placeholder="Comment..." style = {{ width: '100%', borderRadius: 8, borderWidth: 0, padding: 6, backgroundColor: 'rgb(250,250,255)'}}
                label = "Comment" margin= "normal" />
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