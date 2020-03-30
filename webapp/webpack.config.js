'use strict';

const webpackEnv = (process.env.NODE_ENV || 'development').trim();

webpackEnv === 'development'
  ? module.exports = require('./config/webpack.dev')
  : module.exports = require('./config/webpack.prod');
