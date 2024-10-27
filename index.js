const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = new SerialPort({
    path: '/dev/cu.usbmodem1101', 
    baudRate: 9600,
});
app.use(bodyParser.json());

port.on('open', () => {
    console.log('Serial port opened successfully.');
});

port.on('error', (err) => {
    console.error('Serial port error:', err.message);
});


app.get('/sparkle', (req, res) => {
    try {
        port.write('S', (err) => {
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send sparkle command');
            }
            res.send('Sparkle command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/rainbow', (req, res) => {
    try {
        port.write('RAINBOW', (err) => {  
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send rainbow command');
            }
            res.send('Rainbow command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/chill', (req, res) => {
    try {
        port.write('CHILL', (err) => {  
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send chill command');
            }
            res.send('Chill command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});


app.get('/sunset', (req, res) => {
    try {
        port.write('SUNSET', (err) => { 
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send sunset command');
            }
            res.send('Sunset command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/breathe', (req, res) => {
    try {
        port.write('BREATHE', (err) => {
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send sunset command');
            }
            res.send('Breathe command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/ripple', (req, res) => {
    try {
        port.write('RIPPLE', (err) => { 
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send sunset command');
            }
            res.send('Ripple command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});

app.get('/comet', (req, res) => {
    try {
        port.write('COMET', (err) => { 
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send sunset command');
            }
            res.send('COMET command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});


app.get('/confetti', (req, res) => {
    try {
        port.write('CONFETTI', (err) => { 
            if (err) {
                console.error('Error writing to Arduino:', err.message);
                return res.status(500).send('Failed to send sunset command');
            }
            res.send('confetti command sent');
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Server error');
    }
});





io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for 'ledToggle' event with LED number and color
    socket.on('ledToggle', (data) => {
        const { ledNumber, color } = data;

        // Check if the LED number is in the valid range
        if (ledNumber >= 1 && ledNumber <= 240) {
            // Send the LED number and color (in "LED:R:G:B" format) to Arduino
            const command = `${ledNumber}:${color.r}:${color.g}:${color.b}\n`;
            port.write(command); // Send as string with newline
            console.log(`Sent command for LED ${ledNumber}: ${command}`);
        } else {
            console.error('LED number out of range');
        }
    });

    // Listen for startAnimation event
socket.on('startAnimation', (data) => {
    const { type } = data;
    
    // Define the animation commands based on the type
    if (type === 'animation1') {
        // Example command for Animation 1
        port.write('FADE\n'); // Use a specific command for animation 1
        console.log('Sent command for Animation 1');
    } else if (type === 'animation2') {
        // Example command for Animation 2
        port.write('CHASE\n'); // Use a specific command for animation 2
        console.log('Sent command for Animation 2');
    }
});


    // Listen for resetLEDs event
// Listen for resetLEDs event
socket.on('resetLEDs', () => {
    // Send reset command to Arduino
    port.write('RESET\n'); // Use a specific command for resetting
    console.log('Sent reset command to Arduino');
});

// Listen for stopAnimations event
socket.on('stopAnimations', () => {
    // Send a command to stop animations on the Arduino
    port.write('STOP\n'); // Use a specific command to stop animations
    console.log('Sent command to stop animations');
});
});

// Handle serial port errors
port.on('error', (err) => {
    console.error('Error: ', err.message);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Serve static files
app.use(express.static('public')); // Serve your HTML file

// Socket event for color selection (new functionality)
io.on('connection', (socket) => {
    socket.on('colorChange', (data) => {
        const { ledNumber, color } = data;
        const command = `${ledNumber}:${color.r}:${color.g}:${color.b}\n`;
        port.write(command);
        console.log(`Color change command sent for LED ${ledNumber}: ${command}`);
    });
});

