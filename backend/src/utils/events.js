const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// Loguear todos los eventos emitidos
eventEmitter.on("cvUploaded", (application) => {
    console.log(`Event Received: 'cvUploaded' for Application ID: ${application._id}`);
});

module.exports = eventEmitter;
