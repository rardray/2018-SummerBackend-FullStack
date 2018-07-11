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
import {renderDate, validate} from './BlogActions'


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
            confirmPassword: '', 
            firstName: '', 
            lastName: '', 
            email: '',
            admin: false,
            date: renderDate(),
            profileImage: 'http://localhost:3001/public/defaultICO.jpg',
            erMessage: false
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
        if(!this.canSubmit) {
            return
        }
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
            .then(()=> this.setState({userName: '', password: '', 
                confirmPassword: '', 
                firstName: '', 
                lastName: '', 
                email: '', 
                admin: false, 
                erMessage: false}))
            .then(() => this.props.history.push('/login'))
          } else {
            console.log('email already in use')
            this.setState({erMessage: true})
          }
        })
        .catch(err => err)
         }
    
     canSubmit() {
        const error = validate(this.state)
        const isDisabled = Object.keys(error).some(x => error[x])
        return !isDisabled
    }
       
    render() {
        const { classes } = this.props;
        const error = validate(this.state)
        const isDisabled = Object.keys(error).some(x => error[x]) 
            || this.state.userName === '' 
            || this.state.password === '' 
            || this.state.confirmPassword === '' 
            || this.state.firstName === '' 
            || this.state.lastName === '' 
            || this.state.email === ''

        const shouldMarkError = (field) => {
            const hasError = error[field];
            
            return hasError
          };
        const { erMessage } = this.state
    
        return(
               <div style={{backgroundColor: 'lightgrey', padding: 20}} >
                <div className={classes.container} style={{backgroundColor: 'lightgrey', margin: 0}}>
                    <Paper style={{display: 'block', }}>
                    {erMessage ? <p style={{color: 'red', textAlign: 'center'}}>! Email Already in Use !</p> : ''}
                    <h1 style={{justify: 'center', margin: 20, color: 'navyblue'}}>Create Account</h1>
                <div>
                <FormControl error={shouldMarkError('userName')} className={classes.container}>
                <InputLabel htmlFor="name-simple">{shouldMarkError('userName') ? 'User Name : min 3 characters' : 'User Name'}</InputLabel>
                    <Input name = 'userName'  
                    value={this.state.userName} onChange = {this.handleChange} />
                    </FormControl>
                    </div>
                    <FormControl error={shouldMarkError('password')}className={classes.container}>
                <InputLabel htmlFor="name-simple">{shouldMarkError('password') ? 'Must Contain one uppercase and one number' : 'Password'}</InputLabel>
                    <Input type="password" name = 'password'  
                        value={this.state.password} onChange = {this.handleChange} />
                        </FormControl>
                        <div>
                        <FormControl error={shouldMarkError('confirmPassword')} className={classes.container}>
                <InputLabel htmlFor="name-simple"> Confirm Password</InputLabel>
                    <Input type="password" name = 'confirmPassword'  
                        value={this.state.confirmPassword} onChange = {this.handleChange} />
                        </FormControl>
                        </div>
                        <FormControl error={shouldMarkError('firstName')}className={classes.container}>
                <InputLabel htmlFor="name-simple">{shouldMarkError('firstName') ? 'Must capitalize first letter' : 'First Name'}</InputLabel>
                    < Input name = 'firstName'  
                       value={this.state.firstName} onChange = {this.handleChange} />
                       </FormControl>
                    <FormControl error={shouldMarkError('lastName')} className={classes.container}>
                <InputLabel>{shouldMarkError('lastName') ? 'Must capitalize first letter' : 'Last Name'}</InputLabel>
                    <Input  type='text' name = 'lastName'  value={this.state.lastName} onChange = {this.handleChange} />
                    </FormControl>
                    <FormControl error={shouldMarkError('email')}className={classes.container}>
                < InputLabel >E{shouldMarkError('email') ? 'Must be valid email address' : 'Email Address'}</InputLabel>
                    < Input id="name-simple"name = 'email'  
                       value={this.state.email} onChange = {this.handleChange} />
                    </FormControl>
                    <Button style={isDisabled ? {width: '100%', backgroundColor: 'lightgrey', margin: 0, color: 'white'} : {width: '100%', backgroundColor: 'steelblue', margin: 0, color: 'white'}} disabled={isDisabled} onClick = {this.submitSignup}>Sign Up</Button>
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