import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconLocationOn from '@material-ui/icons/LocationOn';
import IconEventAvailable from '@material-ui/icons/EventAvailable';
import IconSettings from '@material-ui/icons/Settings';
import Swiper from 'react-id-swiper';
import { Link } from 'react-router-dom';
import Helper from '../../lib/helper';
// Styles
import { withStyles } from '@material-ui/core/styles';
// ==== Additional CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';
import helper from '../../lib/helper';

const styles = theme => ({
	panel: {
		flexGrow: 1,
		paddingTop: 20,
		paddingRight: 200,
		paddingBottom: 20,
		paddingLeft: 200,
	},
	sectionImage: {
		height: 400,
		width: '100%',
	},
	location: {
		display: 'flex',
	},
	paper: {
		backgroundColor: 'white',
	},
	swiper: {
		backgroundColor: 'lightgray',
	},
	descSection: {
		paddingRight: 16,
		paddingLeft: 16,
	},
	rateSection: {
		padding: 16,
		backgroundColor: 'lightgray',
	},
	otherSection: {
		padding: 16,
	},
	productRegular: {
		padding: 16,
		backgroundColor: 'white',
	},
	productPremium: {
		padding: 16,
		backgroundColor: 'white',
	},
	extendedIcon: {
		marginLeft: 8,
		marginRight: 8,
	},
	buttons: {
		marginTop: 16,
		width: '100%',
	},
	accordion: {
		margin: 0,
	},
});

class ProductDetails extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const {
			classes,
			product,
			user,
			isOwner,
			actionGetAvailability,
			actionCustomise,
		} = this.props;
		console.log('>>>>ProductDetails.render()', product);
		// Route URLs
		const routeLinkBuy = `/booking/availability/${product.id}`;
		const routeLinkDiy = `/booking/diy/${product.id}`;
		// Event Handler
		const clickDiyHandler = e => {
			console.log('>>>>ProductDetails clicked DIY', e);
			const members = [
				{
					loginId: user.loginId,
					isOwner: isOwner,
					kids: 0,
					adults: 1,
					contact: user.fullName,
				},
			];
			const extra = {
				status: helper.vars.statusCustomise,
				isCustomised: false,
				rate: 0,
				startDate: null,
				endDate: null,
				members: members,
				createdBy: user.fullName,
				createdAt: new Date(),
			};
			actionCustomise({ extra, product });
		};
		const clickAvailabilityHandler = e => {
			console.log('>>>>ProductDetails clicked Check Availability', product);
			const params = {
				id: product.id,
				isCustomised: false,
			};
			actionGetAvailability(params);
		};
		// Sub Component
		const isLoggedIn = !!user;
		const { isCustomisable } = product;
		const pSwiper = {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			slidesPerView: 2,
			spaceBetween: 0,
			centeredSlides: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		};
		const itemsSwiper = _.map(product.carouselImages, (img, idx) => {
			const carouselImage = Helper.resizeImage(img, 'w_788,h_400,c_scale');
			return (
				<div key={product.name + '_' + idx}>
					<img
						src={carouselImage}
						alt={product.name}
						className={classes.sectionImage}
					/>
				</div>
			);
		});
		const diyProduct
			= isLoggedIn && isCustomisable && isOwner ? (
				<div className={classes.productPremium}>
					<h4>Premium Tour</h4>
					<div>Want to visit somewhere special?</div>
					<Link to={routeLinkDiy}>
						<Button
							onClick={clickDiyHandler}
							variant="contained"
							size="medium"
							color="primary"
							aria-label="DIY Product"
							className={classes.buttons}
						>
							<IconSettings className={classes.extendedIcon} />
							DIY Premium Package
						</Button>
					</Link>
				</div>
			) : (
				''
			);
		// Display Component
		return (
			<div className={classes.paper}>
				<Grid container spacing={0} className={classes.swiper}>
					<Grid item xs={12}>
						<Swiper {...pSwiper}>{itemsSwiper}</Swiper>
					</Grid>
				</Grid>
				<div className={classes.panel}>
					<Grid container spacing={0}>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={0}>
								<Grid item xs={8}>
									<div className={classes.descSection}>
										<section className={classes.location}>
											<IconLocationOn />
											<div>China</div>
										</section>
										<h1>{product.name}</h1>
										<p>{product.description}</p>
									</div>
								</Grid>
								<Grid item xs={4}>
									<div className={classes.rateSection}>
										<div className={classes.productRegular}>
											<h4>Regular Tour</h4>
											<table style={{ width: '100%' }}>
												<tbody>
													<tr>
														<td style={{ width: '50%' }}>
															{product.totalDays} Days From
														</td>
														<td style={{ width: '50%' }}>
															${product.startingPrice} per person
														</td>
													</tr>
													<tr>
														<td style={{ width: '50%' }}>Twin Share</td>
														<td style={{ width: '50%' }}>
															Value up to ${product.retailPrice}
														</td>
													</tr>
												</tbody>
											</table>

											<Link to={routeLinkBuy}>
												<Button
													onClick={clickAvailabilityHandler}
													variant="contained"
													size="medium"
													color="primary"
													aria-label="Check Availability"
													className={classes.buttons}
												>
													<IconEventAvailable
														className={classes.extendedIcon}
													/>
													Check Availability
												</Button>
											</Link>
										</div>
										{diyProduct}
									</div>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<div className={classes.otherSection}>
								<ExpansionPanel
									className={classes.accordion}
									defaultExpanded={true}
								>
									<ExpansionPanelSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1a-content"
										id="panel1a-header"
									>
										<h3>Highlights</h3>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<p>
											Explore Tasmania's renowned Bay of Fires over four
											fantastic days of walking and sightseeing. This tour is
											perfect for both first-timers and regular trekkers,
											providing guests with delightful nightly accommodation
											where you can store your luggage while you enjoy the day's
											adventures. What You'll Love...The Experiences - Enjoy
											Tasmania's natural beauty
										</p>
									</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel
									className={classes.accordion}
									defaultExpanded={true}
								>
									<ExpansionPanelSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel2a-content"
										id="panel2a-header"
									>
										<h3>Fine Print</h3>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<p>{product.finePrint}</p>
									</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel
									className={classes.accordion}
									defaultExpanded={true}
								>
									<ExpansionPanelSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel3a-content"
										id="panel3a-header"
									>
										<h3>Itinerary</h3>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<p>
											Day 1 - Launceston – Musselroe Bay to Boulder Point - 13km
											walking, approx. 5 hours of walking, including breaks
											(easy to moderate grade) You will be picked up from the
											Hotel Grand Chancellor in Launceston at 7.45am for an 8am
											departure. Head out into the northern section of Mount
											William National park to begin the Bay of Fires beach walk
											at the northern end of Musselroe Bay. Walk from the remote
											coastal conservation area of Musselroe Bay to Boulder
											Point, predominantly on the sand. The incredibly scenic
											coastline of deserted white-sand beaches is punctuated by
											windswept headlands, sheltered lagoons and estuaries.
											Following on from this, head off for an easy one-hour
											return walk to the top of Mt William. From the peak (216m)
											in clear weather, you can enjoy extensive views over the
											coast and inland, while to the north you’ll see some of
											the Bass Strait islands. Then head back to the
											accommodation to unpack and enjoy pre-dinner nibbles
											followed by a two-course meal prepared by your guides.
										</p>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(ProductDetails);
