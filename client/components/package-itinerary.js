import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import AttractionSlider from './attraction-slider-v3';
import HotelOverview from './hotel-overview';
import PackageSummary from './package-summary';
import BotFooter from './bot-footer';
import Helper from '../../lib/helper';
import PackageHelper from '../../lib/package-helper';
import CONSTANT from '../../lib/constants';

// Functions
const TabPanel = (props) => {
  const {children, value, index, ...other} = props;
  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
};
const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};
// Variables
const {Global} = CONSTANT.get();
const {contentWidth, tabWidth} = Global.DesktopView;
const styles = (theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    paddingBottom: 100,
    backgroundColor: theme.palette.background.paper,
  },
  tabLabel: {
    width: tabWidth,
  },
  tabLabelText: {
    fontWeight: 'bolder',
    fontSize: 'large',
  },
  tabPanel: {
    width: contentWidth - tabWidth,
  },
  list: {
    padding: 8,
  },
  listItem: {
    padding: '8px 0px 8px 0px',
  },
  listItemText: {
    fontSize: '1rem',
    fontWeight: 'bolder',
  },
});
class PackageItinerary extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doHandleTabSelect = this.doHandleTabSelect.bind(this);
    // Init data
    // Setup state
    this.state = {tabSelected: 0};
  }
  // Event Handlers
  doHandleTabSelect = (event, newValue) => {
    console.log('>>>>PackageItinerary.doHandleTabSelect', newValue);
    this.setState({tabSelected: newValue});
  };
  // Display Widget
  render() {
    // Local variables
    const {classes, contentWidth, updating} = this.props;
    const {packageSummary, cities, actions} = this.props;
    const {instPackage, instPackageExt, rates} = this.props;
    const {
      handlePeople,
      handleRoom,
      handleShare,
      handlePayment,
      handleSelectCar,
      handleSelectFlight,
      handleLikeAttraction,
      handleAddItinerary,
      handleDeleteItinerary,
    } = actions;
    const {tabSelected} = this.state;
    const carOptions = instPackage.isCustomised
      ? Helper.getValidCarOptions(rates.carRates)
      : [instPackage.carOption];
    const departDates = _.map(packageSummary.departureDate.split(','), (d) => {
      return d.trim();
    });
    const transport = {
      departDates: departDates,
      startDate: instPackage.startDate,
      totalDays: instPackage.totalDays,
      carOption: instPackage.carOption,
      carOptions: carOptions,
    };
    const itineraries = PackageHelper.getFullItinerary({
      isCustomised: instPackage.isCustomised,
      cities: cities,
      packageItems: instPackage.items,
      packageHotels: instPackage.hotels,
    });
    const footerActions = {
      handlePeople: handlePeople,
      handleRoom: handleRoom,
      handleShare: handleShare,
      handlePayment: handlePayment,
    };
    // Sub Widgets
    const tabLabels = [
      <Tab
        key={'Summary'}
        label={'Summary'}
        {...a11yProps(0)}
        className={classes.tabLabelText}
      />,
    ];
    _.each(itineraries, (it) => {
      const label = `Day ${it.dayNo}`;
      tabLabels.push(
        <Tab
          key={label}
          label={label}
          {...a11yProps(it.dayNo - 1)}
          className={classes.tabLabelText}
        />
      );
    });
    const tabPanels = [
      <TabPanel
        key={'Summary'}
        value={tabSelected}
        index={0}
        className={classes.tabPanel}
      >
        <PackageSummary
          transport={transport}
          itineraries={itineraries}
          cities={cities}
          handleSelectFlight={handleSelectFlight}
          handleSelectCar={handleSelectCar}
          handleClickDay={this.doHandleTabSelect}
        />
      </TabPanel>,
    ];

    _.each(itineraries, (it) => {
      const likedAttractions = _.filter(it.attractions, (a) => {
        return a.isLiked;
      });
      const notLikedAttractions = _.filter(it.attractions, (a) => {
        return !a.isLiked;
      });
      const btnCustomise =
        notLikedAttractions && notLikedAttractions.length > 0 ? (
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                handleAddItinerary(it);
              }}
              aria-label='AddDay'
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDeleteItinerary(it);
              }}
              aria-label='DeleteDay'
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        ) : (
          ''
        );
      const attractionSelected =
        likedAttractions && likedAttractions.length > 0 ? (
          <div>
            <AttractionSlider
              dayNo={it.dayNo}
              width={contentWidth - tabWidth - 32}
              timePlannable={it.timePlannable}
              attractions={likedAttractions}
              handleLikeAttraction={handleLikeAttraction}
              ref={(el) => (this.container = el)}
            />
          </div>
        ) : (
          ''
        );
      const attractionToSelect =
        notLikedAttractions && notLikedAttractions.length > 0 ? (
          <div>
            <AttractionSlider
              dayNo={it.dayNo}
              width={contentWidth - tabWidth - 32}
              timePlannable={it.timePlannable}
              attractions={notLikedAttractions}
              handleLikeAttraction={handleLikeAttraction}
            />
          </div>
        ) : (
          ''
        );
      const hotelSelected =
        it.hotels && it.hotels.length > 0 ? (
          <HotelOverview
            hotels={it.hotels}
            handleSelectHotel={(hotel) => {
              if (actions && actions.handleSelectHotel) {
                actions.handleSelectHotel(it.dayNo, hotel);
              }
            }}
          />
        ) : (
          ''
        );
      tabPanels.push(
        <TabPanel
          key={it.dayNo}
          value={tabSelected}
          index={it.dayNo}
          className={classes.tabPanel}
        >
          {attractionSelected}
          {attractionToSelect}
          {hotelSelected}
        </TabPanel>
      );
    });
    return (
      <div className={classes.root}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={tabSelected}
          onChange={this.doHandleTabSelect}
          indicatorColor='primary'
          textColor='primary'
          aria-label='Vertical tabs'
          className={classes.tabLabel}
        >
          {tabLabels}
        </Tabs>
        {tabPanels}
        <BotFooter
          instPackage={instPackage}
          instPackageExt={instPackageExt}
          rates={rates}
          actions={footerActions}
          updating={updating}
        />
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PackageItinerary);
