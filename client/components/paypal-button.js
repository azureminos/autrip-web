import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import Button from '@material-ui/core/Button';
// ==== Styles ==============================================
import { withStyles } from '@material-ui/core/styles';
import helper from '../../lib/helper';

const styles = theme => ({
	button: {},
	hidden: { display: 'none' },
});

class PaypalButton extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {
			currency: props.currency,
		};
	}

	render () {
		const { classes, env, total, client } = this.props;
		const { currency } = this.state;

		const onSuccess = payment => {
			// Congratulation, it came here means everything's fine!
			console.log('The payment was succeeded!', payment);
		};

		const onCancel = data => {
			// User pressed "cancel" or close Paypal's popup!
			console.log('The payment was cancelled!', data);
		};

		const onError = err => {
			// The main Paypal's script cannot be loaded or somethings block the loading of that script!
			console.log('Error!', err);
		};

		return (
			<PaypalExpressBtn
				env={env}
				client={client}
				currency={currency}
				total={total}
				onError={onError}
				onSuccess={onSuccess}
				onCancel={onCancel}
			/>
		);
	}
}

export default withStyles(styles)(PaypalButton);
