import React, { createElement } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChipList from './chip-list';
import ItineraryItemCard from './itinerary-item-card';

const styles = theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular,
	},
	cardWraper: {
		padding: 8,
	},
});

class ItinerarySelector extends React.Component {
	constructor(props) {
		super(props);
		const panelMap = {
			description: true,
			attraction: false,
			hotel: false,
		};

		this.state = {
			clicked: 0,
			panelMap: panelMap,
		};
	}
	/* ===== Helper Methods ===== */
	/* ===== State & Event Handlers ===== */
	handleChange = panel => (event, expanded) => {
		console.log('>>>>ItinerarySelector, handleChange()', {
			panel: panel,
			expanded: expanded,
		});
		const that = this;
		const { panelMap } = that.state;
		const clicked = that.state.clicked + 1;
		panelMap[panel] = !panelMap[panel];
		that.setState({
			panelMap: panelMap,
			clicked: clicked,
		});
	};

	/* ==== Render widget ==== */
	render() {
		console.log('>>>>ItinerarySelector, start render()', {
			props: this.props,
			state: this.state,
		});
		const { classes } = this.props;
		const { panelMap } = this.state;
		// Route URLs
		// Event Handler
		const handleCardClick = () => {
			console.log('');
		};
		// Local Variables
		const tagAttractions = [
			{
				id: 1,
				name: "Garden of Couple's Retreat",
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426255/Attractions/ekgqheo5vvibg6icxg4b.jpg',
			},
			{
				id: 2,
				name: 'The Grand Canal of Suzhou',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426206/Attractions/hl0x1bhff2wow6lf7tw9.jpg',
			},
		];
		const tagHotels = [
			{
				id: 1,
				name: 'Shanghai Keya International Hotel',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1559473505/Hotels/nfwd4gxxfj3fkaokmaxz.jpg',
			},
		];
		const listAttractions = [
			{
				name: 'The Grand Canal of Suzhou 1',
				description: 'The Grand Canal of Suzhou',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426206/Attractions/hl0x1bhff2wow6lf7tw9.jpg',
				isLiked: false,
			},
			{
				name: 'The Grand Canal of Suzhou 2',
				description: 'The Grand Canal of Suzhou',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426206/Attractions/hl0x1bhff2wow6lf7tw9.jpg',
				isLiked: true,
			},
			{
				name: 'The Grand Canal of Suzhou 3',
				description: 'The Grand Canal of Suzhou',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426206/Attractions/hl0x1bhff2wow6lf7tw9.jpg',
				isLiked: true,
			},
			{
				name: 'The Grand Canal of Suzhou 4',
				description: 'The Grand Canal of Suzhou',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426206/Attractions/hl0x1bhff2wow6lf7tw9.jpg',
				isLiked: false,
			},
			{
				name: 'The Grand Canal of Suzhou 5',
				description: 'The Grand Canal of Suzhou',
				imageUrl:
					'https://res.cloudinary.com/azureminos/image/upload/v1555426206/Attractions/hl0x1bhff2wow6lf7tw9.jpg',
				isLiked: false,
			},
		];

		// Sub Components
		const attractionCards = _.map(listAttractions, item => {
			return (
				<Grid item xs={4} key={item.name} className={classes.cardWraper}>
					<ItineraryItemCard item={item} handleClick={handleCardClick} />
				</Grid>
			);
		});
		// Display Component
		return (
			<div className={classes.root}>
				<ExpansionPanel
					expanded={panelMap['description']}
					onChange={this.handleChange('description')}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<h5>Description</h5>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>All Description</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel
					expanded={panelMap['attraction']}
					onChange={this.handleChange('attraction')}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<h5>Attraction</h5>
						<ChipList tags={tagAttractions} />
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<Grid container spacing={0}>
							{attractionCards}
						</Grid>
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel
					expanded={panelMap['hotel']}
					onChange={this.handleChange('hotel')}
				>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<h5>Hotel</h5>
						<ChipList tags={tagHotels} />
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>hotel cards</ExpansionPanelDetails>
				</ExpansionPanel>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(ItinerarySelector);
