import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';

const styles = theme => ({
	grow: {
		flexGrow: 1,
	},
	appBar: {
		top: 0,
		bottom: 'auto',
		height: 70,
	},
	toolBar: {
		paddingLeft: 200,
		paddingRight: 200,
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
			marginLeft: 8,
			marginRight: 24,
			color: theme.palette.common.white,
		},
	},
	links: {
		'position': 'relative',
		'borderRadius': theme.shape.borderRadius,
		'&:hover': {
			textDecoration: 'underline',
			cursor: 'pointer',
		},
		'marginRight': 2,
		'marginLeft': 0,
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
});

class AppHeaderBar extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null,
		};
	}

	/* ===== Helper Methods ===== */

	/* ===== State & Event Handlers ===== */

	render () {
		const { classes, user, isAllowAnonymous, actionGoHome } = this.props;
		const { anchorEl, mobileMoreAnchorEl } = this.state;
		// Route URLs
		const routeGoHome = `/`;
		// Event Handler
		const handleProfileMenuOpen = event => {
			this.setState({
				anchorEl: event.currentTarget,
			});
		};
		const handleMobileMenuClose = () => {
			this.setState({
				mobileMoreAnchorEl: null,
			});
		};
		const handleMenuClose = () => {
			this.setState({
				anchorEl: null,
			});
			handleMobileMenuClose();
		};
		const handleMobileMenuOpen = event => {
			this.setState({
				mobileMoreAnchorEl: event.currentTarget,
			});
		};
		// Sub Component
		const isMenuOpen = Boolean(anchorEl);
		const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
		const menuId = 'primary-search-account-menu';
		const renderMenu = (
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				id={menuId}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
				<MenuItem onClick={handleMenuClose}>My account</MenuItem>
			</Menu>
		);
		const mobileMenuId = 'primary-search-account-menu-mobile';
		const renderMobileMenu = (
			<Menu
				anchorEl={mobileMoreAnchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				id={mobileMenuId}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMobileMenuOpen}
				onClose={handleMobileMenuClose}
			>
				<MenuItem>
					<IconButton aria-label="show 4 new mails" color="inherit">
						<Badge badgeContent={4} color="secondary">
							<MailIcon />
						</Badge>
					</IconButton>
					<p>Messages</p>
				</MenuItem>
				<MenuItem>
					<IconButton aria-label="show 11 new notifications" color="inherit">
						<Badge badgeContent={11} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<p>Notifications</p>
				</MenuItem>
				<MenuItem onClick={handleProfileMenuOpen}>
					<IconButton
						aria-label="account of current user"
						aria-controls="primary-search-account-menu"
						aria-haspopup="true"
						color="inherit"
					>
						<AccountCircle />
					</IconButton>
					<p>Profile</p>
				</MenuItem>
			</Menu>
		);

		return (
			<div className={classes.grow}>
				<AppBar position="fixed" color="primary" className={classes.appBar}>
					<Toolbar className={classes.toolBar}>
						<Typography className={classes.title} variant="h6">
							Make My Holiday
						</Typography>
						<div className={classes.links}>
							<div onClick={actionGoHome}>
								<Link to={routeGoHome}>
									<div style={{ color: 'white' }}>Hot Deals</div>
								</Link>
							</div>
						</div>
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<IconButton aria-label="show 4 new mails" color="inherit">
								<Badge badgeContent={4} color="secondary">
									<MailIcon />
								</Badge>
							</IconButton>
							<IconButton
								aria-label="show 17 new notifications"
								color="inherit"
							>
								<Badge badgeContent={17} color="secondary">
									<NotificationsIcon />
								</Badge>
							</IconButton>
							<IconButton
								edge="end"
								aria-label="account of current user"
								aria-controls={menuId}
								aria-haspopup="true"
								onClick={handleProfileMenuOpen}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
						</div>
						<div className={classes.sectionMobile}>
							<IconButton
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MoreIcon />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{renderMobileMenu}
				{renderMenu}
			</div>
		);
	}
}

export default withStyles(styles)(AppHeaderBar);
