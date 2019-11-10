import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconLocationOn from '@material-ui/icons/LocationOn';
import IconChevronRight from '@material-ui/icons/ChevronRight';
import Swiper from 'react-id-swiper';
import { Link } from 'react-router-dom';
import Helper from '../../lib/helper';
// Styles
import { withStyles } from '@material-ui/core/styles';
// ==== Additional CSS ==============================================
import 'react-id-swiper/src/styles/css/swiper.css';

const styles = theme => ({
	panel: {
		flexGrow: 1,
		paddingTop: 20,
		paddingRight: 200,
		paddingBottom: 20,
		paddingLeft: 200,
	},
	brickBorder: {
		backgroundColor: 'rgb(255, 255, 255)',
		borderColor: 'rgb(214, 217, 218)',
		borderStyle: 'solid',
		borderWidth: 1,
	},
	paper: {
		height: '100%',
		width: '100%',
	},
	sectionImage: {
		height: 400,
		width: '100%',
	},
	sectionContext: {
		height: 150,
		padding: 20,
		backgroundColor: 'white',
	},
	control: {
		padding: 2,
	},
	location: {
		display: 'flex',
	},
	titleProduct: {
		width: '100%',
		fontSize: '200%',
	},
	extendedIcon: {
		marginLeft: 8,
	},
});

class ProductBrick extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {};
	}
	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, key, actionGetProduct } = this.props;
		const p = this.props.product;
		console.log('>>>>ProductBrick.render()', p);
		// Register click handler
		const clickHandler = e => {
			console.log('>>>>ProductBrick clicked', e);
			actionGetProduct(p.id);
		};
		// Route Link
		const routeLink = `/product/${p.id}`;
		// Title Image
		const titleImageUrl = Helper.resizeImage(
			p.titleImageUrl,
			'w_394,h_400,c_scale'
		);
		// Photo Swiper
		const pSwiper = {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		};
		const itemsSwiper = _.map(p.carouselImages, (img, idx) => {
			const carouselImage = Helper.resizeImage(img, 'w_788,h_400,c_scale');
			return (
				<div key={p.name + '_' + idx}>
					<div onClick={clickHandler}>
						<Link to={routeLink}>
							<img
								src={carouselImage}
								alt={p.name}
								className={classes.sectionImage}
							/>
						</Link>
					</div>
				</div>
			);
		});
		return (
			<div key={key} className={classes.panel}>
				<Grid container className={classes.brickBorder} spacing={0}>
					<Grid item xs={12}>
						<Grid container justify="center" spacing={0}>
							<Grid item xs={4}>
								<div onClick={clickHandler}>
									<Link to={routeLink}>
										<img
											src={titleImageUrl}
											alt={p.name}
											className={classes.sectionImage}
										/>
									</Link>
								</div>
							</Grid>
							<Grid item xs={8}>
								<Swiper {...pSwiper}>{itemsSwiper}</Swiper>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<div onClick={clickHandler}>
							<Link to={routeLink}>
								<Grid
									container
									justify="center"
									spacing={0}
									className={classes.sectionContext}
								>
									<Grid item xs={8}>
										<div>
											<div className={classes.location}>
												<div>
													<IconLocationOn />
												</div>
												<div>China</div>
											</div>
											<div className={classes.titleProduct}>{p.name}</div>
										</div>
									</Grid>
									<Grid item xs={2}>
										<div>
											<div>{p.totalDays} Days From $1000 per person</div>
										</div>
									</Grid>
									<Grid item xs={2}>
										<Button
											variant="contained"
											size="medium"
											color="primary"
											aria-label="View Details"
										>
											View Details
											<IconChevronRight className={classes.extendedIcon} />
										</Button>
									</Grid>
								</Grid>
							</Link>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(ProductBrick);
