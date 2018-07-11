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
import TextField from '@material-ui/core/TextField';
import { renderDate, rawDate } from './BlogActions';

const styles = theme => ({
    container: {
      maxwidth: '80%',
      margin: 80,
      justifyContent: 'center',
      dislay: 'block'
    },
    formControl: {
      width: '90%',
        margin: 20,
        justifyContent: 'center'
    },
  });


class PostForm extends Component {
    constructor(props) {
        super(props)
        this.defaultState = {
            title: '',
            author: null,
            text: '',
            date: renderDate(),
            uid: null,
            profileImage: null,
            rawDate: rawDate(),
            comments: []
        }
        this.state = this.defaultState
    }

    static getDerivedStateFromProps(props, state) {
        if(props.userInfo.userName !== state.author || props.userInfo.profileImage !== state.profileImage){
            return {
                author: props.userInfo.userName,
                uid: props.userInfo._id,
                profileImage: props.userInfo.profileImage
            }
        }
        return null
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

    handleSubmit = (e) => {
        e.preventDefault()
        fetch("/client/posts/add", {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            })
            .then(() => {
            this.setState(this.defaultState)
            this.props.history.push('/posts')
        })
            .catch(err => err)
    }
    render() {
        const { classes } = this.props;
        const name = this.props.userInfo.userName
        const { title, text } = this.state
    
        return (
            <div className={classes.container} >
                <Paper  style={{display: 'block', justifyContent: 'center', padding: 20, margin: 0}}>
               
                <Typography variant='headline'> {name === undefined ? 'guest': name} </Typography>
                
                <FormControl className={classes.formControl}>
               <InputLabel htmlFor="name-simple">Title</InputLabel>
                    <Input fullwidth = 'true' 
                        name="title" 
                        type="text" 
                        value={this.state.title} 
                        onChange={this.handleChange.bind(this)} />
                    </FormControl><br/>
                    <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="name-simple">Body</InputLabel>
                    <Input multiline = 'true' 
                        rows = '2' 
                        fullwidth = 'true'
                         name="text" 
                         value={this.state.text} 
                         onChange={this.handleChange.bind(this)} />
                    </FormControl><br/>
                    <Button name="submit" 
                        disabled={title === '' || text === ''} 
                        style={title ==='' || text === '' ? {width: '100%', backgroundColor: 'lightgrey', color: 'white'} : 
                        {width: '100%', backgroundColor: 'steelblue', color: 'white'}}
                        onClick={this.handleSubmit.bind(this)} >Submit Post
                    </Button>
                </Paper>
            </div>
        )
    }
}
PostForm.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(PostForm);
