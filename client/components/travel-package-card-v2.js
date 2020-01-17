// Components
import _ from 'lodash';
import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Slider from 'react-slick';
import Card from '@material-ui/core/Card';
// Styles and Icons
import IconLocation from '@material-ui/icons/LocationOn';
// Variables
const styles = (theme) => ({
  card: {
    width: '100%',
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
  link: {
    cursor: 'pointer',
  },
});

class TravelPackageCard extends React.Component {
  constructor(props) {
    super(props);
    // Bind handler
    this.doViewDetails = this.doViewDetails.bind(this);
    // Init data
    // Setup state
  }
  // Event Handlers
  doViewDetails() {
    const {actions, travelPackage} = this.props;
    if (actions && actions.viewDetails) {
      actions.viewDetails(travelPackage);
    }
  }
  // Widget
  render() {
    // Local Vairables
    const {classes, travelPackage} = this.props;
    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    // Sub Components
    const images = _.map(travelPackage.carouselImageUrls, (url, key) => {
      const alt = `${travelPackage.name} Image ${key}`;
      return (
        <div key={alt} style={{width: '100%'}}>
          <div className={classes.imgWrapper}>
            <img src={url} alt={alt} className={classes.imgItem} />
          </div>
        </div>
      );
    });
    // Display Widget
    return (
      <Card className={classes.card}>
        <Slider {...settings}>{images}</Slider>
        <div className={classes.cardTextRoot}>
          <a
            className={classes.link}
            onClick={() => {
              console.log('>>>>HotelCard.Clicked', travelPackage);
              this.doViewDetails(travelPackage);
            }}
          >
            <div className={classes.hotelAddress}>
              <div className={classes.flex}>
                <IconLocation
                  style={{
                    fontSize: 18,
                  }}
                />
                <div>China</div>
              </div>
            </div>
            <div>{travelPackage.name}</div>
            <div>
              {travelPackage.totalDays} Days From ${travelPackage.startingPrice}{' '}
              per person
            </div>
            <div>
              Enjoy your holiday valued up to ${travelPackage.retailPrice}
            </div>
          </a>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles, {withTheme: true})(TravelPackageCard);
