import React, { Component } from 'react';

class AdminUtils extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            adminStatus: null
        }
    }

    componentDidMount(){
        const { admin } = this.props.userInfo
        console.log(this.state.adminStatus)
        if(admin) {
            fetch('/users/userinfo/get/list')
            .then(res => res.json())
            .then(userinfo => this.setState({users: userinfo}))
            .catch(err => err)
    } }
    handleDeleteUser = (id, e) => {
        e.preventDefault()
        fetch('/users/userinfo/delete/' + id, {
            method: 'DELETE',
        })
        .then(res => res.json()
        .then(fetch('/users/userinfo/get/list')
        .then(res => res.json()
        .then(userinfo => this.setState({users: userinfo})
    ))))
        .catch(err => err)
    }
    render() {
        const {userName, admin } = this.props.userInfo
        const postUsers = this.state.users.map(el => {
            return (
                <div>
                    <p>{el.userName}</p>
                    <p>{el.password}</p>
                    <p>{el.firstName}</p>
                    <p>{el.lastName}</p>
                    <p>{el.email}</p>
                    <p>{el.date}</p>
                    <p>{el.admin}</p>
                    <button onClick = {this.handleDeleteUser.bind(this, el._id)}>Delete User</button>
                    </div>
            )
        })
        return (
            <div>
                {admin ? postUsers : ''}
                <p>{userName}</p>
                </div>
        )
    }
}

export default AdminUtils;