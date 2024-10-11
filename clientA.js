const net = require('net');
const readline = require('readline');

const meterClient = net.createConnection({ host: '2406:da1a:965:aa49:142f:830e:cc27:be3c', port: 8080 }, () => {
    console.log('Meter connected to server.');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

meterClient.on('data', (data) => {
    const received = data.toString().trim();
    console.log(`Server: ${received}`);

    // Check if it's a question from the User
    if (received.includes('User sent:')) {
        console.log('Question received from User.');
        
        // Prompt Meter to type a