import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Swiper from 'react-id-swiper';
// Styles
import { withStyles } from '@material-ui/core/styles';
// ==== Additional CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';

const styles = theme => ({
	root: {
		flexGrow: 1,
		paddingTop: 20,
		paddingRight: 200,
		paddingBottom: 20,
		paddingLeft: 200,
	},
	paper: {
		height: '100%',
		width: '100%',
	},
	sectionImage: {
		height: 400,
	},
	sectionContext: {
		height: 200,
	},
	control: {
		padding: 2,
	},
});

class PackageBrick extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {};
	}
	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes } = this.props;
		return (
			<Grid container className={classes.root} spacing={0}>
				<Grid item xs={12}>
					<Grid
						container
						justify="center"
						spacing={0}
						className={classes.sectionImage}
					>
						<Grid item xs={4}>
							<Paper className={classes.paper} />
						</Grid>
						<Grid item xs={8}>
							<Paper className={classes.paper} />
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid
						container
						justify="center"
						spacing={0}
						className={classes.sectionContext}
					>
						<Grid item xs={8}>
							<Paper className={classes.paper} />
						</Grid>
						<Grid item xs={2}>
							<Paper className={classes.paper} />
						</Grid>
						<Grid item xs={2}>
							<Paper className={classes.paper} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles)(PackageBrick);
