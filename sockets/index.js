import PackageSocket from './package';

const attachSockets = (io) => {
  // Socketio connection
  io.on('connect', (socket) => {
    const channel = (channel, handler) => {
      socket.on(channel, (request, sendStatus) => {
        console.log(
          `>>>>Captured event[${channel}] on socket[${socket.id}]`,
          request
        );

        handler({
          request,
          sendStatus,
          socket,
        });
      });
    };

    console.log('>>>>User connected', socket.id);

    channel('push:product:filter', PackageSocket.filterPackage);
    channel('push:product:get', PackageSocket.getPackage);
    channel('push:product:customise', PackageSocket.customisePackage);
    channel('push:product:checkout', PackageSocket.checkoutPackage);
    channel('push:product:paid', PackageSocket.paidPackage);
    channel('push:rate:getByProduct', PackageSocket.getRatesByPackage);

    channel('disconnect', () => {
      console.log('>>>>User disconnected');
    });
  });
};

export default attachSockets;
