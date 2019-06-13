import React, {Component, createElement} from 'react';
import Title from '../Title';
import CartColumns from './CartColumns';
import CartList from './CartList';
import CartTotals from './CartTotals';
import EmptyCart from './EmptyCart';

export default class Store extends Component {
  render() {
    const {cart, cartSubTotal, cartTax, cartTotal, history} = this.props;
    const {increment, decrement, removeItem, clearCart} = this.props;
    const dvCart = cart.length > 0 ?
      (
        <div>
          <Title name='your' title='cart' />
          <CartColumns />
          <CartList
            cart={cart}
            increment={increment}
            decrement={decrement}
            removeItem={removeItem}
          />
          <CartTotals
            cartSubTotal={cartSubTotal}
            cartTax={cartTax}
            cartTotal={cartTotal}
            clearCart={clearCart}
            cart={cart}
            history={history}
          />
        </div>
      ) :
      (<EmptyCart />);

    return (
      <section>
        {dvCart}
      </section>
    );
  }
}
