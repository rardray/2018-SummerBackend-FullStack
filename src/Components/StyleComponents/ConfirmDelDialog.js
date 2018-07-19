import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ConfirmDelDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <Button style={{fontSize: 10, color: 'lightblue'}} onClick={this.handleClickOpen}>DELETE</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Post??"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
             Are you sure you wan't to delete your post? Once deleted, post may not be recovered.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          <span onClick = {this.handleClose} >{this.props.children}</span>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ConfirmDelDialog;