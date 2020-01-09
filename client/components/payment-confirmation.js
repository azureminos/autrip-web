import React, {createElement} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
// ==== Styles ==============================================
import {withStyles} from '@material-ui/core/styles';
// Variables
const styles = (theme) => ({
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
});

class PaymentConfirmation extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    // Set state
    this.state = {};
  }

  /* ===== Helper Methods ===== */

  /* ===== State & Event Handlers ===== */

  render() {
    const {classes, product, cart, user, actionGoHome} = this.props;
    console.log('>>>>PaymentConfirmation.render()', {product, cart, user});
    // Route URLs
    const routeLink = '/';
    // Event Handler
    // Sub Components
    // Display Component
    return (
      <div className={classes.panel}>
        <div>
          <h4 className={classes.panelHeader}>Your trip is booked</h4>
          <Grid container spacing={0} className={classes.panelBody}>
            <Grid item xs={12} className={classes.bodyContext}>
              <div>
                Your trip id is {cart._id}. All details will be sent to{' '}
                {user.email}.
              </div>
            </Grid>
            <Grid item xs={12} className={classes.bodyContext}>
              <div>
                Thank you for booking with AUTrip. Please use the above trip id
                in all communication with AUTrip travel consultant.
              </div>
            </Grid>
            <Grid item xs={12}>
              <div onClick={actionGoHome}>
                <Link to={routeLink}>
                  <Button
                    variant='contained'
                    size='medium'
                    color='primary'
                    aria-label='View Deals'
                  >
                    Browse More Travel Deals
                  </Button>
                </Link>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PaymentConfirmation);
