import React, { Component, createElement } from 'react';
import _ from 'lodash';
import Product from './Product';
import Title from './Title';
import styled from 'styled-components';

export default class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: props.products,
    };
  }

  render() {
    const {handleDetail, addToCart, openModal} = this.props;
    const products = _.map(this.props.products, (product) => {
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
          <Title name='our' title='products' />
          <div className='row'>
            {products}
          </div>
        </div>
      </ProductWrapper>
    );
  }
}

const ProductWrapper = styled.section``;
