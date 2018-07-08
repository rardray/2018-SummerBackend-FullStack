import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    withRouter
  } from 'react-router-dom';
  import MenuItem from '@material-ui/core/MenuItem';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }
    handleChange = (e) => {
        const target = e.target
        const value = target.value
        const name = target.name
        this.setState({
            [name]: value
        })
    }
    submitLogin = (e) => {
        e.preventDefault()
        if(this.state.email === '' || this.state.password === '') {
            return
        }
        this.props.handleLogin(this.state)
        this.setState({email: '', password: ''})
    }
    handleSignUp = (e) => {
        e.preventDefault()
        this.props.history.push('/signup')
      }
    render() {
        const { error } = this.props.error
        return(
            <Router>
        <div style={{display: "inline-block", padding: 10, justifyContent: 'center'}}>
            <form onSubmit={this.submitLogin}>
                <input name="email" type="text" placeHolder= "Email Address" value={this.state.email} onChange={this.handleChange} /><br/>
                <input name="password" type="password" placeHolder = "Password" value={this.state.password} onChange={this.handleChange} /><br/>
                <input style = {{margin: 0, color: 'white', fontSize: 16, paddingTop: 15, paddingBottom: 20, paddingRight: 10, paddingLeft: 10, width: '100%', backgroundColor: 'steelblue'}} name="submit" value="Log in" type="submit" />
                </form>
                <MenuItem>
              <h5   style = {{paddingBottom: 6}} onClick = {this.handleSignUp} >Sign Up</h5>
              </MenuItem>
              
        </div>
        </Router>
        )
    }
}

export default withRouter(Login);