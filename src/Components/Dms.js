import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles, createStyleSheet } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { renderDate } from './BlogActions'

class Dms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userI: [],
            recieverI: [],
            dms: [],
            toFrom: '',
            email: null,
            name: null,
            message: '',
            profileImage: '',
            blurred: false

        }
    }

    componentDidMount() {
        this.timerID = setInterval(()=> this.checkUpdates(), 10000)
    //recipient
        const email = this.props.match.params.email
    //sender
        const email2 = this.props.match.params.email2
    //get recipient info
        fetch('/dms/find/' + email )
        .then(res => res.json())
        .then(dms => this.setState({recieverI: dms, toFrom: dms.userName}))
    //fetch user info
        .then(fetch('/dms/find/' + email2)
        .then(res => res.json()).then(dms => this.setState({userI: dms, dms: dms.dms, name: dms.userName, email: email})))
     //fetch reciever profile image
        .then(fetch('/users/userinfo/auth/' + email)
        .then(res => res.json())
        .then(userinfo => this.setState({profileImage: userinfo.profileImage})))
    }
    componentWillUnmount() {
        clearInterval(this.timerID)
    }
    checkUpdates = () => {
        const email2 = this.props.match.params.email2
        fetch('/dms/find/' + email2)
        .then(res => res.json())
        .then(dms => {
            if (dms.dms.length !== this.state.dms.length) {
                this.setState({userI: dms, dms: dms.dms})}
                this.markAsRead()
                console.log(dms.dms.length)
            }
        )
                console.log(this.state.dms.length)
    }
    handleChange = (e) => {
        this.setState({message: e.target.value}) 
    }
    handleSubmit = (e) => {
        e.preventDefault()
        clearInterval(this.timerID)
        const {email, name, message } = this.state
        //Logged in user data
        const fromObj = this.state.userI
        const fromDms = fromObj.dms
        const newDms = [...fromDms, 
            {toFrom: this.state.toFrom, 
                name: name, 
                email: email, 
                message: message, 
                date: renderDate(),
                read: true
            }]
        const fromMapped = {...fromObj, dms: newDms}
        // Recipient user data
        const toObj = this.state.recieverI
        const toDms = toObj.dms
        const newSendDms = [
            ...toDms, 
            {toFrom: fromObj.userName, 
                name: name, 
                email: this.props.match.params.email2, 
                message: message, 
                date: renderDate(),
                read: false
            }]
        const toMapped = {...toObj, dms: newSendDms}
        //save message to logged in user dms
        fetch('/dms/put/' + this.state.userI._id, {
            method: 'PUT',
            body: JSON.stringify(fromMapped),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
        .then(res => res.json())
        //save message to recipient dms
        .then(fetch('/dms/put/' + toObj._id, {
            method: 'PUT',
            body: JSON.stringify(toMapped),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(res => res.json().then(fetch('/dms/find/' + this.props.match.params.email2)// < ==get updated data and set state
        .then(res => res.json())
        .then(dms => this.setState({userI: dms, dms: dms.dms, message: '',})
        )
        ))
        .then(fetch('/dms/find/' + this.props.match.params.email) // <== fetch reciever updated info w ID's
        .then(res => res.json())
        .then(dms => this.setState({recieverI: dms}))) )
        .then(this.timerID = setInterval(()=> this.checkUpdates(), 10000))
    .catch(err => err)
    }
    //move to home if logged in info does not match email2 params
    redirect = () => {
        this.props.history.push('/')
    }

    handleBlur = (e) => {
        e.preventDefault()
        this.setState({blurred: true})
        this.markAsRead()
    }    

    markAsRead = () => {
        const Dms = this.state.dms
        for (var i = 0; i < Dms.length; i++) {
            if (Dms[i].email === this.props.match.params.email && Dms[i].read === false) {
         Dms[i].read = true
        }
        this.setState({dms: Dms})
        }
    }
  
    render() {
        const postDms = this.state.dms.filter(el => {
            return el.email === this.props.match.params.email
        })
        const {userName, email } = this.state.recieverI
        const { profileImage, } = this.state
        const postDm = postDms.map(el => {
            return (
            <div style = {{paddingLeft: 10, paddingRight: 10, display: 'block', marginTop: 0, marginBottom: 0}}>
                <CardContent style = {{borderRadius: 20, padding: 6, backgroundColor: 'rgb(250,250,250)', margin: 6}}>
                    <h5 style={{margin: 0, display: 'inline-block', width: 80}}>{el.name}:</h5>
                      <p style = {el.read ? {fontSize: 13, display: 'inline-block', } : {fontSize: 12, display: 'inline-block', fontWeight: 'bold'}} >{el.message}</p>
                      <p style = {el.read  ? { fontSize: 8, display: 'inline-block', float: 'right', color: 'grey'} :{ fontSize: 8, display: 'inline-block', float: 'right', color: 'grey', fontWeight: 'bold'} }>{el.date}</p>
                </CardContent>
            </div>
        )
    })
        return (
             <div style = {{display: 'block', justifyContent: 'center', margin: 'auto'}}>
        {this.props.userInfo.email === this.props.match.params.email2 ?   
          <div style={{
              display: 'block',
              justifyContent: 'center',
          }}> 
              <Card 
                style={{justifyContent: 'center', maxWidth: '40%', margin: 'auto' }}>
                  <CardHeader style = {{backgroundColor: 'rgb(245,245,250)'}}
                    title = {userName}
                    subheader = {email}
                    avatar = {<img src = {profileImage}   
                    style={{
                        height: 50, 
                        width: 50, 
                        objectFit: 'cover', 
                        float: 'right', 
                        display: 'inline-block' ,
                        borderRadius: '100%'
                    }}/>}/>
                        {postDm}
                  <div style = {{
                      display: 'block',
                      justifyContent: 'center',
                      margin: 'auto',
                      padding: 10,
                      backgroundColor: 'steelblue'}}>
                <form onSubmit= {this.handleSubmit.bind(this) }>
                    <input style = {{
                        width: '80%', 
                        display: 'block', 
                        margin: 'auto', 
                        padding: 6, 
                        border: 'hidden', 
                        backgroundColor: 'rgb(230,235,250)',
                        borderRadius: 6}} 
                        placeholder = ' your message ' 
                        name='message' 
                        type='text' 
                        value={this.state.message} 
                        onChange={this.handleChange.bind(this)}
                        onFocus = {this.handleBlur.bind(this)}/>
                    </form>
                    </div>
                    </Card>
                    </div> : this.redirect() }
            </div>
        )
    }
}

export default Dms;