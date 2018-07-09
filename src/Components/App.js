import React, { Component } from 'react';
import './stylesheets/App.css';
import PostForm from './PostForm';
import Posts from './Posts';
import Home from './home';
import EditButton from './EditButton';
import SimpleMenu from './SimpleMenu'
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  withRouter
} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditComments from './EditComments';
import Login from './Login'
import LoginMenu from './LoginMenu';
import SignUp from './SignUp'
import Profile from './Profile'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      _id: '',
      expanded: false ,
      anchorEl: null,
      userInfo: [],
      error: false,
    }
  }
 componentDidMount () {
   const cachedLog =localStorage.getItem('_loggedIn')
   const parsedCache = JSON.parse(cachedLog)
   if(cachedLog) {
     fetch("/users/userinfo/session/" + parsedCache)
     .then(res => res.json())
     .then(userinfo => this.setState({userInfo: userinfo}))
     .catch(err => err)
   }
  }
  handleClose = () => {
    this.setState({ anchorEl: null });
  }
  handleSignOut = (e) => {
  e.preventDefault()
  this.setState({userInfo: []})
  localStorage.removeItem('_loggedIn')
  }
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  }
  handleLogin = (userdata) => {
    fetch("/users/userinfo/auth/" +  userdata.email )
    .then(res => res.json())
    .then(userinfo => {
      if(userinfo.email === userdata.email && userinfo.password === userdata.password) {
        this.setState({userInfo: userinfo})
        this.setState({error: false})
        this.setStorage('_loggedIn', userinfo._id)
        
      } else {
        return this.setState({error: true})
      }
    })
    .catch(err => err)
  }
  setStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
  passId = (post, id) => {
    this.setState(prevState => {
      return {posts: post}
    })
    this.setState({_id: id})
  }
  myProfile = (e) => {
    e.preventDefault()
    this.props.history.push('/users/' + this.state.userInfo._id)
  }
  render() {
    const { error } = this.state
    const { anchorEl } = this.state;
    const {_id} = this.state.userInfo
    const userLink = '/users/' + _id
    return (
      <Router>
          <div style={{backgroundColor: 'aliceblue'}}>
            <div className="nav" >
      
            <div style={{float: 'right', margin: 0, display: 'inline'}}>
           
            <SimpleMenu handleClose = {this.handleClose}>
            <MenuItem onClick={this.handleClose}>
              <NavLink className="nav-item" exact to="/">Home</NavLink>
            </MenuItem>
            <MenuItem onClick={this.handleClose}>
              <NavLink className="nav-item" exact to="/posts">Posts</NavLink>
            </MenuItem>
              <MenuItem onClick={this.handleClose}>
                <NavLink className="nav-item" exact to="/add">Add New Post</NavLink>
              </MenuItem>
              <MenuItem>
              <h4 onClick={this.handleSignOut}>Sign Out</h4>
              </MenuItem>
              </SimpleMenu>
              {this.state.userInfo.length === 0 ?  
              <LoginMenu>
            <div style={{height: 200, padding: 0, margin: 0}}>
            {this.state.error ? <p style={{fontSize: 10, color: 'red', textAlign: 'center', padding: 6}}>username or password incorrect</p> : ''}
              <Login error = {this.state.error} userInfo = {this.state.userInfo} handleLogin = {this.handleLogin}/> <br/>
              </div>
              
              </LoginMenu> : <NavLink className='nav-item' exact to={userLink} uid={this.state.userInfo._id} style={{display: 'inline-block', margin: 16, padding: 10, color: 'white'}}>{this.state.userInfo.userName}</NavLink> }
              </div>
              <h2 className="header">OKC Coders Backend Blog</h2>
            </div>
          <Route exact path="/" component={Home} /> 
          <Route exact path="/posts"  render = {(props) => <Posts  {...props} userInfo={this.state.userInfo} passId={this.passId}/>} /> 
              <Route exact path="/add" render= {(props) => <PostForm {...props} userInfo = {this.state.userInfo}/>} /> 
            <Route exact path="/edit/:id" render= {(props) => <EditButton {...props} posts = {this.state.posts}/>} />
            <Route exact path="/comments/edit/:id" render= {(props) => <EditComments {...props}   _id = {this.state._id} posts = {this.state.posts}/>} />
            <Route exact path="/login" render = {(props) => <Login  {...props} error = {this.state.error} userInfo = {this.state.userInfo} handleLogin = {this.handleLogin}/>} />
            <Route path="/signup" component={SignUp} />
            <Route exact path='/users/:uid' render= {(props) => <Profile {...this.props} {...props} userInfo = {this.state.userInfo} _id={this.state._id}/>} />
          </div>
      </Router>
    )
  }
}

export default withRouter(App);