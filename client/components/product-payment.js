import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconLocationOn from '@material-ui/icons/LocationOnOutlined';
import IconCalendarToday from '@material-ui/icons/CalendarTodayOutlined';
import IconPeople from '@material-ui/icons/PeopleOutlined';
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
	icon: {
		color: 'blue',
		paddingRight: 8,
	},
});

class ProductPayment extends React.Component {
	constructor (props) {
		super(props);
		// Pre-work
		const member = _.find(props.cart.members, { loginId: user.loginId });
		// Bind handler
		// Set state
		this.state = {
			contactFirstName: member.contactFirstName || '',
			contactLastName: member.contactLastName || '',
			contactMobile: member.contactMobile || '',
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, product, cart, user } = this.props;
		const { contactFirstName, contactLastName, contactMobile } = this.state;
		console.log('>>>>ProductPayment.render()', { product, cart, user });
		// Route URLs

		// Event Handler
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

		// Get data string
		const dtStart = new Date(cart.startDate);
		const dtEnd = new Date(cart.endDate);
		const totalTravelers = (cart.totalKids || 0) + (cart.totalAdults || 0);
		const titleImageUrl = Helper.resizeImage(
			product.imageUrl,
			'w_200,h_100,c_scale'
		);
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
									<div>{totalTravelers}</div>
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
						<Grid item xs={12} className={classes.bodyContext}>
							<Grid item xs={6} className={classes.bodyBlock}>
								<InputLabel htmlFor="contact-mobile">Mobile Number</InputLabel>
								<Input
									id="contact-mobile"
									value={contactMobile}
									onChange={inputMobileHandler}
								/>
							</Grid>
							<Grid item xs={6} className={classes.bodyBlock}></Grid>
						</Grid>
					</Grid>
				</div>
				<div>
					<h3 className={classes.panelHeader}>Summary</h3>
					<Grid container spacing={0} className={classes.panelBody}>
						<Grid item xs={12}>
							<Grid item xs={12}>
								<h4>Your Itinerary</h4>
							</Grid>
							<Grid item xs={12}>
								Itinerary blah blah...
							</Grid>
						</Grid>
						<Divider />
						<Grid item xs={12}>
							<Grid item xs={12}>
								<h4>X Days Tour, Price</h4>
							</Grid>
							<Grid item xs={12}>
								Adults ?, Kids ?
							</Grid>
						</Grid>
						<Divider />
						<Grid item xs={12}>
							<Grid item xs={12}>
								<h4>Subtotal</h4>
							</Grid>
							<Grid item xs={12}>
								<h2>Grand Total</h2>
							</Grid>
						</Grid>
						<Divider />
						<Grid item xs={12}>
							Agree?
						</Grid>
					</Grid>
				</div>
				<div>
					<h3 className={classes.panelHeader}>Payment</h3>
					<div className={classes.panelBody}>Payment Content</div>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(ProductPayment);
