import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
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
                <h1>Review & Payment</h1>
			    <div>
                    <h3 className={classes.panelHeader}>
                        Tour
                    </h3>
                    <Grid container spacing={0} className={classes.panelBody}>
                        <Grid item xs={12}>Country</Grid>
                        <Grid item xs={12}>
                            <Grid item xs={5}>Name</Grid>
                            <Grid item xs={4}>Date</Grid>
                            <Grid item xs={3}>Image</Grid>
                        </Grid>
                        <Grid item xs={12}>Additional request</Grid>
                    </Grid>
                </div>
			    <div>
                    <h3 className={classes.panelHeader}>
                        Traveller Details
                    </h3>
                    <Grid container spacing={0} className={classes.panelBody}>
                        <Grid item xs={12}><h4>Primary Contact</h4></Grid>
                        <Grid item xs={12}>
                            <Grid item xs={6}>First Name</Grid>
                            <Grid item xs={6}>Last Name</Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={6}>Mobile Number</Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                    </Grid>
                </div>
                <div>
                    <h3 className={classes.panelHeader}>
                        Summary
                    </h3>
                    <Grid container spacing={0} className={classes.panelBody}>
                        <Grid item xs={12}>
                            <Grid item xs={12}><h4>Your Itinerary</h4></Grid>
                            <Grid item xs={12}>Itinerary blah blah...</Grid>
                        </Grid>
                        <Divider />
                        <Grid item xs={12}>
                            <Grid item xs={12}><h4>X Days Tour, Price</h4></Grid>
                            <Grid item xs={12}>Adults ?, Kids ?</Grid>
                        </Grid>
                        <Divider />
                        <Grid item xs={12}>
                            <Grid item xs={12}><h4>Subtotal</h4></Grid>
                            <Grid item xs={12}><h2>Grand Total</h2></Grid>
                        </Grid>
                        <Divider />
                        <Grid item xs={12}>Agree?</Grid>
                    </Grid>
                </div>
                <div>
                    <h3 className={classes.panelHeader}>
                        Payment
                    </h3>
                    <div className={classes.panelBody}>
                        Payment Content
                    </div>
                </div>
            </div>
		);
	}
}

export default withStyles(styles)(ProductPayment);
