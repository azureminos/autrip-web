import io from 'socket.io-client';
import _ from 'lodash';
import React, { Component, createElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from 'react-loader-advanced';
// Components
import Navbar from './components/Navbar';
import ProductBrick from './components/product-brick';
import ProductDetails from './components/product-details';
import ProductList from './components/ProductList';
import Details from './components/Details';
import Default from './components/Default';
import Cart from './components/Cart';
import Modal from './components/Modal';
import LoadingSpinner from './components/loading-spinner';
// Stylesheets
import '../public/App.css';
import '../public/bootstrap.min.css';

let socket;

export default class App extends Component {
	constructor (props) {
		super(props);

		// Socket actions
		this.pushToRemote = this.pushToRemote.bind(this);
		this.handleGetPackageDetails = this.handleGetPackageDetails.bind(this);
		this.handleRefreshAllPackages = this.handleRefreshAllPackages.bind(this);
		// Page actions
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
		this.getProductDetails = this.getProductDetails.bind(this);
		this.getCart = this.getCart.bind(this);
		this.getDefault = this.getDefault.bind(this);

		this.state = {
			products: [],
			selectedProduct: null,
			modalOpen: false,
			modalProduct: null,
			cart: [],
			cartSubTotal: 0,
			cartTax: 0,
			cartTotal: 0,
			updating: false,
		};
	}

	/* ==============================
     = Helper Methods             =
     ============================== */
	handleDetail (id) {
		const params = { id: id, isCustomisable: false };
		this.pushToRemote('package:get', params);
	}
	getItem (id) {
		const product = this.state.products.find(item => item.id === id);
		return product;
	}
	getTotals () {
		let subTotal = 0;
		this.state.cart.map(item => (subTotal += item.total));
		const tempTax = subTotal * 0.1;
		const tax = parseFloat(tempTax.toFixed(2));
		const total = subTotal + tax;
		return {
			subTotal,
			tax,
			total,
		};
	}
	addTotals () {
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
				// console.log(this.state);
			}
		);
	}
	addToCart (id) {
		const tempProducts = [...this.state.products];
		const index = tempProducts.indexOf(this.getItem(id));
		const product = tempProducts[index];
		product.inCart = true;
		product.count = 1;
		const price = product.startingRate;
		product.total = price;

		this.setState(() => {
			return {
				products: [...tempProducts],
				cart: [product],
				selectedProduct: { ...product },
			};
		}, this.addTotals);
	}
	openModal (id) {
		console.log(`>>>>App.openModal >> Product ID[${id}]`, this.getItem(id));
		const product = this.getItem(id);
		this.setState({ modalProduct: product, modalOpen: true });
	}
	closeModal () {
		this.setState(() => {
			return { modalOpen: false };
		});
	}
	increment (id) {
		const tempCart = [...this.state.cart];
		const selectedProduct = tempCart.find(item => {
			return item.id === id;
		});
		const index = tempCart.indexOf(selectedProduct);
		const product = tempCart[index];
		product.count = product.count + 1;
		product.total = product.count * product.startingRate;
		this.setState(() => {
			return {
				cart: [...tempCart],
			};
		}, this.addTotals);
	}
	decrement (id) {
		const tempCart = [...this.state.cart];
		const selectedProduct = tempCart.find(item => {
			return item.id === id;
		});
		const index = tempCart.indexOf(selectedProduct);
		const product = tempCart[index];
		product.count = product.count - 1;
		if (product.count === 0) {
			this.removeItem(id);
		} else {
			product.total = product.count * product.startingRate;
			this.setState(() => {
				return { cart: [...tempCart] };
			}, this.addTotals);
		}
	}
	removeItem (id) {
		const tempProducts = [...this.state.products];
		let tempCart = [...this.state.cart];

		const index = tempProducts.indexOf(this.getItem(id));
		const removedProduct = tempProducts[index];
		removedProduct.inCart = false;
		removedProduct.count = 0;
		removedProduct.total = 0;

		tempCart = tempCart.filter(item => {
			return item.id !== id;
		});

		this.setState(() => {
			return {
				cart: [...tempCart],
				products: [...tempProducts],
			};
		}, this.addTotals);
	}
	clearCart () {
		this.setState(
			() => {
				return { cart: [] };
			},
			() => {
				this.addTotals();
			}
		);
	}

	/* ----------  Communicate with Server  ---------- */
	pushToRemote (channel, message) {
		console.log(`>>>>Push event[${channel}] with message`, message);
		this.setState({ updating: true }); // Set the updating spinner
		socket.emit(`push:${channel}`, message, status => {
			// Finished successfully with a special 'ok' message from socket server
			if (status !== 'ok') {
				console.error(`Problem pushing to ${channel}`, JSON.stringify(message));
				this.setState({ updating: false }); // Turn spinner off
			}
		});
	}
	/* ==============================
     = Socket Event Handlers       =
     ============================== */
	handleRefreshAllPackages (resp) {
		console.log('>>>>App.handleRefreshAllPackages', resp);
		this.setState({
			products: resp.packages,
			selectedProduct: null,
			updating: false,
		});
	}
	handleGetPackageDetails (resp) {
		console.log('>>>>App.handleGetPackageDetails', resp);
		this.setState({
			selectedProduct: { ...resp.packageSummary, items: resp.packageItems },
			updating: false,
		});
	}

	/* ==============================
     = Components                 =
     ==============================*/
	getProductList () {
		const products = this.state.products;
		const bricks = _.map(products, p => {
			return (
				<ProductBrick
					key={p.name}
					product={p}
					handleDetail={this.handleDetail}
				/>
			);
		});
		return <div>{bricks}</div>;
	}
	getProductDetails () {
		console.log('>>>>Route.getProductDetails()');
		if (this.state.selectedProduct) {
			return <ProductDetails product={this.state.selectedProduct} />;
		}
		return <div />;
	}
	getCart () {
		if (this.state.cart) {
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
		return <div />;
	}
	getDefault () {
		return <Default />;
	}

	componentWillMount () {
		// Connect to socket.
		socket = io.connect(this.props.socketAddress, {
			reconnect: true,
			secure: true,
		});

		// Add socket event handlers.
		socket.on('package:refreshAll', res => {
			this.handleRefreshAllPackages(res);
		});
		socket.on('package:get', res => {
			this.handleGetPackageDetails(res);
		});

		// Retrieve published packages
		var params = { state: 'Published' };
		console.log('>>>>App Client >> getFilteredPackages', params);
		this.pushToRemote('package:filter', params);
	}

	render () {
		const modal
			= this.state.modalProduct && this.state.modalOpen ? (
				<Modal
					modalProduct={this.state.modalProduct}
					modalOpen={this.state.modalOpen}
					closeModal={this.closeModal}
				/>
			) : (
				<div />
			);
		const spinner = <LoadingSpinner loading={this.state.updating} />;

		return (
			<Loader
				show={this.state.updating}
				message={spinner}
				foregroundStyle={{ color: 'white' }}
				backgroundStyle={{ backgroundColor: 'white' }}
			>
				<Navbar />
				<Switch>
					<Route exact path="/" component={this.getProductList} />
					<Route path="/product" component={this.getProductDetails} />
					<Route path="/cart" component={this.getCart} />
					<Route component={this.getDefault} />
				</Switch>
				{modal}
			</Loader>
		);
	}
}
