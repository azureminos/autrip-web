import io from 'socket.io-client';
import _ from 'lodash';
import React, { Component, createElement } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from 'react-loader-advanced';
// Components
import Navbar from './components/Navbar';
import ProductBrick from './components/product-brick';
import ProductDetails from './components/product-details';
import ProductAvailability from './components/product-availability';
import ProductPayment from './components/product-payment';
import Default from './components/Default';
import LoadingSpinner from './components/loading-spinner';
// Stylesheets
import '../public/App.css';
import '../public/bootstrap.min.css';
import helper from '../lib/helper';

let socket;

export default class App extends Component {
	constructor (props) {
		super(props);

		// Socket actions
		this.pushToRemote = this.pushToRemote.bind(this);
		this.handleRefreshAllProducts = this.handleRefreshAllProducts.bind(this);
		this.handleGetDetails = this.handleGetDetails.bind(this);
		this.handleGetAvailability = this.handleGetAvailability.bind(this);
		this.handleGetCheckout = this.handleGetCheckout.bind(this);
		// Component Display Handlers
		this.renderList = this.renderList.bind(this);
		this.renderDetails = this.renderDetails.bind(this);
		this.renderAvailability = this.renderAvailability.bind(this);
		this.renderCheckout = this.renderCheckout.bind(this);
		this.renderDefault = this.renderDefault.bind(this);
		// Page actions
		this.actionGetProduct = this.actionGetProduct.bind(this);
		this.actionGetAvailability = this.actionGetAvailability.bind(this);
		this.actionCheckout = this.actionCheckout.bind(this);
		// Helpers
		this.findProduct = this.findProduct.bind(this);
		this.initInstance = this.initInstance.bind(this);

		this.state = {
			products: [],
			selectedProduct: null,
			cart: null,
			user: {
				firstName: 'David',
				lastName: 'Xia',
				fullName: 'David Xia',
				loginId: 'David Xia',
				mobile: '0410562699',
				email: 'david.xia83@gmail.com',
				location: 'Australia',
				currency: 'AUD',
				source: 'email' // ['email', 'facebook', 'google']
			},
			isOwner: true,
			updating: false,
		};
	}

	/* ----------  Helper Methods  ---------- */
	initInstance (params) {
		// params: {extra, product}
		return helper.initInstance(params);
	}
	findProduct (id) {
		return helper.findProductById(id, this.state.products);
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
	/* =========== Socket Event Handlers ============ */
	handleRefreshAllProducts (resp) {
		console.log('>>>>App.handleRefreshAllProducts', resp);
		this.setState({
			products: resp.packages,
			selectedProduct: null,
			updating: false,
		});
	}
	handleGetDetails (resp) {
		console.log('>>>>App.handleGetDetails', resp);
		this.setState({
			selectedProduct: {
				...resp.packageSummary,
				items: resp.packageItems,
				hotels: resp.packageHotels,
			},
			updating: false,
		});
	}
	handleGetAvailability (resp) {
		console.log('>>>>App.handleGetAvailability', resp);
		const selectedProduct = this.state.selectedProduct;
		this.setState({
			selectedProduct: { ...selectedProduct, rates: resp },
			updating: false,
		});
	}
	handleGetCheckout (resp) {
		console.log('>>>>App.handleGetCheckout', resp);
		this.setState({
			cart: resp,
			updating: false,
		});
	}
	/* ============ Component Action Handler ============*/
	actionGetProduct (id) {
		const params = { id: id, isCustomisable: false };
		this.pushToRemote('product:get', params);
	}
	actionGetAvailability (params) {
		this.pushToRemote('rate:getByProduct', params);
	}
	actionCheckout (params) {
		const inst = this.initInstance(params);
		this.pushToRemote('product:checkout', inst);
	}
	/* ============ Component Display Handler ============*/
	renderList () {
		const products = this.state.products;
		const bricks = _.map(products, p => {
			return (
				<ProductBrick
					key={p.name}
					product={p}
					actionGetProduct={this.actionGetProduct}
				/>
			);
		});
		return <div>{bricks}</div>;
	}
	renderDetails (matcher) {
		console.log('>>>>Route.renderDetails()', matcher);
		if (this.state.selectedProduct) {
			return (
				<ProductDetails
					product={this.state.selectedProduct}
					actionGetAvailability={this.actionGetAvailability}
				/>
			);
		}
		return <div />;
	}
	renderAvailability (matcher) {
		console.log('>>>>Route.renderAvailability()', matcher);
		const product = this.state.selectedProduct;
		if (product && product.rates) {
			return (
				<ProductAvailability
					isOwner={this.state.isOwner}
					user={this.state.user}
					product={product}
					actionCheckout={this.actionCheckout}
				/>
			);
		}
		return '';
	}
	renderCheckout () {
		console.log('>>>>Route.renderCheckout()');
		if (this.state.cart) {
			return (
				<ProductPayment
					user={this.state.user}
					product={this.state.selectedProduct}
					cart={this.state.cart}
				/>
			);
		}
		return <div />;
	}
	renderDefault () {
		return <Default />;
	}

	componentWillMount () {
		// Connect to socket.
		socket = io.connect(this.props.socketAddress, {
			reconnect: true,
			secure: true,
		});

		// Add socket event handlers.
		socket.on('product:refreshAll', res => {
			this.handleRefreshAllProducts(res);
		});
		socket.on('product:get', res => {
			this.handleGetDetails(res);
		});
		socket.on('rate:getByProduct', res => {
			this.handleGetAvailability(res);
		});
		socket.on('product:checkout', res => {
			this.handleGetCheckout(res);
		});

		// Retrieve published packages
		var params = { state: 'Published' };
		console.log('>>>>App Client >> getFilteredPackages', params);
		this.pushToRemote('product:filter', params);
	}

	render () {
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
					<Route exact path="/" component={this.renderList} />
					<Route path="/product/:pid" component={this.renderDetails} />
					<Route
						path="/booking/availability/:pid"
						component={this.renderAvailability}
					/>
					<Route path="/booking/payment" component={this.renderCheckout} />
					<Route component={this.renderDefault} />
				</Switch>
			</Loader>
		);
	}
}
