'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Define application configuration.
 * @type {Object}
 * @property {number} config.port port to listen on, default to 3000.
 * @property {string} config.mongodb mongodb to connect to.
 */
const config = {
  mongodb: process.env.MONGODB || 'mongodb://192.168.99.100:32768/sparkle-test',
  port: process.env.PORT || '3000'
};
exports.default = config;