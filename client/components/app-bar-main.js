import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link as RouteLink} from 'react-router-dom';
import CONSTANTS from '../../lib/constants';
// ==== Icons and CSS ====
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
// Variables
const {Global} = CONSTANTS.get();
const styles = (theme) => ({
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
  divLink: {
    paddingLeft: 4,
    paddingRight: 4,
    color: theme.palette.common.white,
  },
  links: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    marginRight: 2,
    marginLeft: 0,
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
  constructor(props) {
    super(props);
    // Bind handler
    // Set state
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
    };
  }
  // ===== Helper Methods =====
  // ===== State & Event Handlers =====
  // ===== Display Widget =====
  render() {
    // Local Variables
    const {classes, user, actions} = this.props;
    const {anchorEl, mobileMoreAnchorEl} = this.state;
    const routeGoHome = '/';
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';
    // Event Handler
    const handleProfileMenuOpen = (event) => {
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
    const handleMobileMenuOpen = (event) => {
      this.setState({
        mobileMoreAnchorEl: event.currentTarget,
      });
    };
    // Sub Component
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        id={menuId}
        keepMounted
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>My Trips</MenuItem>
        <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
      </Menu>
    );
    /*
    <MenuItem>
      <IconButton aria-label='show new mails' color='inherit'>
        <Badge badgeContent={0} color='secondary'>
          <MailIcon />
        </Badge>
      </IconButton>
      <p>Messages</p>
    </MenuItem>
    <MenuItem>
      <IconButton aria-label='show new notifications' color='inherit'>
        <Badge badgeContent={0} color='secondary'>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <p>Notifications</p>
    </MenuItem>
    */
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label='trips of current user'
            aria-controls='primary-search-account-menu'
            aria-haspopup='true'
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <p>My Trips</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label='account of current user'
            aria-controls='primary-search-account-menu'
            aria-haspopup='true'
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <p>My Profile</p>
        </MenuItem>
      </Menu>
    );
    /*
    <IconButton aria-label='show new mails' color='inherit'>
      <Badge badgeContent={0} color='secondary'>
        <MailIcon />
      </Badge>
    </IconButton>
    <IconButton aria-label='show new notifications' color='inherit'>
      <Badge badgeContent={0} color='secondary'>
        <NotificationsIcon />
      </Badge>
    </IconButton>
    */
    const secDeskControls =
      user && user.loginId !== Global.anonymousUser ? (
        <div className={classes.sectionDesktop}>
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-controls={menuId}
            aria-haspopup='true'
            onClick={handleProfileMenuOpen}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
        </div>
      ) : (
        <div className={classes.sectionDesktop}>
          <Link href='#' onClick={actions.signUp} className={classes.divLink}>
            <PermIdentityIcon />
            Sign Up
          </Link>
          <div className={classes.divLink}>/</div>
          <Link href='#' onClick={actions.signIn} className={classes.divLink}>
            <PermIdentityIcon />
            Sign In
          </Link>
        </div>
      );
    const secMobileControls = (
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label='show more'
          aria-controls={mobileMenuId}
          aria-haspopup='true'
          onClick={handleMobileMenuOpen}
          color='inherit'
        >
          <MoreIcon />
        </IconButton>
      </div>
    );
    // Display Widget
    return (
      <div className={classes.grow}>
        <AppBar position='fixed' color='primary' className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
            <Typography className={classes.title} variant='h6'>
              Make My Holiday
            </Typography>
            <div className={classes.links}>
              <div onClick={actions.goHome}>
                <RouteLink to={routeGoHome}>
                  <div style={{color: 'white'}}>Hot Deals</div>
                </RouteLink>
              </div>
            </div>
            <div className={classes.grow} />
            {secDeskControls}
            {secMobileControls}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    );
  }
}

export default withStyles(styles)(AppHeaderBar);
