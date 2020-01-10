import _ from 'lodash';
import io from 'socket.io-client';
import React, {createElement} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import Loader from 'react-loader-advanced';
// Components
import ProductBrick from './components/product-brick';
import ProductDetails from './components/product-details';
import ProductCustomisation from './components/product-customization';
import ProductAvailability from './components/product-availability';
import ProductPayment from './components/product-payment';
import PaymentConfirmation from './components/payment-confirmation';
import Default from './components/Default';
import LoadingSpinner from './components/loading-spinner';
import AppBarMain from './components/app-bar-main';
import AppBarProgress from './components/app-bar-product';
import AppDialog from './components/app-dialog';
// Libs
import helper from '../lib/helper';
import ProductHelper from '../lib/product-helper';
import CONSTANT from '../lib/constants';
// Stylesheets
import '../public/App.css';
import '../public/bootstrap.min.css';
// Variables
const {Global, TravelPackage, User, Payment, Modal} = CONSTANT.get();
const PackageStatus = TravelPackage.status;
const UserSource = User.Source;

let socket;

class App extends React.Component {
  constructor(props) {
    super(props);

    // Socket actions
    this.pushToRemote = this.pushToRemote.bind(this);
    this.handleRefreshAllProducts = this.handleRefreshAllProducts.bind(this);
    this.handleGetDetails = this.handleGetDetails.bind(this);
    this.handleGetCustomise = this.handleGetCustomise.bind(this);
    this.handleGetAvailability = this.handleGetAvailability.bind(this);
    this.handleGetCheckout = this.handleGetCheckout.bind(this);
    this.handleGetPaid = this.handleGetPaid.bind(this);
    // Component Display Handlers
    this.renderList = this.renderList.bind(this);
    this.renderDetails = this.renderDetails.bind(this);
    this.renderAvailability = this.renderAvailability.bind(this);
    this.renderCustomisation = this.renderCustomisation.bind(this);
    this.renderCheckout = this.renderCheckout.bind(this);
    this.renderConfirmation = this.renderConfirmation.bind(this);
    this.renderDefault = this.renderDefault.bind(this);
    // Page actions
    this.actionGetProduct = this.actionGetProduct.bind(this);
    this.actionGetAvailability = this.actionGetAvailability.bind(this);
    this.actionCustomise = this.actionCustomise.bind(this);
    this.actionCheckout = this.actionCheckout.bind(this);
    this.actionPaid = this.actionPaid.bind(this);
    this.goHome = this.goHome.bind(this);
    this.actionGoBack = this.actionGoBack.bind(this);
    this.modalOpenSignIn = this.modalOpenSignIn.bind(this);
    this.modalOpenSignOpen = this.modalOpenSignOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    // Helpers
    this.findProduct = this.findProduct.bind(this);
    this.getInstance = this.getInstance.bind(this);

    this.state = {
      instId: props.instId || '',
      updating: false,
      socketStatus: '',
      isOpenDialogShare: false,
      modalType: '',
      modalRef: null,
      products: [],
      selectedProduct: null,
      cart: null,
      user: {
        name: '',
        loginId: Global.anonymousUser,
        profilePic: '',
        contactNumber: '',
        email: '',
        currency: Payment.currency,
        source: UserSource.WEB,
      },
      reference: {
        payment: {
          paypalEnv: this.props.paypalEnv,
          paypalId: this.props.paypalId,
          paypalIdDummy: this.props.paypalIdDummy,
          amountDeposit: this.props.amountDeposit,
        },
        hotels: {},
        attractions: {},
      },
      isOwner: true,
    };
  }

  /* ----------  Helper Methods  ---------- */
  getInstance(params) {
    // params: {extra, product}
    return helper.getInstance(params);
  }
  findProduct(id) {
    return helper.findProductById(id, this.state.products);
  }

  /* ----------  Communicate with Server  ---------- */
  pushToRemote(channel, message) {
    console.log(`>>>>Push event[${channel}] with message`, message);
    this.setState({updating: true}); // Set the updating spinner
    socket.emit(`push:${channel}`, message, (status) => {
      // Finished successfully with a special 'ok' message from socket server
      if (status !== 'ok') {
        console.error(`Problem pushing to ${channel}`, JSON.stringify(message));
        this.setState({updating: false}); // Turn spinner off
      }
    });
  }
  /* =========== Socket Event Handlers ============ */
  handleRefreshAllProducts(resp) {
    console.log('>>>>App.handleRefreshAllProducts', resp);
    this.setState({
      products: resp.packages,
      selectedProduct: null,
      updating: false,
    });
  }
  handleGetDetails(resp) {
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
  handleGetAvailability(resp) {
    console.log('>>>>App.handleGetAvailability', resp);
    const selectedProduct = this.state.selectedProduct;
    this.setState({
      selectedProduct: {...selectedProduct, rates: resp},
      updating: false,
    });
  }
  handleGetCustomise(resp) {
    console.log('>>>>App.handleGetCustomise', resp);
    this.setState({
      cart: resp,
      updating: false,
    });
  }
  handleGetCheckout(resp) {
    console.log('>>>>App.handleGetCheckout', resp);
    this.setState({
      cart: resp,
      updating: false,
    });
  }
  handleGetPaid(resp) {
    console.log('>>>>App.handleGetPaid', resp);
    // Go to purchase confirmation page
    this.props.history.push('/booking/confirmation');
    this.setState({
      cart: {...this.state.cart, status: resp.status},
      updating: false,
    });
  }
  /* ============ Component Action Handler ============*/
  modalOpenSignIn() {
    const {user} = this.state;
    console.log('>>>>App.modalOpenSignIn', {user});
    this.setState({
      modalType: Modal.USER_LOGIN.key,
      modalRef: null,
    });
  }
  modalOpenSignOpen() {
    const {user} = this.state;
    console.log('>>>>App.modalOpenSignOpen', {user});
    this.setState({
      modalType: Modal.USER_SIGNUP.key,
      modalRef: null,
    });
  }
  modalClose() {
    const {user} = this.state;
    console.log('>>>>App.modalClose', {user});
    this.setState({
      modalType: '',
      modalRef: null,
    });
  }
  handleSignIn(resp) {
    console.log('>>>>App.handleSignIn', resp);
    const user = {
      name: resp.name,
      loginId: resp.userID,
      currency: Payment.currency,
      source: UserSource.FACEBOOK,
    };
    this.setState({user: user});
  }
  handleSignUp(resp) {
    console.log('>>>>App.handleSignIn', resp);
  }
  actionGetProduct(id) {
    const params = {id: id, isCustomisable: false};
    this.pushToRemote('product:get', params);
  }
  actionGetAvailability(params) {
    this.pushToRemote('rate:getByProduct', params);
  }
  actionCustomise(params) {
    const inst = this.getInstance(params);
    this.pushToRemote('product:customise', inst);
  }
  actionCheckout(params) {
    const inst = this.getInstance(params);
    this.pushToRemote('product:checkout', inst);
  }
  actionPaid(params) {
    this.pushToRemote('product:paid', params);
  }
  goHome() {
    this.setState({
      products: [],
      selectedProduct: null,
      cart: null,
    });
    const params = {isSnapshot: true, status: PackageStatus.PUBLISHED};
    this.pushToRemote('product:filter', params);
  }
  actionGoBack() {
    console.log('>>>>Triggered App.actionGoBack');
    this.props.history.goBack();
  }
  /* ============ Component Display Handler ============*/
  renderList() {
    const {products, user, modalType} = this.state;
    const barActions = {
      goHome: this.goHome,
      signIn: this.modalOpenSignIn,
      signUp: this.modalOpenSignOpen,
    };
    const modalActions = {
      close: this.modalClose,
      signIn: this.handleSignIn,
      signUp: this.handleSignUp,
    };
    const divBricks =
      products && products.length > 0 ? (
        _.map(products, (p) => {
          return (
            <ProductBrick
              key={p.name}
              product={p}
              actionGetProduct={this.actionGetProduct}
            />
          );
        })
      ) : (
        <div style={{height: 600}} />
      );
    return (
      <div>
        <AppBarMain user={user} actions={barActions} />
        <div style={{height: 70}} />
        {divBricks}
        <AppDialog
          open={!!modalType}
          actions={modalActions}
          model={modalType}
        />
      </div>
    );
  }
  renderDetails(matcher) {
    console.log('>>>>Route.renderDetails()', matcher);
    const pid = matcher.match.params.pid;
    const product = this.state.selectedProduct;
    const tmpProduct = ProductHelper.findProductById(pid, this.state.products);
    const divDetails = product ? (
      <ProductDetails
        isOwner={this.state.isOwner}
        user={this.state.user}
        product={this.state.selectedProduct}
        actionGetAvailability={this.actionGetAvailability}
        actionCustomise={this.actionCustomise}
      />
    ) : (
      <div style={{height: 600}} />
    );
    const divProgressBar = (
      <AppBarProgress
        step={''}
        product={tmpProduct}
        isOwner={this.state.isOwner}
        actionGoBack={this.actionGoBack}
      />
    );
    return (
      <div>
        {divProgressBar}
        <div style={{height: 70}} />
        {divDetails}
      </div>
    );
  }
  renderCustomisation(matcher) {
    console.log('>>>>Route.renderCustomisation()', matcher);
    const product = this.state.selectedProduct;
    const divCustomisation = this.state.cart ? (
      <ProductCustomisation
        product={product}
        cart={this.state.cart}
        user={this.state.user}
        isOwner={this.state.isOwner}
        reference={this.state.reference}
        actionGetAvailability={this.actionGetAvailability}
      />
    ) : (
      <div style={{height: 600}} />
    );
    const divProgressBar = (
      <AppBarProgress
        step={''}
        product={product}
        isOwner={this.state.isOwner}
        actionGoBack={this.actionGoBack}
      />
    );
    return (
      <div>
        {divProgressBar}
        {divCustomisation}
      </div>
    );
  }
  renderAvailability(matcher) {
    console.log('>>>>Route.renderAvailability()', matcher);
    const product = this.state.selectedProduct;
    const divAvailability =
      product && product.rates ? (
        <ProductAvailability
          isOwner={this.state.isOwner}
          product={product}
          user={this.state.user}
          actionCheckout={this.actionCheckout}
        />
      ) : (
        <div style={{height: 600}} />
      );
    const divProgressBar = (
      <AppBarProgress
        step={''}
        product={product}
        isOwner={this.state.isOwner}
        actionGoBack={this.actionGoBack}
      />
    );
    return (
      <div>
        {divProgressBar}
        {divAvailability}
      </div>
    );
  }
  renderCheckout() {
    console.log('>>>>Route.renderCheckout()');
    const product = this.state.selectedProduct;
    const divCheckout = this.state.cart ? (
      <ProductPayment
        product={product}
        user={this.state.user}
        cart={this.state.cart}
        reference={this.state.reference}
        actionPaid={this.actionPaid}
      />
    ) : (
      <div style={{height: 600}} />
    );
    const divProgressBar = (
      <AppBarProgress
        step={''}
        product={product}
        isOwner={this.state.isOwner}
        actionGoBack={this.actionGoBack}
      />
    );
    return (
      <div>
        {divProgressBar}
        {divCheckout}
      </div>
    );
  }
  renderConfirmation() {
    console.log('>>>>Route.renderConfirmation()');
    const status = this.state.cart.status;
    const {user, selectedProduct, cart} = this.state;
    const actions = {
      goHome: this.goHome,
    };
    const divConfirmation =
      status === helper.vars.statusDepositPaid ||
      status === helper.vars.statusFullyPaid ? (
        <PaymentConfirmation
          user={user}
          product={selectedProduct}
          cart={cart}
          actionGoHome={this.goHome}
        />
      ) : (
        <div style={{height: 600}} />
      );

    return (
      <div>
        <AppBarMain user={user} actions={actions} />
        {divConfirmation}
      </div>
    );
  }
  renderDefault() {
    return <Default />;
  }

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(this.props.socketAddress, {
      reconnect: true,
      secure: true,
    });

    // Add socket event handlers.
    socket.on('product:refreshAll', (res) => {
      this.handleRefreshAllProducts(res);
    });
    socket.on('product:get', (res) => {
      this.handleGetDetails(res);
    });
    socket.on('product:customise', (res) => {
      this.handleGetCustomise(res);
    });
    socket.on('product:checkout', (res) => {
      this.handleGetCheckout(res);
    });
    socket.on('product:paid', (res) => {
      this.handleGetPaid(res);
    });
    socket.on('rate:getByProduct', (res) => {
      this.handleGetAvailability(res);
    });

    // Retrieve published packages
    const params = {isSnapshot: true, status: PackageStatus.PUBLISHED};
    this.pushToRemote('product:filter', params);
  }

  render() {
    const spinner = <LoadingSpinner loading={this.state.updating} />;
    return (
      <Loader
        show={this.state.updating}
        message={spinner}
        foregroundStyle={{color: 'white'}}
        backgroundStyle={{backgroundColor: 'white'}}
      >
        <Switch>
          <Route exact path='/' component={this.renderList} />
          <Route path='/product/:pid' component={this.renderDetails} />
          <Route
            path='/booking/diy/:pid'
            component={this.renderCustomisation}
          />
          <Route
            path='/booking/availability/:pid'
            component={this.renderAvailability}
          />
          <Route path='/booking/payment' component={this.renderCheckout} />
          <Route
            path='/booking/confirmation'
            component={this.renderConfirmation}
          />
          <Route component={this.renderDefault} />
        </Switch>
      </Loader>
    );
  }
}

export default withRouter(App);
