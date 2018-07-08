import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {renderDate} from './BlogActions'


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 20,
    justifyContent: 'center'
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

class SignUp extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            userName: '', 
            password: '', 
            firstName: '', 
            lastName: '', 
            email: '',
            admin: false,
            date: renderDate(),
            profileImage: 'http://localhost:3001/public/defaultICO.jpg'
        }
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
    submitSignup = (e) => {
        e.preventDefault()
        const signup = this.state
        console.log(signup)
        fetch("/users/userinfo/auth/" +  signup.email )
        .then(res => res.json())
        .then(userinfo => {
          if(userinfo === null) {
            
            fetch('/users/userinfo/signup', {
                method: 'POST',
                body: JSON.stringify(signup),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                  }
            })
          } else {
            console.log('email already in use')
          }
        })
        .then(()=> this.setState({userName: '', password: '', firstName: '', lastName: '', email: '', admin: false}))
        .then(() => this.props.history.push('/login'))
        .catch(err => err)
        
      }
       
    render() {
        const { classes } = this.props;
        return(
               <div style={{backgroundColor: 'lightgrey', padding: 20}} >
                <div className={classes.container} style={{backgroundColor: 'lightgrey', margin: 0}}>
                    <Paper style={{display: 'block', }}>
                    <h1 style={{justify: 'center', margin: 20, color: 'navyblue'}}>Create Account</h1>
                <div>
                <FormControl className={classes.container}>
                <InputLabel htmlFor="name-simple">User Name</InputLabel>
                    <Input name = 'userName'  
                    value={this.state.userName} onChange = {this.handleChange} />
                    </FormControl>
                    </div>
                    <FormControl className={classes.container}>
                <InputLabel htmlFor="name-simple">Password</InputLabel>
                    <Input type="password" name = 'password'  
                        value={this.state.password} onChange = {this.handleChange} />
                        </FormControl>
                        <FormControl className={classes.container}>
                <InputLabel htmlFor="name-simple">First Name</InputLabel>
                    < Input name = 'firstName'  
                       value={this.state.firstName} onChange = {this.handleChange} />
                       </FormControl>
                    <FormControl className={classes.container}>
                <InputLabel>Last Name</InputLabel>
                    <Input  type='text' name = 'lastName'  value={this.state.lastName} onChange = {this.handleChange} />
                    </FormControl>
                    <FormControl className={classes.container}>
                < InputLabel >Email Address</InputLabel>
                    < Input id="name-simple"name = 'email'  
                       value={this.state.email} onChange = {this.handleChange} />
                    </FormControl>
                    <Button style={{width: '100%', backgroundColor: 'steelblue', margin: 0, color: 'white'}} onClick = {this.submitSignup}>Sign Up</Button>
                    </Paper>
            </div>
            </div>
        )
    }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp);