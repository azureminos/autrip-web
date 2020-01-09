import React, {createElement} from 'react';
import _ from 'lodash';
import Product from './Product';
import Title from './Title';
import styled from 'styled-components';

export default class ProductList extends React.Component {
  render() {
    console.log('>>>>ProductList.render', this.props.products);
    const {handleDetail, addToCart, openModal} = this.props;
    const products = _.map(this.props.products, (product) => {
      console.log(product);
      return (
        <Product
          key={product.id}
          product={product}
          handleDetail={handleDetail}
          addToCart={addToCart}
          openModal={openModal}
        />
      );
    });

    return (
      <ProductWrapper className='py-5'>
        <div className='container'>
          <div className='row'>{products}</div>
        </div>
      </ProductWrapper>
    );
  }
}

const ProductWrapper = styled.section``;
