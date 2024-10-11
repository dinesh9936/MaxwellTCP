const net = require('net');
const readline = require('readline');

const userClient = net.createConnection({ host: '2406:da1a:965:aa49:142f:830e:cc27:be3c', port: 8080 }, () => {
    console.log('User connected to server.');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

userClient.on('data', (data) => {
    console.log(`Server: ${data.toString().trim()}`);
});

userClient.on('end', () => {
    console.log('Disconnected from server.');
});

// Function to prompt the user for commands
const askForCommand = () => {
    rl.question('Enter command (I for Instant Data, M for More Data): ', (command) => {
        userClient.write(command); // Send command to the server
        askForCommand(); // Ask for the next command
    });
};

// Start asking for commands
askForCommand();
