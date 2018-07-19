import React, { Component } from 'react';

class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nameHeader: null,
            lastMessage: []
        }
    }
  //  static getDerivedStateFromProps(props, state) {
    //    if(props.dms.toFrom !== state.nameHeader)
  //      return {
  //          nameHeader: props.dms.toFrom
  //      }
  //  }
    componentDidMount() {
       fetch('/users/userinfo/session/' + this.props.userInfo._id)
        .then(res => res.json())
        .then(userinfo => this.setState({nameHeader: userinfo.dms.toFrom}))
    }
    render() {
        return (<div>hi</div>)
    }
}

export default Messages;