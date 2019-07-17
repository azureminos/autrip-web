import React from 'react';
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

class ProductPayment extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, product, cart, user } = this.props;
		console.log('>>>>ProductPayment.render()', { product, cart, user });
		// Route URLs

		// Event Handler
		
		// Sub Components
        
        // Get data string
		
		// Display Component
		return (
			<div className={classes.panel}>
				Product Payment
			</div>
		);
	}
}

export default withStyles(styles)(ProductPayment);
