import React from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconFlightTakeoff from '@material-ui/icons/FlightTakeoff';
import IconChevronRight from '@material-ui/icons/ChevronRight';
import RouteLink from 'react-router-dom/Link';
import Helper from '../../lib/helper';
import CONSTATNS from '../../lib/constants';
// ==== Styles ==============================================
import {withStyles} from '@material-ui/core/styles';
// ==== Additional CSS ======================================

const {Global} = CONSTATNS.get();

const styles = (theme) => ({
  appBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 'auto',
    height: 100,
    paddingLeft: 200,
    paddingRight: 200,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  panel: {
    flexGrow: 1,
    paddingTop: 20,
    paddingRight: 200,
    paddingBottom: 20,
    paddingLeft: 200,
    marginTop: 70,
    marginBottom: 100,
    boxSizing: 'border-box',
  },
  panelHeader: {
    backgroundColor: 'rgb(249, 249, 249)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(214, 217, 218)',
    paddingTop: 20,
    paddingRight: 40,
    paddingBottom: 20,
    paddingLeft: 40,
  },
  panelBody: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(214, 217, 218)',
    paddingTop: 20,
    paddingRight: 40,
    paddingBottom: 20,
    paddingLeft: 40,
  },
  headerContext: {
    display: 'flex',
  },
  headerTable: {
    display: 'table',
  },
  headerTableCell: {
    display: 'table-cell',
    paddingLeft: 8,
    paddingRight: 8,
  },
  bodyContext: {
    display: 'flex',
  },
  bodyBlock: {
    display: 'block',
    padding: 4,
    margin: 4,
  },
  bodyTable: {
    display: 'table',
    padding: 4,
    margin: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(214, 217, 218)',
  },
  bodyTableCell: {
    display: 'table-cell',
    paddingLeft: 8,
    paddingRight: 8,
  },
  totalDays: {
    fontSize: '0.875rem',
  },
  productName: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  priceTotal: {
    fontSize: '1.5rem',
    textAlign: 'right',
  },
  pricePerson: {
    fontSize: '0.875rem',
    textAlign: 'right',
    color: 'rgb(102, 102, 102)',
  },
});

class ProductAvailability extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    // Set state
    this.state = {
      people: 2,
      rooms: 1,
      rate: 1000,
      startDate: '',
      endDate: '',
      contactFirstName: '',
      contactLastName: '',
    };
  }

  /* ===== Helper Methods ===== */

  /* ===== State & Event Handlers ===== */

  render() {
    const {classes, cart, product, actionCheckout, user, isOwner} = this.props;
    const {
      people,
      rooms,
      startDate,
      endDate,
      rate,
      contactFirstName,
      contactLastName,
    } = this.state;
    console.log('>>>>ProductAvailability.render()', product);
    // Route URLs
    // Event Handler
    const clickCheckoutHandler = (e) => {
      console.log('>>>>clickCheckoutHandler clicked Checkout', e);
      const status = Helper.vars.statusUnpaid;
      const isCustomised = cart ? cart.isCustomised : false;
      const members = cart
        ? cart.members
        : [
          {
            loginId: user.loginId,
            isOwner: isOwner,
            people: people,
            rooms: rooms,
            contact: `${contactFirstName} ${contactLastName}`,
          },
        ];
      const extra = {
        status: status,
        isCustomised: isCustomised,
        rate: rate,
        startDate: startDate,
        endDate: endDate,
        members: members,
      };
      if (cart) {
        extra.updatedBy = user.fullName;
        extra.updatedAt = new Date();
      } else {
        extra.createdBy = user.fullName;
        extra.createdAt = new Date();
      }
      actionCheckout({extra, product});
    };
    const inputFirstNameHandler = (e) => {
      console.log('>>>>ProductAvailability input FirstName', e);
      this.setState({contactFirstName: e.target.value});
    };
    const inputLastNameHandler = (e) => {
      console.log('>>>>ProductAvailability input LastName', e);
      this.setState({contactLastName: e.target.value});
    };
    const selectPeopleHandler = (e) => {
      console.log('>>>>ProductAvailability selected people', e);
      const rooms = Math.ceil(e.target.value / Global.maxRoomCapacity);
      this.setState({people: e.target.value, rooms});
    };
    const selectRoomsHandler = (e) => {
      console.log('>>>>ProductAvailability selected rooms', e);
      this.setState({rooms: e.target.value});
    };
    const selectStartDateHandler = (input) => {
      console.log('>>>>ProductAvailability selected Start Date', input);
      const {startDate, endDate} = input;
      this.setState({startDate: startDate, endDate: endDate});
    };
    // Sub Components
    const routeLinkCheckout = '/booking/payment';
    const pricePerson = this.state.rate;
    const priceTotal = pricePerson * this.state.people;
    // Get data string
    const strStartDate = startDate ? startDate.toLocaleDateString() : '';
    const strEndDate = endDate ? endDate.toLocaleDateString() : '';
    const listStartDate = _.map(product.departureDate.split(','), (st) => {
      const d = st.trim().split('/');
      const tStartDate = new Date();
      const tEndDate = new Date();
      tStartDate.setDate(Number(d[0]));
      tStartDate.setMonth(Number(d[1]));
      tStartDate.setFullYear(Number(d[2]));
      tStartDate.setTime(Helper.forceDate(tStartDate).getTime());
      tEndDate.setDate(Number(d[0]) + product.totalDays);
      tEndDate.setMonth(Number(d[1]));
      tEndDate.setFullYear(Number(d[2]));
      tEndDate.setTime(Helper.forceDate(tEndDate).getTime());
      const strTravelDates = `${tStartDate.toLocaleDateString()} >> ${tEndDate.toLocaleDateString()}`;
      return (
        <ListItem
          key={st.trim()}
          button
          selected={false}
          onClick={(e) => {
            selectStartDateHandler({
              startDate: tStartDate,
              endDate: tEndDate,
            });
          }}
        >
          <ListItemIcon>
            <IconFlightTakeoff />
          </ListItemIcon>
          <ListItemText primary={strTravelDates} />
        </ListItem>
      );
    });
    // Display Component
    return (
      <div className={classes.panel}>
        <Grid container spacing={0} className={classes.panelBody}>
          <Grid item xs={12} className={classes.bodyContext}>
            <Grid item xs={4} className={classes.bodyBlock}>
              Travel Dates
            </Grid>
            <Grid item xs={4} className={classes.bodyBlock}>
              Number of Travellers
            </Grid>
            <Grid item xs={4} className={classes.bodyBlock}>
              Primary Contact Name
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.bodyContext}>
            <Grid item xs={4} className={classes.bodyTable}>
              <div className={classes.bodyTableCell}>
                <InputLabel htmlFor='start-date'>Start date</InputLabel>
                <Input id='start-date' value={strStartDate} readOnly />
              </div>
              <div className={classes.bodyTableCell}>
                <IconChevronRight className={classes.extendedIcon} />
              </div>
              <div className={classes.bodyTableCell}>
                <InputLabel htmlFor='end-date'>End date</InputLabel>
                <Input id='end-date' value={strEndDate} readOnly />
              </div>
            </Grid>
            <Grid
              item
              xs={4}
              className={classes.bodyTable}
              style={{height: '72px'}}
            >
              <div className={classes.bodyTableCell} style={{width: '50%'}}>
                <InputLabel htmlFor='people'>People</InputLabel>
                <Select
                  value={people}
                  onChange={selectPeopleHandler}
                  inputProps={{
                    name: 'people',
                    id: 'people',
                  }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                </Select>
              </div>
              <div className={classes.bodyTableCell} styles={{width: '50%'}}>
                <InputLabel htmlFor='rooms'>Rooms</InputLabel>
                <Select
                  value={rooms}
                  disabled
                  onChange={selectRoomsHandler}
                  inputProps={{
                    name: 'rooms',
                    id: 'rooms',
                  }}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </div>
            </Grid>
            <Grid item xs={4} className={classes.bodyTable}>
              <div className={classes.bodyTableCell}>
                <InputLabel htmlFor='first-name'>First name</InputLabel>
                <Input
                  id='first-name'
                  value={contactFirstName}
                  onChange={inputFirstNameHandler}
                />
              </div>
              <div className={classes.bodyTableCell}>
                <InputLabel htmlFor='last-name'>Last name</InputLabel>
                <Input
                  id='last-name'
                  value={contactLastName}
                  onChange={inputLastNameHandler}
                />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.bodyTable}>
            <div>Select Stat Date</div>
            <List component='nav' aria-label='Start date selector'>
              {listStartDate}
            </List>
          </Grid>
        </Grid>
        <AppBar position='fixed' color='default' className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Grid container spacing={0} className={classes.panelHeader}>
              <Grid item xs={12} className={classes.headerContext}>
                <Grid item xs={6} className={classes.headerTable}>
                  <div className={classes.totalDays}>
                    {product.totalDays} Days
                  </div>
                  <h1 className={classes.productName}>{product.name}</h1>
                </Grid>
                <Grid item xs={6} className={classes.headerTable}>
                  <div className={classes.headerTableCell}>
                    <div className={classes.priceTotal}>
                      AUD ${priceTotal} Total
                    </div>
                    <div className={classes.pricePerson}>
                      AUD ${pricePerson} / Person
                    </div>
                  </div>
                  <div
                    className={classes.headerTableCell}
                    style={{width: '140px', verticalAlign: 'middle'}}
                  >
                    <RouteLink to={routeLinkCheckout}>
                      <Button
                        onClick={clickCheckoutHandler}
                        variant='contained'
                        size='large'
                        color='primary'
                        aria-label='Checkout'
                      >
                        Checkout
                        <IconChevronRight className={classes.extendedIcon} />
                      </Button>
                    </RouteLink>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(ProductAvailability);
