import _ from 'lodash';
import React, {createElement} from 'react';
import {Element, scroller} from 'react-scroll';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import FlightCar from './flight-car';
import packageHelper from '../../lib/package-helper';
import CONSTANTS from '../../lib/constants';
// ====== Icons ======
// Variables
const styles = (theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  itinerary: {
    display: 'block',
  },
});

class PackageSummary extends React.Component {
  constructor(props) {
    super(props);
    // Bind event handlers
    // Init data
    // Setup state
  }
  componentDidMount() {
    scroller.scrollTo('myScrollToElement', {
      duration: 0,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  }
  // Event Handlers
  // Display Widget
  render() {
    const {handleSelectCar, handleSelectFlight, handleClickDay} = this.props;
    const {classes, transport, itineraries, cities} = this.props;
    const {startDate, carOption} = transport;
    const {totalDays, departDates, carOptions} = transport;
    console.log('>>>>PackageSummary, render()', {
      transport,
      itineraries,
      cities,
    });
    // Local Variables
    // Sub Components
    const secFlightCar = (
      <FlightCar
        totalDays={totalDays}
        departDates={departDates}
        carOptions={carOptions}
        startDate={startDate}
        carOption={carOption}
        handleSelectCar={handleSelectCar}
        handleSelectFlight={handleSelectFlight}
      />
    );
    const divDays = _.map(itineraries, (it) => {
      const labelItinerary = `Day ${it.dayNo}, ${it.cityVisit}`;
      const divLabelItinerary =
        it.dayNo === 1 ? (
          <Element name='myScrollToElement'>{labelItinerary}</Element>
        ) : (
          labelItinerary
        );
      const cityImageUrl = packageHelper.getCityImage(it, cities) || '';
      return (
        <ListItem key={it.dayNo} className={classes.itinerary}>
          <Typography variant='h6' component='h4'>
            {divLabelItinerary}
          </Typography>
          <GridList cellHeight={160} className={classes.gridList} cols={1}>
            <GridListTile
              cols={1}
              onClick={() => {
                if (handleClickDay) {
                  handleClickDay({}, it.dayNo);
                }
              }}
            >
              <img src={cityImageUrl} alt={labelItinerary} />
            </GridListTile>
          </GridList>
        </ListItem>
      );
    });
    // Display Widget
    return (
      <List className={classes.root}>
        <ListItem key={'date-selector-1'}>{secFlightCar}</ListItem>
        <Divider />
        {divDays}
        <Divider />
        <ListItem key={'date-selector-2'}>{secFlightCar}</ListItem>
      </List>
    );
  }
}

export default withStyles(styles)(PackageSummary);
