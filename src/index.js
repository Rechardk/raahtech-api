/**
 * Application entry point.
 *
 * This file is referenced by the "main" field in package.json and is loaded
 * by the Azure Functions host on startup.  It imports every function module
 * so that each call to app.http() / df.app.orchestration() / etc. registers
 * the function with the runtime.
 *
 * It also validates required environment variables early so that
 * misconfiguration is caught at startup rather than at request time.
 */

'use strict';

const logger = require('./utils/logger');
const { validate, config } = require('./utils/env');

// ---------------------------------------------------------------------------
// Startup validation
// Uncomment variables as they become required in production.
// ---------------------------------------------------------------------------
// validate([
//   'TASK_HUB_NAME',
//   'DURABLE_TASK_SCHEDULER_ENDPOINT',
//   'DURABLE_TASK_SCHEDULER_CONNECTION',
//   'APPLICATIONINSIGHTS_CONNECTION_STRING',
// ]);

logger.info('Raahtech API starting', {
  version: config.apiVersion,
  env:     config.nodeEnv,
  node:    process.version,
});

// ---------------------------------------------------------------------------
// Function registrations
// ---------------------------------------------------------------------------
require('./functions/health');
require('./functions/version');
require('./functions/orchestrator');
require('./functions/activity');

logger.info('All functions registered');
