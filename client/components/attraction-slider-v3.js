import _ from 'lodash';
import React, {createElement} from 'react';
import Carousel from 'react-multi-carousel';
// import {Carousel} from 'react-responsive-carousel';
import {withStyles} from '@material-ui/core/styles';
import AttractionCard from './attraction-card';

const styles = (theme) => ({
  slide: {
    width: '100%',
  },
});
const responsive = {
  desktop: {
    breakpoint: {max: 3000, min: 1024},
    items: 3,
    partialVisibilityGutter: 30,
  },
};

class AttractionSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  // Display Widget Content
  renderContent() {
    // console.log('>>>>AttractionSlider, render()', this.props);
    const {classes, loop, dayNo} = this.props;
    const {timePlannable, attractions, handleLikeAttraction} = this.props;
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
        <Carousel
          additionalTransfrom={0}
          arrows
          centerMode={false}
          deviceType={'desktop'}
          draggable={false}
          focusOnSelect={false}
          infinite={!!loop}
          partialVisible
          responsive={responsive}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          showDots={false}
          sliderClass=''
          slidesToSlide={1}
        >
          {cards}
        </Carousel>
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
