import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import CONSTANTS from '../../lib/constants';
import IconShare from '@material-ui/icons/ShareOutlined';
import IconPayment from '@material-ui/icons/PaymentOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import MinusBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';

// Variables
const {Instance, Global} = CONSTANTS.get();
const {standardRoomCapacity} = Global;

const styles = (theme) => ({
  appBar: {
    position: 'fixed',
    width: '100%',
    top: 'auto',
    bottom: 0,
  },
  toolbar: {
    display: 'block',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    width: Global.DesktopView.contentWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  loader: {
    width: '100%',
    textAlign: 'center',
  },
  displayFlex: {
    display: 'flex',
  },
  colItem: {
    width: '20%',
    padding: '4px 0px 4px 8px',
    fontSize: 16,
  },
  colController: {
    width: '10%',
    padding: 0,
  },
  colDescription: {
    padding: '4px 0px 4px 8px',
    fontSize: 16,
  },
  colButton: {
    width: '10%',
    padding: 0,
  },
  iconButtonRoot: {
    minWidth: 30,
  },
  iconButtonText: {
    margin: 2,
    padding: 0,
  },
  iconSmall: {
    fontSize: 24,
  },
});

class BotFooter extends React.Component {
  constructor(props) {
    console.log('>>>>BotFooter.constructor', props);
    super(props);
    this.doAddPeople = this.doAddPeople.bind(this);
    this.doRemovePeople = this.doRemovePeople.bind(this);
    this.doAddRoom = this.doAddRoom.bind(this);
    this.doRemoveRoom = this.doRemoveRoom.bind(this);
    this.doHandleShare = this.doHandleShare.bind(this);
    this.doHandlePayment = this.doHandlePayment.bind(this);
    // Set initial state
    this.state = {};
  }
  // ====== Event Handler ======
  doHandleShare() {
    console.log('>>>>BotFooter.doHandleShare');
    const {actions} = this.props;
    if (actions && actions.handleShare) {
      actions.handleShare();
    }
  }
  doHandlePayment() {
    console.log('>>>>BotFooter.doHandlePayment');
    const {actions} = this.props;
    if (actions && actions.handlePayment) {
      actions.handlePayment();
    }
  }
  // Handle add people
  doAddPeople() {
    console.log('>>>>BotFooter.doAddPeople');
    const {instPackageExt, actions, rates} = this.props;
    const {people} = instPackageExt;
    if (actions && actions.handlePeople) {
      const newPeople = people + 1;
      const newRooms = Math.ceil(newPeople / standardRoomCapacity);
      actions.handlePeople({people: newPeople, rooms: newRooms, rates});
    }
  }
  // Handle remove people
  doRemovePeople() {
    console.log('>>>>BotFooter.doRemovePeople');
    const {instPackageExt, actions, rates} = this.props;
    const {people} = instPackageExt;
    if (actions && actions.handlePeople) {
      const newPeople = people - 1;
      const newRooms = Math.ceil(newPeople / standardRoomCapacity);
      actions.handlePeople({people: newPeople, rooms: newRooms, rates});
    }
  }
  // Handle add room
  doAddRoom() {
    console.log('>>>>BotFooter.doAddRoom');
    const {instPackageExt, actions, rates} = this.props;
    const {rooms} = instPackageExt;
    if (actions && actions.handleRoom) {
      actions.handleRoom({rooms: rooms + 1, rates});
    }
  }
  // Handle remove room
  doRemoveRoom() {
    console.log('>>>>BotFooter.doRemoveRoom');
    const {instPackageExt, actions, rates} = this.props;
    const {rooms} = instPackageExt;
    if (actions && actions.handleRoom) {
      actions.handleRoom({rooms: rooms - 1, rates});
    }
  }
  // Render footer bar
  render() {
    console.log('>>>>BotFooter.render', this.state);
    // ====== Local Variables ======
    const {classes, instPackage, instPackageExt, updating} = this.props;
    const {curGap, curRate, nxtGap, nxtRate, max} = instPackageExt;
    const {people, otherPeople, rooms, otherRooms} = instPackageExt;
    const totalPeople = people + otherPeople;
    const totalRooms = rooms + otherRooms;
    const txtTotalPeople =
      totalPeople > 1 ? `${totalPeople} People` : '1 Person';
    const txtTotalRooms = totalRooms > 1 ? `${totalRooms} Rooms` : '1 Room';
    const finalCost = {price: 0, promo: ''};
    const isPeopleAddDisabled = updating || totalPeople >= max;
    const isPeopleMinusDisabled = updating || people <= 0 || totalPeople <= 1;
    const isRoomAddDisabled = updating || totalRooms <= totalPeople;
    const isRoomMinusDisabled = updating || rooms <= 1 || totalRooms <= 1;
    const isRoomDisabled = !instPackage.isCustomised;
    if (curGap === 0) {
      finalCost.price = `${curRate} pp`;
      finalCost.promo =
        nxtGap > 0
          ? `${nxtGap} more people ${nxtRate} pp`
          : `Max group size is ${max}`;
    } else {
      finalCost.price = `${curGap} more people $${curRate} pp`;
      finalCost.promo =
        nxtGap > 0
          ? `${nxtGap} more people ${nxtRate} pp`
          : `Max group size is ${max}`;
    }
    // ====== Web Elements ======
    // ====== Display ======
    /*
      <div className={classes.loader}>
        <Fade in={updating} unmountOnExit>
          <CircularProgress size={20} />
        </Fade>
      </div>
    */
    return (
      <AppBar position='fixed' color='default' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Table>
            <TableBody>
              <TableRow key={'share'}>
                <TableCell classes={{body: classes.colItem}}>
                  {txtTotalPeople}
                </TableCell>
                <TableCell classes={{body: classes.colController}}>
                  <div className={classes.displayFlex}>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Add'
                      disabled={isPeopleAddDisabled}
                      onClick={this.doAddPeople}
                    >
                      <AddBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Remove'
                      disabled={isPeopleMinusDisabled}
                      onClick={this.doRemovePeople}
                    >
                      <MinusBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell classes={{body: classes.colDescription}}>
                  {finalCost.price}
                </TableCell>
                <TableCell classes={{body: classes.colButton}}>
                  <IconButton
                    classes={{
                      root: classes.iconButtonRoot,
                      text: classes.iconButtonText,
                    }}
                    aria-label='Share'
                    onClick={this.doHandleShare}
                  >
                    <IconShare />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow key={'pay'}>
                <TableCell classes={{body: classes.colItem}}>
                  {txtTotalRooms}
                </TableCell>
                <TableCell classes={{body: classes.colController}}>
                  <div className={classes.displayFlex}>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Add'
                      disabled={isRoomDisabled || isRoomAddDisabled}
                      onClick={this.doAddRooms}
                    >
                      <AddBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                    <IconButton
                      classes={{
                        root: classes.iconButtonRoot,
                        text: classes.iconButtonText,
                      }}
                      aria-label='Remove'
                      disabled={isRoomDisabled || isRoomMinusDisabled}
                      onClick={this.doRemoveRooms}
                    >
                      <MinusBoxOutlinedIcon className={classes.iconSmall} />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell classes={{body: classes.colDescription}}>
                  {finalCost.promo}
                </TableCell>
                <TableCell classes={{body: classes.colButton}}>
                  <IconButton
                    classes={{
                      root: classes.iconButtonRoot,
                      text: classes.iconButtonText,
                    }}
                    aria-label='Deposit'
                    onClick={this.doHandlePayment}
                  >
                    <IconPayment />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, {withTheme: true})(BotFooter);
