import _ from 'lodash';
import io from 'socket.io-client';
import React, {createElement} from 'react';
// Components
import {withStyles} from '@material-ui/core/styles';
import AppBarMain from './components/app-bar-main';
import AppDialog from './components/app-dialog';
import InvalidPage from './invalid-page';
import TravelPackageCard from './components/travel-package-card-v2';
import PackageItinerary from './components/package-itinerary';
// Libs
import Helper from '../lib/helper';
import PackageHelper from '../lib/package-helper';
import CONSTANT from '../lib/constants';
// Stylesheets
// import '../public/bootstrap.min.css';
// import 'swiper/css/swiper.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../public/App.css';

// Variables
let socket;
const {Global, TravelPackage, User, Payment, Modal, Instance} = CONSTANT.get();
const PackageStatus = TravelPackage.status;
const InstanceStatus = Instance.status;
const UserSource = User.Source;
const styles = (theme) => ({
  emptyHeader: {
    height: 70,
  },
  emptyFooter: {
    height: 70,
  },
  body: {
    width: Global.DesktopView.contentWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  content: {
    paddingLeft: 75,
    paddingRight: 75,
    paddingBottom: 15,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);

    // Socket actions
    this.pushToRemote = this.pushToRemote.bind(this);
    this.showAll = this.showAll.bind(this);
    this.init = this.init.bind(this);
    // Component Display Handlers
    this.renderList = this.renderList.bind(this);
    this.renderDetails = this.renderDetails.bind(this);
    this.renderPayment = this.renderPayment.bind(this);
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
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleViewDetails = this.handleViewDetails.bind(this);
    // Helpers
    this.findProduct = this.findProduct.bind(this);
    this.getInstance = this.getInstance.bind(this);

    this.state = {
      updating: false,
      stage: '',
      user: {
        id: Global.anonymousUser,
        name: '',
        loginId: '',
        profilePic: '',
        contactNumber: '',
        email: '',
        currency: Payment.currency,
        source: UserSource.WEB,
      },
      message: '',
      daySelected: null,
      modalType: '',
      modalRef: null,
      rates: null,
      travelPackages: [],
      instPackage: null,
      instPackageExt: null,
      reference: {
        cities: null,
        packageSummary: null,
      },
    };
  }

  /* ----------  Helper Methods  ---------- */
  getInstance(params) {
    // params: {extra, product}
    return Helper.getInstance(params);
  }
  findProduct(id) {
    return Helper.findProductById(id, this.state.products);
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
  showAll(resp) {
    console.log('>>>>Result from socket [package:showAll]', resp);
    this.setState({
      updating: false,
      stage: '',
      travelPackages: resp,
      instPackage: null,
      instPackageExt: null,
      rates: null,
    });
  }
  init(results) {
    console.log('>>>>Result from socket [init]', results);
    const {
      instance,
      packageSummary,
      cities,
      packageRates,
      flightRates,
    } = results;
    const reference = {packageSummary, cities};
    const carRates = _.map(cities, (c) => {
      return {
        id: c.id || '',
        name: c.name || '',
        carRates: c.carRates || [],
      };
    });
    const rates = {carRates, packageRates, flightRates};
    const instItems = _.map(instance.items, (item) => {
      if (item.attraction) {
        const match = Helper.findAttractionById(item.attraction, cities);
        item.attraction = match;
      }
      return item;
    });
    const instHotels = _.map(instance.hotels, (hotel) => {
      if (hotel.hotel) {
        const match = Helper.findHotelById(hotel.hotel, cities);
        hotel.hotel = match;
      }
      return hotel;
    });
    const instPackage = {
      ...instance,
      isCustomisable: packageSummary.isCustomisable,
      items: instItems,
      hotels: instHotels,
    };
    const instPackageExt = PackageHelper.enhanceInstance({
      userId: this.props.viewerId,
      instPackage: instPackage,
      rates: rates,
    });
    const matchingRates = PackageHelper.doRating({
      instPackage: instPackage,
      instPackageExt: instPackageExt,
      rates: rates,
    });

    this.setState({
      updating: false, // Turn spinner off
      travelPackages: [],
      instPackage: instPackage,
      instPackageExt: {...instPackageExt, ...matchingRates},
      reference,
      rates,
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
    this.setState({user: user, modalType: '', modalRef: null});
  }
  handleSignUp(resp) {
    console.log('>>>>App.handleSignUp', resp);
  }
  handleSignOut(resp) {
    console.log('>>>>App.handleSignOut', resp);
    const user = {
      id: Global.anonymousUser,
      name: '',
      loginId: '',
      profilePic: '',
      contactNumber: '',
      email: '',
      currency: Payment.currency,
      source: UserSource.WEB,
    };
    this.setState({user: user, modalType: '', modalRef: null});
  }
  handleViewDetails(p) {
    console.log('>>>>App.handleViewDetails', p);
    const {user} = this.state;
    this.pushToRemote('package:view', {
      packageId: p.id,
      senderId: user.id,
    });
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
    this.pushToRemote('package:filter', params);
  }
  actionGoBack() {
    console.log('>>>>Triggered App.actionGoBack');
    this.props.history.goBack();
  }
  /* ============ Component Display Handler ============*/
  renderList() {
    // Function Variables
    const {travelPackages, user, modalType} = this.state;
    const {classes} = this.props;
    const headerActions = {
      goHome: this.goHome,
      signIn: this.modalOpenSignIn,
      signUp: this.modalOpenSignOpen,
      signOut: this.handleSignOut,
    };
    const modalActions = {
      close: this.modalClose,
      signIn: this.handleSignIn,
      signUp: this.handleSignUp,
    };
    const cardActions = {
      viewDetails: this.handleViewDetails,
    };
    // Sub Components
    const divTravelPackages = _.map(travelPackages, (p) => {
      return (
        <div key={p.name} className={classes.content}>
          <TravelPackageCard travelPackage={p} actions={cardActions} />
        </div>
      );
    });
    // Display Widget
    return (
      <div className={classes.body}>
        <AppBarMain user={user} actions={headerActions} />
        <div className={classes.emptyHeader} />
        {divTravelPackages}
        <div className={classes.emptyFooter} />
        <AppDialog actions={modalActions} model={modalType} />
      </div>
    );
  }
  renderDetails() {
    console.log('>>>>MobileApp.render', this.state);
    // Function Variables
    const {updating, modalType, modalRef, reference} = this.state;
    const {instPackage, instPackageExt, rates, user} = this.state;
    const {cities, packageSummary} = reference;
    const {classes} = this.props;
    const headerActions = {
      goHome: this.goHome,
      signIn: this.modalOpenSignIn,
      signUp: this.modalOpenSignOpen,
      signOut: this.handleSignOut,
    };
    const itineraryActions = {
      handlePeople: this.handleHdPeopleChange,
      handleRoom: this.handleHdRoomChange,
      handleShare: this.handleFtBtnShare,
      handlePayment: this.confirmSubmitPayment,
      handleSelectHotel: this.handleSelectHotel,
      handleSelectFlight: this.handleSelectFlight,
      handleSelectCar: this.handleSelectCar,
      handleLikeAttraction: this.handleLikeAttraction,
      handleAddItinerary: this.confirmAddItinerary,
      handleDeleteItinerary: this.confirmDeleteItinerary,
    };
    const modalActions = {
      handleClose: this.handleModalClose,
      handleDeleteItinerary: this.handleDeleteItinerary,
      handleAddItinerary: this.handleAddItinerary,
      handlePayment: this.handleFtBtnPayment,
      handleCustomise: this.enablePackageDiy,
    };
    // Sub Components
    const dialog = modalType ? (
      <AppDialog
        model={modalType}
        actions={modalActions}
        reference={modalRef}
      />
    ) : (
      ''
    );
    // Display Widget
    return (
      <div className={classes.body}>
        <AppBarMain user={user} actions={headerActions} />
        <div className={classes.emptyHeader} />
        <PackageItinerary
          updating={updating}
          instPackage={instPackage}
          instPackageExt={instPackageExt}
          rates={rates}
          cities={cities}
          packageSummary={packageSummary}
          actions={itineraryActions}
          contentWidth={Global.DesktopView.contentWidth}
        />
        {dialog}
      </div>
    );
  }
  renderPayment() {
    return <div />;
  }
  renderConfirmation() {
    return <div />;
  }
  renderDefault() {
    return <InvalidPage />;
  }

  componentWillMount() {
    // Connect to socket.
    socket = io.connect(this.props.socketAddress, {
      reconnect: true,
      secure: true,
    });
    // Add socket event handlers.
    socket.on('disconnect', () => {
      console.log('>>>>Socket.disconnect');
    });
    socket.on('reconnect', () => {
      console.log('>>>>Socket.reconnect');
    });
    socket.on('package:showAll', this.showAll);
    socket.on('init', this.init);
    // Initialization
    const {user} = this.state;
    const {instId, packageId} = this.props;
    console.log('>>>>componentWillMount', {user, instId, packageId});
    if (!instId && !packageId) {
      this.pushToRemote('package:showAll', {senderId: user.id});
    } else if (!instId && packageId) {
      this.pushToRemote('package:view', {
        packageId: packageId,
        senderId: user.id,
      });
    } else if (instId) {
      this.pushToRemote('instance:view', {
        instId: instId,
        senderId: user.id,
      });
    }
  }

  render() {
    const {stage, instPackage, travelPackages} = this.state;
    if (stage === '') {
      if (!travelPackages || travelPackages.length === 0) {
        if (instPackage) {
          return this.renderDetails();
        }
        return <div>Loading...</div>;
      }
      return this.renderList();
    } else if (stage === InstanceStatus.IN_PROGRESS) {
      this.renderDetails();
    } else if (stage === InstanceStatus.PENDING_PAYMENT) {
      this.renderPayment();
    }
    return this.renderDefault();
  }
}

export default withStyles(styles, {withTheme: true})(App);
