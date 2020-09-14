// Library Imports
const DOTENV = require('dotenv');
const LIFX = require('lifx-http-api');
const FIVE = require('johnny-five');
const PARTICLE = require('particle-io');
const fs = require('fs');

// =================================================
// Initializations
// Init environmental variables
DOTENV.config();

// Init Johnny Five
// Setup remote Particle Photon connection
const board = new FIVE.Board({
  io: new PARTICLE({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_DEVICE_ID,
  }),
});

// Init LIFX API wrapper
const lifx = new LIFX({
  bearerToken: process.env.LIFX_TOKEN,
});

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =================================================
// Server logic
board.on('ready', () => {
  // Setup button for switch
  const pressureSwitch = new FIVE.Button('D0');
  // When pressure switch is down (circuit complete)
  pressureSwitch.on('press', () => {
    console.log('down');
    // Set color to blue
    lifx.setState('group:Den', { color: 'green' });
    // When pressure switch is up (circuit broken)
    pressureSwitch.on('release', () => {
      // Set color to red
      lifx.setState('group:Den', { color: 'kelvin:4000' });
    });
  });
});
