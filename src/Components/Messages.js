import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    withRouter
  } from 'react-router-dom';

const ITEM_HEIGHT = 60;

class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nameHeader: [],
            lastMessage: [],
            anchorEl: null,
        }
    }
  //  static getDerivedStateFromProps(props, state) {
    //    if(props.dms.toFrom !== state.nameHeader)
  //      return {
  //          nameHeader: props.dms.toFrom
  //      }
  //  }
    componentDidMount() {
       fetch('/dms/find/' + this.props.userInfo.email)
        .then(res => res.json())
        .then(dms => this.setState({nameHeader: dms.dms.toFrom, lastMessage: dms.dms}))
        console.log(this.state)
    }
    componentDidUpdate() {
        console.log(this.state)
    }
    
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
      };
    
      handleClose = (email, e) => {
        this.setState({ anchorEl: null });
      };

      handleMessage = (email, e) => {
        const uEmail = this.props.userInfo.email
        this.setState({ anchorEl: null });
      this.props.history.push('/dms/' + email + '/' + uEmail )
    };
    render() {
        const { anchorEl } = this.state;
        const list = this.state.lastMessage
        const listReduction = list.filter(el => {
            return el.read === false
            
        })
        const reduction = listReduction.reduce((x, y) => x.findIndex(e=>e.toFrom ==y.toFrom)<0 ? [...x, y]: x, [])
       
        const postList = reduction.map(el => {
            return (
                <MenuItem style={{height: 100, paddingLeft: 6, padding: 0, margin: 0, }} onClick={this.handleMessage.bind(this, el.email)}>
                <div style = {{  padding: 0, margin: 0, display: 'block'}}>
                <h5 style = {{padding: 6, margin: 0, width: '100%'}}>{el.toFrom}</h5>
                <p style = {{margin: 0, padding: 6, fontSize: 10, display: 'inline-block', width: '100%'}}>{el.message}</p><br/>
                <p style = {{margin: 0, padding: 0, fontSize: 8, display: 'inline-block', textAlign: 'right', width: '100%'}}>Sent on {el.date}</p>
                </div>
                </MenuItem>
            )
        })
        return (
            <Router>
            <div>
            <IconButton
              aria-label="More"
              aria-owns={anchorEl ? 'long-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200,
                },
              }}
            >
              {postList}
            </Menu>
          </div>
          </Router>
        );
      }
    }

export default withRouter(Messages);