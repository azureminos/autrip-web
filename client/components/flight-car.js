import _ from 'lodash';
import Moment from 'moment';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CONSTANTS from '../../lib/constants';
// Icons
import FlightTakeoff from '@material-ui/icons/FlightTakeoff';
import DirectionsCar from '@material-ui/icons/DirectionsCar';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded';
// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
  flex: {
    display: 'flex',
  },
  icon: {
    marginTop: 6,
    marginLeft: 4,
    marginRight: 4,
  },
  form: {
    marginTop: 0,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 0,
    minWidth: 110,
  },
});

class FlightCar extends React.Component {
  constructor(props) {
    super(props);
    this.doHandleCarChange = this.doHandleCarChange.bind(this);
    this.doHandleFlightChange = this.doHandleFlightChange.bind(this);
  }
  doHandleCarChange(event) {
    if (this.props.handleSelectCar) {
      this.props.handleSelectCar(event.target.value);
    }
  }
  doHandleFlightChange(event) {
    if (this.props.handleSelectFlight) {
      this.props.handleSelectFlight(event.target.value);
    }
  }
  render() {
    // Local Variables
    const {classes, totalDays, departDates, carOptions} = this.props;
    const {startDate, carOption, isDisabled} = this.props;
    const isReadonly = carOptions && carOptions.length === 1;
    const stStartDate = startDate
      ? Moment(startDate).format(Global.dateFormat)
      : '';
    const stEndDate = startDate
      ? Moment(startDate)
          .add(totalDays, 'days')
          .format(Global.dateFormat)
      : '';
    // Sub Components
    const miDepartDates = _.map(departDates, (i) => {
      return (
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    });
    const miReturnDates = stEndDate ? (
      <MenuItem value={stEndDate}>{stEndDate}</MenuItem>
    ) : (
      ''
    );
    const miCarOptions = carOptions
      ? _.map(carOptions, (i) => {
        return (
            <MenuItem key={i || 0} value={i}>
              {i}
            </MenuItem>
        );
      })
      : [];

    // Web Elements
    const divFlightOptions = (
      <div className={classes.flex}>
        <div className={classes.icon}>
          <FlightTakeoff color='primary' />
        </div>
        <div>
          <FormControl className={classes.form} disabled={isDisabled}>
            <Select
              value={stStartDate || ''}
              onChange={this.doHandleFlightChange}
              displayEmpty
              inputProps={{
                name: 'departDate',
                id: 'depart-date',
              }}
            >
              <MenuItem value='' disabled>
                <em>Fly Out</em>
              </MenuItem>
              {miDepartDates}
            </Select>
          </FormControl>
          <FormControl className={classes.form}>
            <Select value={stEndDate || ''} displayEmpty disabled>
              <MenuItem value='' disabled>
                <em>Fly Back</em>
              </MenuItem>
              {miReturnDates}
            </Select>
          </FormControl>
        </div>
        <div className={classes.icon}>
          <HelpIcon />
        </div>
      </div>
    );
    const divCarOptions = (
      <div className={classes.flex}>
        <div className={classes.icon}>
          <DirectionsCar color='primary' />
        </div>
        <div>
          <FormControl
            className={classes.form}
            disabled={isReadonly || isDisabled}
          >
            <Select
              value={carOption || ''}
              onChange={this.doHandleCarChange}
              displayEmpty
              inputProps={{
                name: 'typeGroundTransport',
                id: 'typeGroundTransport-simple',
              }}
            >
              <MenuItem value='' disabled>
                <em>Ground Transport</em>
              </MenuItem>
              {miCarOptions}
            </Select>
          </FormControl>
        </div>
        <div className={classes.icon}>
          <HelpIcon />
        </div>
      </div>
    );

    return (
      <div className={classes.root}>
        {divFlightOptions}
        {divCarOptions}
      </div>
    );
  }
}

export default withStyles(styles)(FlightCar);
