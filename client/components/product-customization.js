import React from 'react';
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
});

class ProductCustomisation extends React.Component {
	constructor (props) {
		super(props);
		const cart = props.cart;
		const isCustomised = cart ? cart.isCustomised : false;
		// Bind handler
		// Set state
		this.state = {
			isCustomised: isCustomised,
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, cart, product, user, isOwner, reference } = this.props;
		const {} = this.state;
		console.log('>>>>ProductCustomisation.render()', {
			cart,
			product,
			user,
			isOwner,
			reference,
		});
		// Route URLs
		// Event Handler
		// Sub Components
		// Display Component
		return <div className={classes.panel}>Customise Product</div>;
	}
}

export default withStyles(styles)(ProductCustomisation);
