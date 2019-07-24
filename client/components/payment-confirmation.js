import React from 'react';
import { Link } from 'react-router-dom';
import Helper from '../../lib/helper';
// ==== Styles ==============================================
import { withStyles } from '@material-ui/core/styles';
// ==== Additional CSS ======================================

const styles = theme => ({});

class PaymentConfirmation extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, product, cart, user } = this.props;
		console.log('>>>>PaymentConfirmation.render()', { product, cart, user });
		// Route URLs

		// Event Handler
		const clickBackHandler = e => {
			console.log('>>>>PaymentConfirmation clicked Back', e);
		};
		// Sub Components

		// Display Component
		return <div>Payment Confirmation Page</div>;
	}
}

export default withStyles(styles)(PaymentConfirmation);
