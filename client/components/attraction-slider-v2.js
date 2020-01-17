import _ from 'lodash';
import React, {createElement} from 'react';
import Slider from 'react-slick';
// import {Carousel} from 'react-responsive-carousel';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card';

const styles = (theme) => ({
  slide: {
    width: '100%',
  },
});

class AttractionSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  // Display Widget Content
  renderContent() {
    // console.log('>>>>AttractionSlider, render()', this.props);
    const {classes, loop, dayNo} = this.props;
    const {timePlannable, attractions, handleLikeAttraction} = this.props;
    const settings = {
      dots: true,
      arrows: false,
      infinite: loop,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
    };
    const doHandleLikeAttraction = (item) => {
      if (handleLikeAttraction) {
        handleLikeAttraction(dayNo, timePlannable, item, attractions);
      }
    };
    if (attractions && attractions.length > 0) {
      const cards = _.map(attractions, (a, idx) => {
        return (
          <AttractionCard
            key={idx}
            item={a}
            likeAttraction={doHandleLikeAttraction}
          />
        );
      });
      return (
        <Slider {...settings} className={classes.slide}>
          {cards}
        </Slider>
      );
    }
    return '';
  }
  // Display Widget
  render() {
    return this.renderContent();
  }
}

export default withStyles(styles, {withTheme: true})(AttractionSlider);
