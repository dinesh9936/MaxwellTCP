const net = require('net');
const clients = {}; // Store meter and user clients

const server = net.createServer((socket) => {
    console.log('A new client connected.');

    // Assign roles based on connection order
    if (!clients.meter) {
        clients.meter = socket;
        socket.write('You are connected as Meter. Waiting for a user to connect.\n');
        console.log('Meter connected.');
    } else if (!clients.user) {
        clients.user = socket;
        socket.write('You are connected as User. You can now ask questions.\n');
        clients.meter.write('User is now connected. You can respond to questions.\n');
        console.log('User connected.');

        // Listen for questions from the User
        socket.on('data', (data) => {
            const question = data.toString().trim();
            console.log(`User sent: ${question}`);

            // Forward the question to the Meter
            if (clients.meter) {
                clients.meter.write(`User sent: ${question}\n`);
            } else {
                socket.write('Meter is not connected.\n');
            }
        });
    } else {
        socket.write('Server is full. Only Meter and User are allowed.\n');
        socket.end();
    }

    // Handle responses from Meter
    socket.on('data', (data) => {
        if (socket === clients.meter) {
            const response = data.toString().trim();
            console.log(`Meter sent: ${response}`);

            // Send the response to the User
            if (clients.user) {
                clients.user.write(`Meter response: ${response}\n`);
            }
        }
    });

    // Handle client disconnections
    socket.on('end', () => {
        if (socket === clients.meter) {
            console.log('Meter disconnected.');
            clients.meter = null;
            if (clients.user) clients.user.write('Meter disconnected.\n');
        } else if (socket === clients.user) {
            console.log('User disconnected.');
            clients.user = null;
            if (clients.meter) clients.meter.write('User disconnected.\n');
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`TCP server is running on port ${PORT}`);
});
