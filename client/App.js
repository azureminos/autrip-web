import React, {Component, createElement} from 'react';
import {Route, Switch} from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Details from './components/Details';
import Default from './components/Default';
import Cart from './components/Cart';
import Modal from './components/Modal';

import '../public/App.css';
import '../public/bootstrap.min.css';

const storeProducts = [
  {
    id: 1,
    title: 'Google Pixel - Black',
    img: 'img/product-1.png',
    price: 10,
    company: 'GOOGLE',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 2,
    title: 'Samsung S7',
    img: 'img/product-2.png',
    price: 16,
    company: 'SAMSUNG',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 3,
    title: 'HTC 10 - Black',
    img: 'img/product-3.png',
    price: 8,
    company: 'htc',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 4,
    title: 'HTC 10 - White',
    img: 'img/product-4.png',
    price: 18,
    company: 'htc',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 5,
    title: 'HTC Desire 626s',
    img: 'img/product-5.png',
    price: 24,
    company: 'htc',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 6,
    title: 'Vintage Iphone',
    img: 'img/product-6.png',
    price: 17,
    company: 'apple',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 7,
    title: 'Iphone 7',
    img: 'img/product-7.png',
    price: 30,
    company: 'apple',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
  {
    id: 8,
    title: 'Smashed Iphone',
    img: 'img/product-8.png',
    price: 2,
    company: 'apple',
    info:
      'Lorem ipsum dolor amet offal butcher quinoa sustainable gastropub, echo park actually green juice sriracha paleo. Brooklyn sriracha semiotics, DIY coloring book mixtape craft beer sartorial hella blue bottle. Tote bag wolf authentic try-hard put a bird on it mumblecore. Unicorn lumbersexual master cleanse blog hella VHS, vaporware sartorial church-key cardigan single-origin coffee lo-fi organic asymmetrical. Taxidermy semiotics celiac stumptown scenester normcore, ethical helvetica photo booth gentrify.',
    inCart: false,
    count: 0,
    total: 0,
  },
];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleDetail = this.handleDetail.bind(this);
    this.getItem = this.getItem.bind(this);
    this.getTotals = this.getTotals.bind(this);
    this.addTotals = this.addTotals.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.clearCart = this.clearCart.bind(this);
    this.getProductList = this.getProductList.bind(this);
    this.getDetails = this.getDetails.bind(this);
    this.getCart = this.getCart.bind(this);
    this.getDefault = this.getDefault.bind(this);

    this.state = {
      products: storeProducts,
      detailProduct: null,
      cart: [],
      modalOpen: false,
      modalProduct: null,
      cartSubTotal: 0,
      cartTax: 0,
      cartTotal: 0,
      updating: false,
    };
  }

  /* ==============================
     = Helper Methods             =
     ============================== */
  handleDetail(id) {
    const product = this.getItem(id);
    this.setState(() => {
      return {detailProduct: product};
    });
  }
  getItem(id) {
    const product = this.state.products.find((item) => item.id === id);
    return product;
  }
  getTotals() {
    let subTotal = 0;
    this.state.cart.map((item) => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    return {
      subTotal,
      tax,
      total,
    };
  }
  addTotals() {
    const totals = this.getTotals();
    this.setState(
      () => {
        return {
          cartSubTotal: totals.subTotal,
          cartTax: totals.tax,
          cartTotal: totals.total,
        };
      },
      () => {
        console.log(this.state);
      }
    );
  }
  addToCart(id) {
    const tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;

    this.setState(() => {
      return {
        products: [...tempProducts],
        cart: [...this.state.cart, product],
        detailProduct: {...product},
      };
    }, this.addTotals);
  }
  openModal(id) {
    const product = this.getItem(id);
    this.setState(() => {
      return {modalProduct: product, modalOpen: true};
    });
  }
  closeModal() {
    this.setState(() => {
      return {modalOpen: false};
    });
  }
  increment(id) {
    const tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((item) => {
      return item.id === id;
    });
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.price;
    this.setState(() => {
      return {
        cart: [...tempCart],
      };
    }, this.addTotals);
  }
  decrement(id) {
    const tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((item) => {
      return item.id === id;
    });
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState(() => {
        return {cart: [...tempCart]};
      }, this.addTotals);
    }
  }
  removeItem(id) {
    const tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    const index = tempProducts.indexOf(this.getItem(id));
    const removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    tempCart = tempCart.filter((item) => {
      return item.id !== id;
    });

    this.setState(() => {
      return {
        cart: [...tempCart],
        products: [...tempProducts],
      };
    }, this.addTotals);
  }
  clearCart() {
    this.setState(
      () => {
        return {cart: []};
      },
      () => {
        this.addTotals();
      }
    );
  }

  /* ==============================
     = Components                 =
     ==============================*/
  getProductList() {
    return (
      <ProductList
        products={this.state.products}
        handleDetail={this.handleDetail}
        addToCart={this.addToCart}
        openModal={this.openModal}
      />
    );
  }
  getDetails() {
    return (
      <Details
        detailProduct={this.state.detailProduct}
        addToCart={this.addToCart}
        openModal={this.openModal}
      />
    );
  }
  getCart() {
    return (
      <Cart
        cart={this.state.cart}
        cartSubTotal={this.state.cartSubTotal}
        cartTax={this.state.cartTax}
        cartTotal={this.state.cartTotal}
        increment={this.increment}
        decrement={this.decrement}
        removeItem={this.removeItem}
        clearCart={this.clearCart}
        history={[]}
      />
    );
  }
  getDefault() {
    return <Default />;
  }

  render() {
    const modal = this.state.modalProduct
      ? (
          <Modal
            modalProduct={this.state.modalProduct}
            modalOpen={this.modalOpen}
            closeModal={this.closeModal}
          />
        )
      : (<div/>);

    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path='/' component={this.getProductList} />
          <Route path='/details' component={this.getDetails} />
          <Route path='/cart' component={this.getCart} />
          <Route component={this.getDefault} />
        </Switch>
        {modal}
      </div>
    );
  }
}
