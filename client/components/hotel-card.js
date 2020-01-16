// Components
import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Swiper from 'react-id-swiper';
import Card from '@material-ui/core/Card';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// Styles and Icons
import IconLocation from '@material-ui/icons/LocationOn';
import IconStar from '@material-ui/icons/StarRate';
import IconClose from '@material-ui/icons/Close';
// Variables
const styles = (theme) => ({
  card: {
    width: '95%',
    margin: 8,
  },
  flex: {
    display: 'flex',
    width: '100%',
  },
  imgWrapper: {
    height: 0,
    overflow: 'hidden',
    paddingTop: '56.25%',
    position: 'relative',
  },
  imgItem: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  cardTextRoot: {
    padding: 8,
    display: 'block',
  },
  hotelName: {
    cursor: 'pointer',
  },
  hotelAddress: {
    width: '80%',
  },
  hotelRate: {
    cursor: 'pointer',
    width: '20%',
    textAlign: 'right',
  },
  hotelStar: {
    color: 'yellow',
    padding: '0px 4px 0px 0px',
  },
  modalBody: {
    left: 0,
    maxHeight: 515,
    overflowY: 'auto',
    width: '100%',
  },
  headerBar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 0,
    bottom: 'auto',
  },
  headerTitle: {
    fontSize: 18,
    paddingLeft: 8,
  },
  footerBar: {
    position: 'absolute',
    width: '100%',
    height: 60,
    top: 'auto',
    bottom: 0,
  },
  footerToolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },
  footerButton: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  footerLabel: {
    // Aligns the content of the button vertically.
    flexDirection: 'column',
  },
  spaceHeader: {
    marginTop: 80,
  },
  spaceFooter: {
    marginBottom: 80,
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

class HotelCard extends React.Component {
  constructor(props) {
    // console.log('>>>>HotelCard, constructor()', props);
    super(props);
    // Bind handler
    this.doOpenHotelModal = this.doOpenHotelModal.bind(this);
    this.doCloseHotelModal = this.doCloseHotelModal.bind(this);
    // Init data
    // Setup state
    this.state = {
      open: false,
    };
  }
  // Event Handlers
  doOpenHotelModal() {
    this.setState({open: true});
  }
  doCloseHotelModal() {
    this.setState({open: false});
  }
  // Widget
  render() {
    // Local Vairables
    const {classes, item, isReadonly, doSelectHotel} = this.props;
    const {open} = this.state;
    const settings = {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
    };
    // Sub Components
    const btnClose = (
      <Button
        classes={{root: classes.footerButton, label: classes.footerLabel}}
        variant='contained'
        disableRipple
        onClick={this.doCloseHotelModal}
      >
        <IconClose />
        Close
      </Button>
    );
    const images = _.map(item.carouselImageUrls, (url, key) => {
      const alt = `${item.name} Image ${key}`;
      return (
        <div key={alt} style={{width: '100%'}}>
          <div className={classes.imgWrapper}>
            <img src={url} alt={alt} className={classes.imgItem} />
          </div>
        </div>
      );
    });
    const stars = [];
    const ctStars = item.stars || 3;
    for (let i = 0; i < ctStars; i++) {
      stars.push(<IconStar key={i} className={classes.hotelStar} />);
    }
    const modal = open ? (
      <Dialog
        fullScreen
        open={open}
        onClose={this.doCloseHotelModal}
        TransitionComponent={Transition}
      >
        <AppBar color='default' className={classes.headerBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              onClick={this.doCloseHotelModal}
              aria-label='Close'
            >
              <IconClose />
            </IconButton>
            <div className={classes.headerTitle}>{item.name}</div>
          </Toolbar>
        </AppBar>
        <div className={classes.spaceHeader} />
        <div className={classes.modalBody}>Hotel Details To Be Added!</div>
        <div className={classes.spaceFooter} />
        <AppBar position='fixed' color='default' className={classes.footerBar}>
          <Toolbar className={classes.footerToolbar}>{btnClose}</Toolbar>
        </AppBar>
      </Dialog>
    ) : (
      ''
    );
    // Display Widget
    return (
      <Card className={classes.card}>
        <Swiper {...settings}>{images}</Swiper>
        <div className={classes.cardTextRoot}>
          <a
            className={classes.hotelName}
            onClick={() => {
              console.log('>>>>HotelCard.Name.Clicked', item);
              this.doOpenHotelModal();
            }}
          >
            <div>{item.name}</div>
          </a>
          <div className={classes.flex}>{stars}</div>
          <div className={classes.flex}>
            <div className={classes.hotelAddress}>
              <div className={classes.flex}>
                <IconLocation
                  style={{
                    fontSize: 18,
                  }}
                />
                <div>{item.address || 'Address to be updated'}</div>
              </div>
            </div>
            <a
              className={classes.hotelRate}
              onClick={() => {
                console.log('>>>>HotelCard.Price.Clicked', item);
                if (isReadonly) {
                  this.doOpenHotelModal();
                } else {
                  doSelectHotel(item);
                }
              }}
            >
              <div>{`$ ${item.defaultRate}`}</div>
            </a>
          </div>
        </div>
        {modal}
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(HotelCard);
