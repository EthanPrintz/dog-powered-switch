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

// Get morse code library
const morseTranslation = JSON.parse(fs.readFileSync('morse-code.json'));

// Set message
const message =
  'Bug is a doggo The love of my fucking life  He likes cheese munch munch';

// Convert message to 2D array of morse code
const morseMessage = message
  .toLowerCase()
  .split('')
  .map((character) =>
    character !== ' ' ? morseTranslation[character].split('') : ' '
  );

console.log(morseMessage);

// =================================================
// Server logic
board.on('ready', () => {
  // Setup button for switch
  const pressureSwitch = new FIVE.Button('D0');
  // When pressure switch is down (circuit complete)
  pressureSwitch.on('press', () => {
    // Set color to blue
    lifx.setState('group:Den', { color: 'blue' });
    console.log('down');
  });
  // When pressure switch is up (circuit broken)
  pressureSwitch.on('release', () => {
    // Set color to red
    lifx.setState('group:Den', { color: 'red' });
    console.log('up');
  });
});

// lifx.listLights('all').then(console.log, console.error);
// // lifx
// //   .setState('all', {
// //     power: 'off',
// //     color: 'green',
// //     brightness: 1,
// //   })
// //   .then(console.log, console.error);
