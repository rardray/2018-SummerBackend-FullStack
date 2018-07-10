import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: [],
            recentPosts: [],
            profileImage: ''
        }
    }
componentDidMount() {
    fetch('/users/userinfo/' + this.props.match.params.uid, {})
    .then(res => res.json())
    .then(userinfo => this.setState({profile: userinfo}))
    fetch('/client/posts/recent/' + this.props.match.params.uid)
    .then(res => res.json())
    .then(userinfo => this.setState({recentPosts: userinfo}))
    .catch(err => err)
}
componentDidUpdate() {
    this.saveImage()
}
saveImage  = () => {
    fetch('/users/userinfo/addphoto/' + this.props.match.params.uid, {
        method: 'PUT',
        body: JSON.stringify(this.state.profile),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })

}
handleUpload = (e) => {
    if (this.uploadInput.files[0] === undefined) {
        return
    }
    e.preventDefault()
    const data = new FormData()
    data.append('file', this.uploadInput.files[0])
    data.append('filename', this.state.profile._id)

    fetch('/upload', {
        method: 'POST',
        body: data,
    })
    .then(res => res.json())
    .then(body => {
        this.setState(prevState => {
            return {
                profile: {...prevState.profile, profileImage: `http://localhost:3001${body.file}`}
            }
        })
    }
    )
}
    render() {
        const{ userName, firstName, lastName, email, date, profileImage } = this.state.profile
        const showPosts = this.state.recentPosts.map(el => {
            return (
                <div >
                <CardHeader
            avatar={
              <img src={profileImage} style={{width: 50, height: 50, borderRadius: '100%'}}/>
            }
            title={el.title}
            subheader={el.author === undefined ? 'guest' : el.author}
          />
      
          <CardContent>
          <Typography component="p">
            {el.text}
            </Typography>
            <p style={{fontSize: 10, textAlign: 'right'}}>{el.date}</p>
            </CardContent>
            </div>
            )
        })
        return (
            <div style={{display: 'block'}}>
                <div style={{display: 'inline-block', width: '20%', 
                    verticalAlign: 'top', padding: 10, 
                    backgroundColor: 'aliceblue', height: '100%'}}>
                    <div style={{height: 250, width: 250, borderRadius: '100%', overflow: 'hidden', margin: 10}}>
                <img src = {profileImage} alt = {userName} 
                    style={{height: '100%', width: '100%', display: 'inline-block'}} />
                    </div>
                {email === this.props.userInfo.email || this.props.userInfo.admin === true ? 
                <form onSubmit={this.handleUpload.bind(this)}>
                <label>Update Profile Picture </label>
                <input ref = {ref => {this.uploadInput = ref}} type='file' accept="image/png, image/jpg"/><br/>
                <button style={{color: 'white', backgroundColor: 'steelblue', padding: 10, width: '90%', fontSize: 16}}>upload</button>
                </form> : '' }
                <p>User Name: {userName}</p>
                <p>Name: {firstName} {lastName}</p>
                <p>Email: {email} </p>
                <p>Joined on {date} </p>
                </div>
                <div style={{display: 'inline-block', width: '75%', verticalAlign: 'top', padding: 15, backgroundColor: 'white'}}>
                <p>Recent Posts by {userName}:</p>
                {showPosts}
                </div>
                </div>
                
        )
    }
}
export default Profile;