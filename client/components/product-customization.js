import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import ItinerarySelector from './itinerary-selector';
import Helper from '../../lib/helper';
// ==== Styles ==============================================
import { withStyles } from '@material-ui/core/styles';
// ==== Additional CSS ======================================

const styles = theme => ({
	appBar: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0,
		top: 'auto',
		height: 100,
		paddingLeft: 200,
		paddingRight: 200,
	},
	toolbar: {
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 0,
	},
	panel: {
		flexGrow: 1,
		paddingTop: 20,
		paddingRight: 200,
		paddingBottom: 20,
		paddingLeft: 200,
		marginTop: 70,
		marginBottom: 100,
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
		display: 'flex',
	},
	bodyContext: {
		paddingTop: 8,
		display: 'flex',
	},
	dayCity: {
		display: 'table',
		clear: 'both',
	},
	titleDayCity: {
		float: 'left',
	},
	iconDayCity: {
		float: 'right',
		margin: '8px',
	},
});

class ProductCustomisation extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		this.handleChange = this.handleChange.bind(this);
		// Set state
		this.state = {
			tabIndex: 0,
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */
	handleChange (event, newValue) {
		this.setState({ idxDay: newValue });
	}
	/* ==== Render widget ==== */
	render () {
		const { classes, cart, product, user, isOwner, reference } = this.props;
		const { idxDay } = this.state;
		console.log('>>>>ProductCustomisation.render()', {
			cart,
			product,
			user,
			isOwner,
			reference,
		});
		// Route URLs
		// Event Handler
		// Local Variables
		let tmpArray = [];
		for (var i = 0; i < product.totalDays; i++) {
			tmpArray.push(i + 1);
		}
		// Sub Components
		const daySelector = (
			<List>
				{tmpArray.map((text, index) => {
					const isDayChangable = index !== 0 && index !== tmpArray.length - 1;
					return (
						<div key={text}>
							<ListItem button>
								<Typography
									variant="h5"
									gutterBottom
									className={classes.dayCity}
								>
									<div className={classes.titleDayCity}>{`Day ${text}`}</div>
								</Typography>
								{isDayChangable ? (
									<Fab
										size="small"
										color="secondary"
										aria-label="delete"
										className={classes.iconDayCity}
									>
										<DeleteIcon />
									</Fab>
								) : (
									''
								)}
								{isDayChangable ? (
									<Fab
										size="small"
										color="primary"
										aria-label="add"
										className={classes.iconDayCity}
									>
										<AddIcon />
									</Fab>
								) : (
									''
								)}
							</ListItem>
							<Divider />
						</div>
					);
				})}
			</List>
		);
		// Display Component
		return (
			<div className={classes.panel}>
				<Grid container spacing={0} className={classes.panelBody}>
					<Grid item xs={3} className={classes.bodyContext}>
						{daySelector}
					</Grid>
					<Grid item xs={9} className={classes.bodyContext}>
						<ItinerarySelector />
					</Grid>
				</Grid>
				<AppBar position="fixed" color="default" className={classes.appBar}>
					<Toolbar className={classes.toolbar}>Footer</Toolbar>
				</AppBar>
			</div>
		);
	}
}

export default withStyles(styles)(ProductCustomisation);
