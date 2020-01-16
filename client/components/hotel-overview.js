// Components
import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HotelCard from './hotel-card';
import CONSTANTS from '../../lib/constants';
// Styles and Icons
import IconHotel from '@material-ui/icons/Tune';
import IconClose from '@material-ui/icons/Close';
// Functions
// Variables
const {Global, Instance} = CONSTANTS.get();
const InstanceStatus = Instance.status;

const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  itemText: {
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
  modalBody: {
    left: 0,
    maxHeight: 515,
    overflowY: 'auto',
    width: '100%',
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
  spaceHeader: {
    marginTop: 80,
  },
  spaceFooter: {
    marginBottom: 80,
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class HotelOverview extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doSelectHotel = this.doSelectHotel.bind(this);
    this.doOpenSelectHotel = this.doOpenSelectHotel.bind(this);
    this.doCloseSelectHotel = this.doCloseSelectHotel.bind(this);
    // Init data
    // Setup state
    this.state = {
      open: false,
    };
  }
  // Event Handlers
  doOpenSelectHotel() {
    this.setState({open: true});
  }
  doCloseSelectHotel() {
    this.setState({open: false});
  }
  doSelectHotel(item) {
    this.setState({open: false});
    if (this.props.handleSelectHotel) {
      this.props.handleSelectHotel(item);
    }
  }
  // Display Widget
  render() {
    // Local variables
    const {classes, hotels} = this.props;
    const {open} = this.state;
    console.log('>>>>HotelOverview.render', hotels);
    const selectedHotel = _.find(hotels, (h) => {
      return h.isLiked;
    });
    const hotelLabel = selectedHotel ? `Stay at ${selectedHotel.name}` : '';
    // Sub Widgets
    const btnClose = (
      <Button
        classes={{root: classes.footerButton, label: classes.footerLabel}}
        variant='contained'
        disableRipple
        onClick={this.doCloseSelectHotel}
      >
        <IconClose />
        Close
      </Button>
    );
    const divHotels = _.map(hotels, (h) => {
      return (
        <HotelCard key={h.name} item={h} doSelectHotel={this.doSelectHotel} />
      );
    });
    const modal = open ? (
      <Dialog
        fullScreen
        open={open}
        onClose={this.doCloseSelectHotel}
        TransitionComponent={Transition}
      >
        <AppBar color='default' className={classes.headerBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              onClick={this.doCloseSelectHotel}
              aria-label='Close'
            >
              <IconClose />
            </IconButton>
            <Typography variant='h6' color='inherit'>
              Select Hotel
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.spaceHeader} />
        <div className={classes.modalBody}>{divHotels}</div>
        <div className={classes.spaceFooter} />
        <AppBar position='fixed' color='default' className={classes.footerBar}>
          <Toolbar className={classes.footerToolbar}>{btnClose}</Toolbar>
        </AppBar>
      </Dialog>
    ) : (
      ''
    );
    const btnCustomise = (
      <ListItemSecondaryAction>
        <IconButton
          edge='end'
          aria-label='select'
          onClick={this.doOpenSelectHotel}
        >
          <IconHotel />
        </IconButton>
      </ListItemSecondaryAction>
    );
    // Display Widget
    return (
      <div>
        <List className={classes.root}>
          <ListItem key={'hotel-title'} dense>
            <ListItemText
              primary={hotelLabel}
              classes={{primary: classes.itemText}}
            />
            {btnCustomise}
          </ListItem>
          <ListItem key={'hotel-description'} dense>
            <HotelCard item={selectedHotel} isReadonly />
          </ListItem>
        </List>
        {modal}
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(HotelOverview);
