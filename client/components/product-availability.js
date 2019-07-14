import React from 'react';
import Grid from '@material-ui/core/Grid';
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
import { Link } from 'react-router-dom';
import Helper from '../../lib/helper';
// ==== Styles ==============================================
import { withStyles } from '@material-ui/core/styles';
// ==== Additional CSS ======================================

const styles = theme => ({
	panel: {
		flexGrow: 1,
		paddingTop: 20,
		paddingRight: 200,
		paddingBottom: 20,
		paddingLeft: 200,
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
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {
			adults: 1,
			kids: 0,
			rate: 1000,
			startDate: '',
			endDate: '',
			contactFirstName: '',
			contactLastName: '',
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, product, actionCheckout, user, isOwner } = this.props;
		const {
			adults,
			kids,
			startDate,
			endDate,
			rate,
			contactFirstName,
			contactLastName,
		} = this.state;
		console.log('>>>>ProductAvailability.render()', product);
		// Route URLs

		// Event Handler
		const clickBackHandler = e => {
			console.log('>>>>ProductAvailability clicked Back', e);
		};
		const clickCheckoutHandler = e => {
			console.log('>>>>clickBackHandler clicked Checkout', e);
			const extra = {
				isOwner: isOwner,
				kids: kids,
				adults: adults,
				rate: rate,
				startDate: startDate,
				endDate: endDate,
				contactFirstName: contactFirstName,
				contactLastName: contactLastName,
			};
			if (isOwner) {
				extra.createdBy = user.fullName;
				extra.createdAt = new Date();
			} else {
				extra.updatedBy = user.fullName;
				extra.updatedAt = new Date();
			}
			actionCheckout({ extra, product });
		};
		const inputFirstNameHandler = e => {
			console.log('>>>>ProductAvailability input FirstName', e);
			this.setState({ contactFirstName: e.target.value });
		};
		const inputLastNameHandler = e => {
			console.log('>>>>ProductAvailability input LastName', e);
			this.setState({ contactLastName: e.target.value });
		};
		const selectAdultHandler = e => {
			console.log('>>>>ProductAvailability selected Adult', e);
			this.setState({ adults: e.target.value });
		};
		const selectKidHandler = e => {
			console.log('>>>>ProductAvailability selected Kid', e);
			this.setState({ kids: e.target.value });
		};
		const selectStartDateHandler = input => {
			console.log('>>>>ProductAvailability selected Start Date', input);
			const { startDate, endDate } = input;
			this.setState({ startDate: startDate, endDate: endDate });
		};
		// Sub Components
		const routeLinkCheckout = `/booking/payment`;
		const pricePerson = this.state.rate;
		const priceTotal = pricePerson * (this.state.kids + this.state.adults);
		// Get data string
		const strStartDate = startDate ? startDate.toLocaleDateString() : '';
		const strEndDate = endDate ? endDate.toLocaleDateString() : '';
		const listStartDate = _.map(product.departureDate.split(','), st => {
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
					onClick={e => {
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
				<Grid container spacing={0} className={classes.panelHeader}>
					<Grid item xs={12} className={classes.headerContext}>
						<Grid item xs={6} className={classes.headerTable}>
							<div className={classes.totalDays}>{product.totalDays} Days</div>
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
								style={{ width: '140px', verticalAlign: 'middle' }}
							>
								<Link to={routeLinkCheckout}>
									<Button
										onClick={clickCheckoutHandler}
										variant="contained"
										size="large"
										color="primary"
										aria-label="Checkout"
									>
										Checkout
										<IconChevronRight className={classes.extendedIcon} />
									</Button>
								</Link>
							</div>
						</Grid>
					</Grid>
				</Grid>
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
								<InputLabel htmlFor="start-date">Start date</InputLabel>
								<Input id="start-date" value={strStartDate} readOnly />
							</div>
							<div className={classes.bodyTableCell}>
								<IconChevronRight className={classes.extendedIcon} />
							</div>
							<div className={classes.bodyTableCell}>
								<InputLabel htmlFor="end-date">End date</InputLabel>
								<Input id="end-date" value={strEndDate} readOnly />
							</div>
						</Grid>
						<Grid
							item
							xs={4}
							className={classes.bodyTable}
							style={{ height: '72px' }}
						>
							<div className={classes.bodyTableCell} style={{ width: '50%' }}>
								<InputLabel htmlFor="adults">Adults</InputLabel>
								<Select
									value={adults}
									onChange={selectAdultHandler}
									inputProps={{
										name: 'adults',
										id: 'adults',
									}}
								>
									<MenuItem value={1}>1</MenuItem>
									<MenuItem value={2}>2</MenuItem>
									<MenuItem value={3}>3</MenuItem>
									<MenuItem value={4}>4</MenuItem>
								</Select>
							</div>
							<div className={classes.bodyTableCell} styles={{ width: '50%' }}>
								<InputLabel htmlFor="kids">Kids</InputLabel>
								<Select
									value={kids}
									onChange={selectKidHandler}
									inputProps={{
										name: 'kids',
										id: 'kids',
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
								<InputLabel htmlFor="first-name">First name</InputLabel>
								<Input
									id="first-name"
									value={contactFirstName}
									onChange={inputFirstNameHandler}
								/>
							</div>
							<div className={classes.bodyTableCell}>
								<InputLabel htmlFor="last-name">Last name</InputLabel>
								<Input
									id="last-name"
									value={contactLastName}
									onChange={inputLastNameHandler}
								/>
							</div>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.bodyTable}>
						<div>Select Stat Date</div>
						<List component="nav" aria-label="Start date selector">
							{listStartDate}
						</List>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(ProductAvailability);
