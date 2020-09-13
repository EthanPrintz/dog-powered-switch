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

// Based off of  morse code syntax
const letterDelay = 1;
const wordDelay = 3;
const messageDelay = 7;
const delayUnit = 1000;

const dotDuration = 200;
const dashDuration = 600;

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
    morseMessage.forEach(async (token) => {
      // if (token === ' ') {
      // Turn light off after word
      lifx
        .setState('group:Den', {
          color: 'red',
        })
        .then(timeout(3000))
        .then(
          lifx.setState('group:Den', {
            color: 'green',
          })
        );
      // }
      // else {
      //     // Read word
      //     token.forEach(async (character) => {
      //       if (character === '.') {
      //         // On for DOT
      //         lifx
      //           .setState('group:DEN', {
      //             brightness: 1, // To-do: change to 1/buttons on
      //           })
      //           .then(timeout(dotDuration))
      //           .then(
      //             lifx.setState('group:Den', {
      //               brightness: 0,
      //             })
      //           );
      //       } else {
      //         // On for DASH
      //         lifx
      //           .setState('group:DEN', {
      //             brightness: 1, // To-do: change to 1/buttons on
      //           })
      //           .then(timeout(dashDuration))
      //           .then(
      //             lifx.setState('group:Den', {
      //               brightness: 0,
      //             })
      //           );
      //       }
      //     });
      //     // Delay to space next character
      //     await timeout(letterDelay * delayUnit);
      //   }
      // });
    });
    // When pressure switch is up (circuit broken)
    pressureSwitch.on('release', () => {
      // Set color to red
      lifx.setState('group:Den', { color: 'blue' });
      console.log('up');
    });
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
