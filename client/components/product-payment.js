import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Input from '@material-ui/core/Input';
import {PaypalButton} from 'react-paypal-button-v2';
import Helper from '../../lib/helper';
// ==== Styles ==============================================
import { withStyles } from '@material-ui/core/styles';
import helper from '../../lib/helper';
// ==== Additional CSS ======================================
import IconLocationOn from '@material-ui/icons/LocationOnOutlined';
import IconCalendarToday from '@material-ui/icons/CalendarTodayOutlined';
import IconPeople from '@material-ui/icons/PeopleOutlined';
import IconFlightLand from '@material-ui/icons/FlightLand';
import IconFlightTakeoff from '@material-ui/icons/FlightTakeoff';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
		paddingTop: 10,
		paddingBottom: 10,
	},
	panelBody: {
		backgroundColor: 'white',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: 'rgb(214, 217, 218)',
		paddingTop: 10,
		paddingRight: 20,
		paddingBottom: 10,
		paddingLeft: 20,
	},
	bodyContext: {
		display: 'flex',
		paddingTop: 4,
		paddingBottom: 4,
	},
	bodyBlock: {
		display: 'block',
	},
	bodyTable: {
		display: 'table',
	},
	bodyTableCell: {
		display: 'table-cell',
	},
	bodyElement: {
		display: 'block',
		marginTop: 8,
		marginRight: 8,
		marginBottom: 8,
	},
	bodyElementLeft: {
		display: 'inline-block',
		float: 'left',
		padding: 4,
	},
	bodyElementRight: {
		display: 'inline-block',
		float: 'right',
		padding: 4,
	},
	icon: {
		color: 'blue',
		paddingRight: 8,
	},
	icon2: {
		color: 'blue',
		paddingLeft: 4,
		paddingRight: 4,
	},
	terms: {
		display: 'flex',
		alignItems: 'flex-start',
		cursor: 'pointer',
		marginTop: 24,
	},
});

class ProductPayment extends React.Component {
	constructor (props) {
		super(props);
		// Pre-work
		const member = _.find(props.cart.members, { loginId: props.user.loginId });
		// Bind handler
		// Set state
		this.state = {
			contactFirstName: member.contactFirstName || '',
			contactLastName: member.contactLastName || '',
			contactMobile: member.contactMobile || '',
			agreed: false,
			payType: helper.vars.payTypeCreditCard,
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, product, cart, user, reference } = this.props;
		const {
			contactFirstName,
			contactLastName,
			contactMobile,
			agreed,
			payType,
		} = this.state;
		console.log('>>>>ProductPayment.render()', { product, cart, user });
		// Route URLs

		// Event Handler
		const clickPayTypeHandler = panel => (event, payType) => {
			this.setState({ payType: panel ? panel : false });
		};
		const checkTermsHandler = e => {
			console.log('>>>>ProductPayment Terms updated', e);
			e.preventDefault();
			this.setState({ agreed: !this.state.agreed });
		};
		const inputMobileHandler = e => {
			console.log('>>>>ProductPayment input Mobile', e);
			this.setState({ contactMobile: e.target.value });
		};
		const inputFirstNameHandler = e => {
			console.log('>>>>ProductPayment input FirstName', e);
			this.setState({ contactFirstName: e.target.value });
		};
		const inputLastNameHandler = e => {
			console.log('>>>>ProductPayment input LastName', e);
			this.setState({ contactLastName: e.target.value });
		};
		// Sub Components
		const amountDeposit = reference.payment.amountDeposit;
		const divDeposit
			= amountDeposit > 0 ? (
				<Grid item xs={12} className={classes.bodyBlock}>
					<div className={classes.bodyElementLeft}>
						<h2>
							<b>Deposit</b>
						</h2>
					</div>
					<div className={classes.bodyElementRight}>
						<h2 className={classes.bodyContext}>{amountDeposit}</h2>
					</div>
				</Grid>
			) : (
				''
			);
		const dtStart = new Date(cart.startDate);
		const dtEnd = new Date(cart.endDate);
		const totalTravelers = (cart.totalKids || 0) + (cart.totalAdults || 0);
		const strTotalTravelers = `${totalTravelers} Traveller${
			totalTravelers > 1 ? 's' : ''
		}`;
		const totalKids = _.sumBy(cart.members, o => {
			return o.kids || 0;
		});
		const strTotalKids = `${totalKids} Kid${totalKids > 1 ? 's' : ''}`;
		const totalAdults = _.sumBy(cart.members, o => {
			return o.adults || 0;
		});
		const strTotalAdults = `${totalAdults} Adult${totalAdults > 1 ? 's' : ''}`;
		const rateSubtotal = cart.rate || 0;
		const rateTotal = rateSubtotal * (totalAdults + totalKids);
		const titleImageUrl = Helper.resizeImage(
			product.imageUrl,
			'w_200,h_100,c_scale'
		);
		const paypalClient = {
			sandbox: reference.payment.paypalIdDummy,
			production: reference.payment.paypalId,
		};
		// Display Component
		return (
			<div className={classes.panel}>
				<h1>Review & Payment</h1>
				<div>
					<h3 className={classes.panelHeader}>Tour</h3>
					<Grid container spacing={0} className={classes.panelBody}>
						<Grid item xs={12} className={classes.bodyContext}>
							<IconLocationOn fontSize="default" className={classes.icon} />
							<div>China</div>
						</Grid>
						<Grid item xs={12} className={classes.bodyContext}>
							<Grid item xs={5} className={classes.bodyBlock}>
								<div className={classes.bodyContext}>{product.name}</div>
							</Grid>
							<Grid item xs={4} className={classes.bodyBlock}>
								<div className={classes.bodyContext}>
									<IconCalendarToday
										fontSize="default"
										className={classes.icon}
									/>
									<div>
										{dtStart.toLocaleDateString()}
										{' - '}
										{dtEnd.toLocaleDateString()}
									</div>
								</div>
								<div className={classes.bodyContext}>
									<IconPeople fontSize="default" className={classes.icon} />
									<div>{strTotalTravelers}</div>
								</div>
							</Grid>
							<Grid item xs={3} className={classes.bodyBlock}>
								<div className={classes.bodyContext}>
									<img src={titleImageUrl} alt={product.name} />
								</div>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							Additional request
						</Grid>
					</Grid>
				</div>
				<div>
					<h3 className={classes.panelHeader}>Traveller Details</h3>
					<Grid container spacing={0} className={classes.panelBody}>
						<Grid item xs={12}>
							<h4>Primary Contact</h4>
						</Grid>
						<Grid item xs={12} className={classes.bodyTable}>
							<Grid item xs={6} className={classes.bodyTableCell}>
								<InputLabel
									htmlFor="first-name"
									className={classes.bodyElement}
								>
									First name
								</InputLabel>
								<Input
									id="first-name"
									value={contactFirstName}
									onChange={inputFirstNameHandler}
									className={classes.bodyElement}
								/>
							</Grid>
							<Grid item xs={6} className={classes.bodyTableCell}>
								<InputLabel htmlFor="last-name" className={classes.bodyElement}>
									Last name
								</InputLabel>
								<Input
									id="last-name"
									value={contactLastName}
									onChange={inputLastNameHandler}
									className={classes.bodyElement}
								/>
							</Grid>
						</Grid>
						<Grid item xs={12} className={classes.bodyContext}>
							<Grid item xs={6} className={classes.bodyBlock}>
								<InputLabel
									htmlFor="contact-mobile"
									className={classes.bodyElement}
								>
									Mobile Number
								</InputLabel>
								<Input
									id="contact-mobile"
									value={contactMobile}
									onChange={inputMobileHandler}
									className={classes.bodyElement}
								/>
							</Grid>
							<Grid item xs={6} className={classes.bodyBlock}></Grid>
						</Grid>
					</Grid>
				</div>
				<div>
					<h3 className={classes.panelHeader}>Summary</h3>
					<Grid container spacing={0} className={classes.panelBody}>
						<Grid item xs={12} className={classes.bodyBlock}>
							<div className={classes.bodyElementLeft}>
								<b>Your Itinerary</b>
							</div>
							<div className={classes.bodyElementRight}>
								<div className={classes.bodyContext}>
									<IconFlightTakeoff
										fontSize="default"
										className={classes.icon2}
									/>
									<div>{dtStart.toLocaleDateString()}</div>
									<IconFlightLand
										fontSize="default"
										className={classes.icon2}
									/>
									<div>{dtEnd.toLocaleDateString()}</div>
								</div>
							</div>
						</Grid>
						<Grid item xs={12} className={classes.bodyBlock}>
							<div className={classes.bodyElementLeft}>
								<b>Total Travellers</b>
							</div>
							<div className={classes.bodyElementRight}>
								<div className={classes.bodyContext}>
									{`${strTotalAdults}, ${strTotalKids}`}
								</div>
							</div>
						</Grid>
						<Grid item xs={12} className={classes.bodyBlock}>
							<div className={classes.bodyElementLeft}>
								<b>Subtotal</b>
							</div>
							<div className={classes.bodyElementRight}>
								<div className={classes.bodyContext}>{rateSubtotal}</div>
							</div>
						</Grid>
						<Grid item xs={12} className={classes.bodyBlock}>
							<div className={classes.bodyElementLeft}>
								<h2>
									<b>Grand Total</b>
								</h2>
							</div>
							<div className={classes.bodyElementRight}>
								<h2 className={classes.bodyContext}>{rateTotal}</h2>
							</div>
						</Grid>
						{divDeposit}
					</Grid>
				</div>
				<div>
					<label onClick={checkTermsHandler} className={classes.terms}>
						<Checkbox checked={agreed} color="primary" />
						<div style={{ paddingTop: 12 }}>
							I have read and agree to the Terms and Conditions, Luxury Escapes
							Privacy Policy and understand that all children under 18 years
							must be travelling with an adult.
						</div>
					</label>
				</div>
				<div>
					<h3 className={classes.panelHeader}>Payment</h3>
					<div className={classes.panelBody}>
						<h4>Select your preferred payment method:</h4>
						<ExpansionPanel
							expanded={payType === helper.vars.payTypeCreditCard}
							onChange={clickPayTypeHandler(helper.vars.payTypeCreditCard)}
							style={{ margin: 0 }}
						>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1bh-content"
								id="panel1bh-header"
							>
								<div>Credit Cards</div>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<div>ToDo: Pay by credit card</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel
							expanded={payType === helper.vars.payTypePaypal}
							onChange={clickPayTypeHandler(helper.vars.payTypePaypal)}
							style={{ margin: 0 }}
						>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel2bh-content"
								id="panel2bh-header"
							>
								<div>Paypal</div>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<PaypalButton
									options={{
										clientId: paypalClient[reference.payment.paypalEnv],
									}}
									style={{
										layout: 'vertical',
										color: 'gold',
										shape: 'rect',
										label: 'paypal',
										tagline : false,
									}}
									createOrder={(data, actions) => {
										alert(`ID: ${paypalClient[reference.payment.paypalEnv]}, Currency: ${user.currency}, Money: ${amountDeposit > 0 ? amountDeposit : rateTotal}`);
									}}
								/>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(ProductPayment);
