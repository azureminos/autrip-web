// Components
import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import {PayPalButton} from 'react-paypal-button';
import CONSTANTS from '../../lib/constants';
// Styles
import CloseIcon from '@material-ui/icons/Close';
// Vairables
const ModalConst = CONSTANTS.get().Modal;
const {Payment, Instance} = CONSTANTS.get();
const InstStatus = Instance.status;
const styles = (theme) => ({
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
});
// Helpers
const format = (input, replacements) => {
  const keys = _.keys(replacements);
  _.each(keys, (k) => {
    input = input.replace(k, replacements[k]);
  });
  return input;
};
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class BotModal extends React.Component {
  constructor(props) {
    console.log('>>>>BotModal.constructor', props);
    super(props);
    // Bind handlers
    // Set initial state
    this.state = {
      isTermsAgreed: false,
    };
  }
  // Event Handlers
  // Render widget
  render() {
    const {isTermsAgreed} = this.state;
    const {classes, modal, actions, reference} = this.props;

    // Event Handler
    const checkTermsHandler = (e) => {
      console.log('>>>>ProductPayment Terms updated', e);
      e.preventDefault();
      this.setState({isTermsAgreed: !this.state.isTermsAgreed});
    };
    // Sub Components
    const secModal = {};
    if (modal === ModalConst.LESS_THAN_MIN.key) {
      const replacements = {'#Min#': reference.min};
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: actions.handleClose,
        },
      ];
      secModal.title = format(ModalConst.LESS_THAN_MIN.title, replacements);
      secModal.description = ModalConst.LESS_THAN_MIN.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ZERO_OWNER.key) {
      const replacements = {'#Min#': reference.min};
      const pBtnModal = [
        {
          title: ModalConst.button.CLOSE,
          handleClick: actions.handleClose,
        },
      ];
      secModal.title = format(ModalConst.ZERO_OWNER.title, replacements);
      secModal.description = ModalConst.ZERO_OWNER.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.ENABLE_DIY.key) {
      const pBtnModal = [
        {title: ModalConst.button.DIY, handleClick: actions.handleCustomise},
        {title: ModalConst.button.CLOSE, handleClick: actions.handleClose},
      ];
      secModal.title = ModalConst.ENABLE_DIY.title;
      secModal.description = ModalConst.ENABLE_DIY.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.INVALID_DATE.key) {
      const pBtnModal = [
        {title: ModalConst.button.OK, handleClick: actions.handleClose},
      ];
      secModal.title = ModalConst.INVALID_DATE.title;
      secModal.description = ModalConst.INVALID_DATE.description;
      secModal.buttons = pBtnModal;
    } else if (modal === ModalConst.SUBMIT_PAYMENT.key) {
      // Local Variables, DXTODO
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
      // Event Handlers
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
          handleClick: actions.handleClose,
        },
      ];
      secModal.title = ModalConst.SUBMIT_PAYMENT.title;
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
        {title: ModalConst.button.NO, handleClick: actions.handleClose},
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
        {title: ModalConst.button.OK, handleClick: actions.handleClose},
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
        {title: ModalConst.button.NO, handleClick: actions.handleClose},
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
        {title: ModalConst.button.OK, handleClick: actions.handleClose},
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
        {title: ModalConst.button.OK, handleClick: actions.handleClose},
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
        {title: ModalConst.button.OK, handleClick: actions.handleClose},
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
        {title: ModalConst.button.OK, handleClick: actions.handleClose},
      ];
      secModal.title = ModalConst.INVALID_MIN_PARTICIPANT.title;
      secModal.description = format(
        ModalConst.INVALID_MIN_PARTICIPANT.description,
        replacements
      );
      secModal.buttons = pBtnModal;
    }
    // Sub Components
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
    // Display Widget
    return (
      <Dialog
        open
        onClose={actions.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar color='default' className={classes.headerBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              onClick={actions.handleClose}
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
            <Typography component='p'>{secModal.description}</Typography>
          ) : (
            ''
          )}
          {secModal.contents ? secModal.contents : ''}
        </DialogContent>
        <AppBar position='fixed' color='default' className={classes.footerBar}>
          <Toolbar className={classes.footerToolbar}>{dButtons}</Toolbar>
        </AppBar>
      </Dialog>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotModal);
