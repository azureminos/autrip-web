import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import CONTANTS from '../../lib/constants';
import FacebookLogin from 'react-facebook-login/';

// Variables
const {Modal, Global} = CONTANTS.get();
const styles = {
  root: {
    height: 'fit-content',
  },
  paper: {
    width: 400,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: 16,
    flex: 1,
    color: 'white',
  },
  item: {
    display: 'block',
    margin: 8,
    padding: 8,
    width: '-webkit-fill-available',
  },
  itemChild: {
    width: 'inherit',
  },
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class AppDialog extends React.Component {
  constructor(props) {
    super(props);
    this.doHandleClose = this.doHandleClose.bind(this);
  }
  // Local Variables

  // Event Handlers
  doHandleClose() {
    if (this.props.actions && this.props.actions.close) {
      this.props.actions.close();
    }
  }

  // Sub Components
  // Display Widget
  render() {
    // Local Variables
    const {classes, open, model, reference} = this.props;
    let modelContent = '';
    let modelTitle = '';
    // Sub Components
    if (model === Modal.USER_LOGIN.key) {
      modelTitle = Modal.USER_LOGIN.title;
      modelContent = (
        <div>
          <div className={classes.item}>
            <FacebookLogin
              appId={Global.appId}
              autoLoad
              callback={(result) => {
                console.log('>>>>FacebookLogin.callback', result);
              }}
              render={(renderProps) => (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={renderProps.onClick}
                  className={classes.item}
                >
                  Login with facebook
                </Button>
              )}
              className={classes.item}
            />
          </div>
          <Divider />
          <TextField
            required
            id='username-input'
            label='Username'
            className={classes.item}
            margin='normal'
            variant='outlined'
            InputProps={{
              className: classes.itemChild,
            }}
          />
          <TextField
            id='password-input'
            label='Password'
            className={classes.item}
            type='password'
            margin='normal'
            variant='outlined'
            InputProps={{
              className: classes.itemChild,
            }}
          />
          <Button variant='contained' color='primary' className={classes.item}>
            Login
          </Button>
          <Button variant='contained' className={classes.item}>
            Forgot Password?
          </Button>
          <Divider />
          <Button variant='contained' className={classes.item}>
            Sign up
          </Button>
        </div>
      );
    }
    // Display widget
    return (
      <Dialog
        open={open}
        onClose={this.doHandleClose}
        TransitionComponent={Transition}
        classes={{root: classes.root, paper: classes.paper}}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={this.doHandleClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              {modelTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        {modelContent}
      </Dialog>
    );
  }
}

export default withStyles(styles)(AppDialog);
