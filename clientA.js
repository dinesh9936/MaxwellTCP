const net = require('net');
const readline = require('readline');

const meterClient = net.createConnection({ host: 'https://e436-117-192-207-178.ngrok-free.app',port:4040}, () => {
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
        
        // Prompt Meter to type a response
        rl.question('Type your response: ', (response) => {
            meterClient.write(response); // Send the typed response back to the server (and User)
        });
    }
});

meterClient.on('end', () => {
    console.log('Disconnected from server.');
});
