import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import CONSTANTS from '../../lib/constants';
import FacebookLogin from 'react-facebook-login/';
import {PayPalButton} from 'react-paypal-button';

// Variables
const {Global, Payment, Instance} = CONSTANTS.get();
const ModalConst = CONSTANTS.get().Modal;
const InstStatus = Instance.status;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const styles = (theme) => ({
  smallPaper: {
    height: 'auto',
    minHeight: 400,
  },
  fullPaper: {
    height: '100%',
  },
  headerBar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 0,
    bottom: 'auto',
  },
  footerBar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 'auto',
    bottom: 0,
  },
  footerToolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  footerButton: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  footerLabel: {
    // Aligns the content of the button vertically.
    flexDirection: 'column',
  },
  bodyContent: {
    marginTop: 80,
  },
  modalItem: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    width: '100%',
  },
});
// Helpers
const format = (input, replacements) => {
  const keys = _.keys(replacements);
  _.each(keys, (k) => {
    input = input.replace(k, replacements[k]);
  });
  return input;
};

class AppDialog extends React.Component {
  constructor(props) {
    super(props);
    this.doHandleClose = this.doHandleClose.bind(this);
    this.doHandleLogin = this.doHandleLogin.bind(this);
    this.state = {
      isTermsAgreed: false,
    };
  }
  // Local Variables

  // Event Handlers
  doHandleClose() {
    if (this.props.actions && this.props.actions.close) {
      this.props.actions.close();
    }
  }
  doHandleLogin(result) {
    console.log('>>>>Modal.doHandleLogin', result);
    if (this.props.actions && this.props.actions.signIn) {
      this.props.actions.signIn(result);
    }
  }
  // Sub Components
  // Display Widget
  render() {
    // Local Variables
    const {classes, modal, reference, actions} = this.props;
    // Show nothing if modal is empty
    if (!modal) {
      return '';
    }
    // Initialise modal
    const secModal = {};
    // Sub Components
    if (modal === ModalConst.USER_LOGIN.key) {
      secModal.title = ModalConst.USER_LOGIN.title;
      secModal.fullscreen = false;
      secModal.contents = (
        <div>
          <div className={classes.modalItem}>
            <FacebookLogin
              appId={Global.appId}
              callback={this.doHandleLogin}
              render={(renderProps) => (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={renderProps.onClick}
                >
                  Login with facebook
                </Button>
              )}
            />
          </div>
          <Divider />
          <TextField
            required
            id='username-input'
            label='Username'
            fullWidth
            className={classes.modalItem}
            margin='normal'
            variant='outlined'
            InputProps={{
              className: classes.modalItemChild,
            }}
          />
          <TextField
            id='password-input'
            label='Password'
            fullWidth
            className={classes.modalItem}
            type='password'
            margin='normal'
            variant='outlined'
            InputProps={{
              className: classes.modalItemChild,
            }}
          />
          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.modalItem}
          >
            Login
          </Button>
          <Button fullWidth variant='contained' className={classes.modalItem}>
            Forgot Password?
          </Button>
          <Divider />
          <Button fullWidth variant='contained' className={classes.modalItem}>
            Sign up
          </Button>
        </div>
      );
    } else if (modal === ModalConst.LESS_THAN_MIN.key) {
      const replacements = {'#Min#': reference.min};
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: this.doHandleClose,
        },
      ];
      secModal.title = format(ModalConst.LESS_THAN_MIN.title, replacements);
      secModal.description = ModalConst.LESS_THAN_MIN.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ENABLE_DIY.key) {
      const pBtnModal = [
        {title: ModalConst.button.DIY, handleClick: actions.handleCustomise},
        {title: ModalConst.button.CLOSE, handleClick: this.doHandleClose},
      ];
      secModal.title = ModalConst.ENABLE_DIY.title;
      secModal.fullscreen = false;
      secModal.description = ModalConst.ENABLE_DIY.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_DATE.key) {
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: this.doHandleClose},
      ];
      secModal.title = ModalConst.INVALID_DATE.title;
      secModal.description = ModalConst.INVALID_DATE.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.SUBMIT_PAYMENT.key) {
      // Local Variables, DX TODO
      const {isTermsAgreed} = this.state;
      const paypalOptions = {
        clientId:
          Payment.env === 'production' ? Payment.production : Payment.sandbox,
        currency: Payment.currency,
      };
      const buttonStyles = {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'checkout',
      };
      const {dtStart, dtEnd, people, rooms, rate} = reference;
      // Local Event Handlers
      const checkTermsHandler = (e) => {
        console.log('>>>>ProductPayment Terms updated', e);
        e.preventDefault();
        this.setState({isTermsAgreed: !this.state.isTermsAgreed});
      };
      const onSuccess = (outcome) => {
        console.log('paypal integration success', outcome);
        if (outcome.status === 'COMPLETED') {
          const result = {
            status:
              Payment.deposit > 0
                ? InstStatus.DEPOSIT_PAID
                : InstStatus.FULLY_PAID,
          };
          actions.handlePayment(result);
        }
      };
      const onError = (error) => {
        console.log('Erroneous payment OR failed to load script!', error);
      };
      const onCancel = (data) => {
        console.log('Cancelled payment!', data);
      };
      // Sub Components
      const divTime = (
        <tr key='time'>
          <td key='time.title'>
            <b>Fly Out / Fly Back</b>
          </td>
          <td key='time.value'>
            {`${dtStart.toLocaleDateString()} / ${dtEnd.toLocaleDateString()}`}
          </td>
        </tr>
      );
      const divPeople = (
        <tr key='people'>
          <td key='people.title'>
            <b>Total Travellers</b>
          </td>
          <td key='people.value'>{people}</td>
        </tr>
      );
      const divRooms = (
        <tr key='rooms'>
          <td key='rooms.title'>
            <b>Total Rooms</b>
          </td>
          <td key='rooms.value'>{rooms}</td>
        </tr>
      );
      const divRate = (
        <tr key='rate'>
          <td key='rate.title'>
            <b>Package Rate</b>
          </td>
          <td key='rate.value'>{rate}</td>
        </tr>
      );
      const divDeposit = Payment.deposit ? (
        <tr key='deposit'>
          <td key='deposit.title'>
            <b>Deposit</b>
          </td>
          <td key='deposit.value'>{Payment.deposit}</td>
        </tr>
      ) : (
        ''
      );
      const divTerms = (
        <div>
          <label onClick={checkTermsHandler} className={classes.terms}>
            <Checkbox checked={isTermsAgreed} color='primary' />
            <div style={{paddingTop: 12}}>{Payment.terms}</div>
          </label>
        </div>
      );

      const divPayment = isTermsAgreed ? (
        <PayPalButton
          paypalOptions={paypalOptions}
          buttonStyles={buttonStyles}
          amount={Payment.deposit}
          onPaymentSuccess={onSuccess}
          onPaymentSuccess={onError}
          onPaymentCancel={onCancel}
        />
      ) : (
        <div className={classes.panelBody}>
          <p style={{color: 'red'}}>
            <b>
              In order to proceed with the payment, please read the terms and
              conditions, then tick the checkbox above.
            </b>
          </p>
        </div>
      );
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: this.doHandleClose,
        },
      ];
      secModal.title = ModalConst.SUBMIT_PAYMENT.title;
      secModal.fullscreen = false;
      secModal.description = ModalConst.SUBMIT_PAYMENT.description;
      secModal.buttons = pBtnModal;
      secModal.contents = (
        <Grid container className={classes.bodyContent}>
          <table>
            <tbody>
              {divTime}
              {divPeople}
              {divRooms}
              {divRate}
              {divDeposit}
            </tbody>
          </table>
          {divTerms}
          {divPayment}
        </Grid>
      );
    } else if (modal === ModalConst.DELETE_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {
          title: ModalConst.button.YES,
          handleClick: actions.handleDeleteItinerary,
        },
        {title: ModalConst.button.NO, handleClick: this.doHandleClose},
      ];
      secModal.title = format(ModalConst.DELETE_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.DELETE_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.FAILED_DELETE_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const aList = _.filter(reference.attractions, (it) => {
        return it.isRequired;
      });
      const attractions = _.map(aList, (a) => {
        return a.name;
      });
      const replacements = {
        '#Day#': dayNo,
        '#Attractions#': attractions.toString(),
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: this.doHandleClose},
      ];
      secModal.title = format(
        ModalConst.FAILED_DELETE_ITINERARY.title,
        replacements
      );
      secModal.description = format(
        ModalConst.FAILED_DELETE_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ADD_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {
          title: ModalConst.button.YES,
          handleClick: actions.handleAddItinerary,
        },
        {title: ModalConst.button.NO, handleClick: this.doHandleClose},
      ];
      secModal.title = format(ModalConst.ADD_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.ADD_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.FULL_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: this.doHandleClose},
      ];
      secModal.title = format(ModalConst.FULL_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.FULL_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ONLY_ITINERARY.key) {
      const dayNo = `Day ${reference.dayNo || ''}`;
      const replacements = {
        '#Day#': dayNo,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: this.doHandleClose},
      ];
      secModal.title = format(ModalConst.ONLY_ITINERARY.title, replacements);
      secModal.description = format(
        ModalConst.ONLY_ITINERARY.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_MAX_PARTICIPANT.key) {
      const max = reference.max || 0;
      const replacements = {
        '#Max#': max,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: this.doHandleClose},
      ];
      secModal.title = ModalConst.INVALID_MAX_PARTICIPANT.title;
      secModal.description = format(
        ModalConst.INVALID_MAX_PARTICIPANT.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_MIN_PARTICIPANT.key) {
      const min = reference.min || 0;
      const replacements = {
        '#Min#': min,
      };
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: this.doHandleClose},
      ];
      secModal.title = ModalConst.INVALID_MIN_PARTICIPANT.title;
      secModal.description = format(
        ModalConst.INVALID_MIN_PARTICIPANT.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    }
    // Sub Components
    secModal.fullscreen = secModal.fullscreen !== false;
    const dButtons = _.map(secModal.buttons, (b) => {
      return (
        <Button
          key={b.title}
          onClick={() => {
            b.handleClick();
          }}
          classes={{root: classes.footerButton, label: classes.footerLabel}}
        >
          {b.title}
        </Button>
      );
    });
    const footer =
      dButtons && dButtons.length > 0 ? (
        <AppBar position='fixed' color='default' className={classes.footerBar}>
          <Toolbar className={classes.footerToolbar}>{dButtons}</Toolbar>
        </AppBar>
      ) : (
        ''
      );
    // Display widget
    return (
      <Dialog
        open
        fullScreen={!!secModal.fullscreen}
        onClose={this.doHandleClose}
        TransitionComponent={Transition}
        classes={{
          paper: secModal.fullscreen ? classes.fullPaper : classes.smallPaper,
        }}
      >
        <AppBar color='default' className={classes.headerBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              onClick={this.doHandleClose}
              aria-label='Close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' color='inherit'>
              {secModal.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent classes={{root: classes.bodyContent}}>
          {secModal.description ? (
            <div>
              <p>{secModal.description}</p>
            </div>
          ) : (
            ''
          )}
          {secModal.contents ? secModal.contents : ''}
        </DialogContent>
        {footer}
      </Dialog>
    );
  }
}

export default withStyles(styles)(AppDialog);
