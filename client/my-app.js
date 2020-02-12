import _ from 'lodash';
import Moment from 'moment';
import io from 'socket.io-client';
import React, {createElement} from 'react';
// Components
import {withStyles} from '@material-ui/core/styles';
import AppBarMain from './components/app-bar-main';
import AppDialog from './components/app-dialog';
import InvalidPage from './invalid-page';
import TravelPackageCard from './components/travel-package-card-v3';
import PackageItinerary from './components/package-itinerary';
// Libs
import Helper from '../lib/helper';
import PackageHelper from '../lib/package-helper';
import CONSTANT from '../lib/constants';
// Stylesheets
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
import 'react-multi-carousel/lib/styles.css';
import '../public/App.css';

// Variables
let socket;
const {Global, TravelPackage, User, Payment} = CONSTANT.get();
const {Modal, Instance, SocketChannel} = CONSTANT.get();
const PackageStatus = TravelPackage.status;
const InstanceStatus = Instance.status;
const SocketAction = SocketChannel.Action;
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
    this.modalOpenSignUp = this.modalOpenSignUp.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleViewDetails = this.handleViewDetails.bind(this);
    // Package Instance
    this.enablePackageDiy = this.enablePackageDiy.bind(this);
    this.handleLikeAttraction = this.handleLikeAttraction.bind(this);
    this.confirmAddItinerary = this.confirmAddItinerary.bind(this);
    this.handleAddItinerary = this.handleAddItinerary.bind(this);
    this.confirmDeleteItinerary = this.confirmDeleteItinerary.bind(this);
    this.handleDeleteItinerary = this.handleDeleteItinerary.bind(this);
    this.handleSelectHotel = this.handleSelectHotel.bind(this);
    this.handleSelectFlight = this.handleSelectFlight.bind(this);
    this.handleSelectCar = this.handleSelectCar.bind(this);
    this.handlePeopleChange = this.handlePeopleChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handlePaymentDone = this.handlePaymentDone.bind(this);

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
  /* =========== Socket Event Callback Handlers ============ */
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
  /* ============ Component Action Handlers ============*/
  // ------------  Common Action Handlers -------------
  modalClose() {
    const {user} = this.state;
    console.log('>>>>App.modalClose', {user});
    this.setState({
      modalType: '',
      modalRef: null,
    });
  }
  // ------------  User Action Handlers ---------------
  modalOpenSignIn() {
    const {user} = this.state;
    console.log('>>>>App.modalOpenSignIn', {user});
    this.setState({
      modalType: Modal.USER_LOGIN.key,
      modalRef: null,
    });
  }
  modalOpenSignUp() {
    const {user} = this.state;
    console.log('>>>>App.modalOpenSignUp', {user});
    this.setState({
      modalType: Modal.USER_SIGNUP.key,
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
  // ----------  Payment  -------------------------
  handlePayment() {
    console.log('>>>>MobileApp.handlePayment');
    const {user, instPackage, instPackageExt} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      const {startDate, endDate, totalPeople, totalRooms, rate} = instPackage;
      const msgError = PackageHelper.validateInstance(instPackage, instPackageExt);
      if (!msgError) {
        if (instPackage.status === InstanceStatus.INITIATED) {
          instPackage.status = InstanceStatus.IN_PROGRESS;
        }
        const ref = {
          dtStart: startDate,
          dtEnd: endDate,
          people: totalPeople,
          rooms: totalRooms,
          rate: rate,
          totalRate: totalPeople * rate,
        };
        this.setState({
          modalType: Modal.SUBMIT_PAYMENT.key,
          modalRef: ref,
          instPackage: instPackage,
        });
      } else if (msgError) {
        this.setState({
          modalType: msgError,
          modalRef: instPackageExt,
        });
      }
    }
  }
  handlePaymentDone(outcome) {
    console.log('>>>>MobileApp.handlePaymentDone', outcome);
    const {instPackage} = this.state;
    instPackage.status = outcome.status;
    this.setState({
      instPackage: instPackage,
      modalType: '',
      modalRef: null,
    });
  }
  // ----------  People and Room  ----------
  handlePeopleChange(input) {
    console.log('>>>>MobileApp.handlePeopleChange', input);
    const {viewerId} = this.props;
    const {user, instPackage, instPackageExt} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      if (instPackage.status === InstanceStatus.INITIATED) {
        instPackage.status = InstanceStatus.IN_PROGRESS;
      }
      let tmpMember = null;
      const isExist = !!_.find(instPackage.members, (m) => {
        return m.loginId === viewerId;
      });
      if (isExist) {
        for (let i = 0; i < instPackage.members.length; i++) {
          if (instPackage.members[i].loginId === viewerId) {
            instPackage.members[i].people = input.people;
            instPackage.members[i].rooms = input.rooms;
          }
        }
      } else {
        tmpMember = {
          memberId: user._id,
          loginId: user.loginId,
          name: user.name,
          isOwner: false,
          status: InstanceStatus.IN_PROGRESS,
          people: input.people,
          rooms: input.rooms,
        };
        instPackage.members.push(tmpMember);
      }
      instPackageExt.people = input.people;
      instPackageExt.rooms = input.rooms;
      const matchingRates = PackageHelper.doRating({
        instPackage: instPackage,
        instPackageExt: instPackageExt,
        rates: input.rates,
      });
      this.setState({
        instPackage: {...instPackage, rate: matchingRates.curRate},
        instPackageExt: {...instPackageExt, ...matchingRates},
      });
      const action = isExist
        ? SocketAction.UPDATE_PEOPLE
        : SocketAction.ADD_MEMBER;
      const params = isExist
        ? {
          people: input.people,
          rooms: input.rooms,
          statusInstance: InstanceStatus.IN_PROGRESS,
          statusMember: InstanceStatus.IN_PROGRESS,
        }
        : tmpMember;
      const req = {
        senderId: viewerId,
        instId: instPackage._id,
        action: action,
        params: params,
      };
      this.pushToRemote('package:update', req);
    }
  }
  handleRoomChange(input) {
    console.log('>>>>MobileApp.handleRoomChange', input);
    const {viewerId} = this.props;
    const {user, instPackage, instPackageExt} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      if (instPackage.status === InstanceStatus.INITIATED) {
        instPackage.status = InstanceStatus.IN_PROGRESS;
      }
      let tmpMember = null;
      const isExist = !!_.find(instPackage.members, (m) => {
        return m.loginId === viewerId;
      });
      if (isExist) {
        for (let i = 0; i < instPackage.members.length; i++) {
          if (instPackage.members[i].loginId === viewerId) {
            instPackage.members[i].rooms = input.rooms;
          }
        }
      } else {
        tmpMember = {
          memberId: user._id,
          loginId: user.loginId,
          name: user.name,
          isOwner: false,
          status: InstanceStatus.IN_PROGRESS,
          people: input.people,
          rooms: input.rooms,
        };
        instPackage.members.push(tmpMember);
      }
      instPackageExt.rooms = input.rooms;
      const matchingRates = PackageHelper.doRating({
        instPackage: instPackage,
        instPackageExt: instPackageExt,
        rates: input.rates,
      });
      this.setState({
        instPackage: {...instPackage, rate: matchingRates.curRate},
        instPackageExt: {...instPackageExt, ...matchingRates},
      });
      // Update status and sync to server
      const action = isExist
        ? SocketAction.UPDATE_ROOMS
        : SocketAction.ADD_MEMBER;
      const params = isExist
        ? {
          rooms: input.rooms,
          statusInstance: InstanceStatus.IN_PROGRESS,
          statusMember: InstanceStatus.IN_PROGRESS,
        }
        : tmpMember;
      const req = {
        senderId: viewerId,
        instId: instPackage._id,
        action: action,
        params: params,
      };
      this.pushToRemote('package:update', req);
    }
  }
  // ----------  Package Instance Hotel  ----------
  handleSelectHotel(dayNo, item) {
    const {user, instPackage} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      if (instPackage.status === InstanceStatus.INITIATED) {
        instPackage.status = InstanceStatus.IN_PROGRESS;
      }
      console.log('>>>>MobileApp.handleSelectHotel', instPackage);
      for (let i = 0; i < instPackage.hotels.length; i++) {
        const hotel = instPackage.hotels[i];
        if (Number(hotel.dayNo) === Number(dayNo)) {
          const city = hotel.hotel.city;
          hotel.hotel = {...item, city};
        }
      }
      this.setState({instPackage: instPackage});
    }
  }
  // ----------  Package Instance Flight  ----------
  handleSelectFlight(stStartDate) {
    const {user, instPackage} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      if (instPackage.status === InstanceStatus.INITIATED) {
        instPackage.status = InstanceStatus.IN_PROGRESS;
      }
      console.log('>>>>MobileApp.handleSelectFlight', stStartDate);
      const {totalDays} = instPackage;
      const mStartDate = Moment(stStartDate, Global.dateFormat);
      instPackage.startDate = mStartDate.toDate();
      instPackage.endDate = mStartDate.add(totalDays, 'days').toDate();
      this.setState({instPackage: instPackage});
    }
  }
  // ----------  Package Instance Car  ----------
  handleSelectCar(carOption) {
    const {user, instPackage} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      if (instPackage.status === InstanceStatus.INITIATED) {
        instPackage.status = InstanceStatus.IN_PROGRESS;
      }
      console.log('>>>>MobileApp.handleSelectCar', carOption);
      instPackage.carOption = carOption;
    }
  }
  enablePackageDiy() {
    console.log('>>>>MobileApp.enablePackageDiy');
    const {instPackage} = this.state;
    instPackage.isCustomised = true;
    if (instPackage.status === InstanceStatus.INITIATED) {
      instPackage.status = InstanceStatus.IN_PROGRESS;
    }
    this.setState({
      instPackage: instPackage,
      modalType: '',
      modalRef: null,
    });
  }
  confirmAddItinerary(ref) {
    console.log('>>>>MobileApp.confirmAddItinerary', ref);
    this.setState({
      modalType: Modal.ADD_ITINERARY.key,
      modalRef: ref,
    });
  }
  handleAddItinerary() {
    const ref = this.state.modalRef;
    console.log('>>>>MobileApp.handleAddItinerary', ref);
    const instPackage = PackageHelper.addItinerary(
      this.state.instPackage,
      ref.dayNo
    );
    instPackage.status = Instance.status.SELECT_ATTRACTION;
    this.setState({
      instPackage: instPackage,
      modalType: '',
      modalRef: null,
    });
  }
  confirmDeleteItinerary(ref) {
    console.log('>>>>MobileApp.confirmDeleteItinerary', ref);
    this.setState({
      modalType: Modal.DELETE_ITINERARY.key,
      modalRef: ref,
    });
  }
  handleDeleteItinerary() {
    const ref = this.state.modalRef;
    const userId = this.state.userId;
    console.log('>>>>MobileApp.handleDeleteItinerary', ref);
    if (ref.isRequired) {
      this.setState({
        modalType: Modal.FAILED_DELETE_ITINERARY.key,
        modalRef: null,
      });
    } else {
      const instPackage = PackageHelper.deleteItinerary(
        this.state.instPackage,
        ref.dayNo
      );
      instPackage.status = Instance.status.SELECT_HOTEL;
      this.setState({
        instPackage: instPackage,
        modalType: '',
        modalRef: null,
      });
    }
  }
  handleLikeAttraction(dayNo, timePlannable, item, attractions) {
    const {user, instPackage} = this.state;
    if (user.id === Global.anonymousUser) {
      this.modalOpenSignIn();
    } else {
      console.log('>>>>MobileApp.handleLikeAttraction', {
        dayNo,
        item,
        attractions,
        instPackage: this.state.instPackage,
      });
      // Functions
      const hasNearBy = (target, idx, existing) => {
        for (let i = 0; i < idx && existing.length; i++) {
          if (
            _.findIndex(existing[i].nearByAttractions, (aid) => {
              return aid === target.id;
            }) > -1
          ) {
            return true;
          }
        }
        return false;
      };
      const isOverloaded = (existing, target) => {
        if (timePlannable === 0) {
          return true;
        }
        let timePlanned = 0;
        for (let i = 0; i < existing.length; i++) {
          const attraction = existing[i];
          timePlanned =
            timePlanned + attraction.timeTraffic + attraction.timeVisit;
          if (i > 0 && hasNearBy(attraction, i, existing)) {
            timePlanned = timePlanned - 1;
          }
        }
        if (timePlanned >= timePlannable) {
          return true;
        }
        timePlanned = timePlanned + target.timeTraffic + target.timeVisit;
        if (hasNearBy(target, existing.length, existing)) {
          timePlanned = timePlanned - 1;
        }
        if (timePlanned >= timePlannable + 1) {
          return true;
        }
        return false;
      };
      const mergeDayItems = (dayItems) => {
        const items = [];
        const days = Object.keys(dayItems);
        _.each(days, (day) => {
          _.each(dayItems[day], (item) => {
            items.push(item);
          });
        });
        return items;
      };
      // Logic starts here
      if (!instPackage.isCustomised) {
        // Package is not customised (DIY) yet, ask customer to confirm
        this.setState({
          modalType: Modal.ENABLE_DIY.key,
          modalRef: {isSmallPopup: true},
        });
      } else {
        if (instPackage.status === InstanceStatus.INITIATED) {
          instPackage.status = InstanceStatus.IN_PROGRESS;
        }
        // Package is customised (DIY) already, move on with rest of logic
        const action = item.isLiked ? 'DELETE' : 'ADD';
        if (action === 'ADD') {
          const fAttractions = _.filter(attractions, (a) => {
            return a.isLiked && a.id !== item.id;
          });
          if (isOverloaded(fAttractions, item)) {
            // Activities over booked
            this.setState({
              modalType: Modal.FULL_ITINERARY.key,
              modalRef: {dayNo: dayNo},
              instPackage: instPackage,
            });
          } else {
            // Enough time for extra Activity
            const dayItems = _.groupBy(instPackage.items, (item) => {
              return item.dayNo;
            });
            const newItem = {
              id: -1,
              isMustVisit: false,
              timePlannable: Global.timePlannable,
              description: '',
              dayNo: dayNo,
              daySeq: Global.idxLastItem,
              attraction: {...item},
            };
            dayItems[dayNo].push(newItem);
            instPackage.items = mergeDayItems(dayItems);
            this.setState({instPackage: instPackage});
          }
        } else if (action === 'DELETE') {
          const dayItems = _.groupBy(instPackage.items, (item) => {
            return item.dayNo;
          });
          if (dayItems[dayNo].length === 1) {
            // Only one activity, can not be deleted
            this.setState({
              modalType: Modal.ONLY_ITINERARY.key,
              modalRef: {dayNo: dayNo},
              instPackage: instPackage,
            });
          } else {
            const newItems = [];
            _.each(dayItems[dayNo], (it) => {
              if (it.attraction.id !== item.id) {
                newItems.push({...it});
              }
            });
            dayItems[dayNo] = newItems;
            instPackage.items = mergeDayItems(dayItems);
            this.setState({instPackage: instPackage});
          }
        }
      }
    }
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
  renderList(actions) {
    console.log('>>>>MobileApp.renderList', this.state);
    // Function Variables
    const {travelPackages, user, modalType} = this.state;
    const {classes} = this.props;
    const {headerActions, modalActions} = actions;
    const cardActions = {
      viewDetails: this.handleViewDetails,
    };
    // Sub Components
    const dialog = modalType ? (
      <AppDialog modal={modalType} actions={modalActions} />
    ) : (
      ''
    );
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
        {dialog}
      </div>
    );
  }
  renderDetails(actions) {
    console.log('>>>>MobileApp.renderDetails', this.state);
    // Function Variables
    const {updating, modalType, modalRef, reference} = this.state;
    const {instPackage, instPackageExt, rates, user} = this.state;
    const {cities, packageSummary} = reference;
    const {classes} = this.props;
    const {headerActions, modalActions} = actions;
    const itineraryActions = {
      handlePeople: this.handlePeopleChange,
      handleRoom: this.handleRoomChange,
      handleShare: null,
      handlePayment: this.handlePayment,
      handleSelectHotel: this.handleSelectHotel,
      handleSelectFlight: this.handleSelectFlight,
      handleSelectCar: this.handleSelectCar,
      handleLikeAttraction: this.handleLikeAttraction,
      handleAddItinerary: this.confirmAddItinerary,
      handleDeleteItinerary: this.confirmDeleteItinerary,
    };
    // Sub Components
    const dialog = modalType ? (
      <AppDialog
        modal={modalType}
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

  componentDidMount() {
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
    const headerActions = {
      goHome: this.goHome,
      signIn: this.modalOpenSignIn,
      signUp: this.modalOpenSignUp,
      signOut: this.handleSignOut,
    };
    const modalActions = {
      close: this.modalClose,
      signIn: this.handleSignIn,
      signUp: this.handleSignUp,
      handleDeleteItinerary: this.handleDeleteItinerary,
      handleAddItinerary: this.handleAddItinerary,
      handlePayment: this.handlePaymentDone,
      handleCustomise: this.enablePackageDiy,
    };
    const actions = {headerActions, modalActions};
    if (stage === '') {
      if (!travelPackages || travelPackages.length === 0) {
        if (instPackage) {
          return this.renderDetails(actions);
        }
        return <div>Loading...</div>;
      }
      return this.renderList(actions);
    } else if (stage === InstanceStatus.IN_PROGRESS) {
      this.renderDetails(actions);
    } else if (stage === InstanceStatus.PENDING_PAYMENT) {
      this.renderPayment(actions);
    }
    return this.renderDefault();
  }
}

export default withStyles(styles, {withTheme: true})(App);
