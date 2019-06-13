import React, {Component, createElement} from 'react';
import CartItem from './CartItem';

export default class CartList extends Component {
  render() {
    const {cart, increment, decrement, removeItem} = this.props;
    return (
      <div className='container-fluid'>
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            increment={increment}
            decrement={decrement}
            removeItem={removeItem}
          />
        ))}
      </div>
    );
  }
}
