import PackageSocket from './package';

const attachSockets = io => {
	// Socketio connection
	io.on('connect', socket => {
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

		channel('push:package:get', PackageSocket.getPackageDetails);
		channel('push:package:filter', PackageSocket.getFilteredPackages);

		channel('disconnect', () => {
			console.log('>>>>User disconnected');
		});
	});
};

export default attachSockets;
