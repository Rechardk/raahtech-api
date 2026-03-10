/**
 * Version function.
 *
 * GET /api/version
 *
 * Returns build / runtime metadata. Useful for confirming which deployment is
 * currently active without having to inspect Azure Portal.
 */

'use strict';

const { app } = require('@azure/functions');
const logger   = require('../../utils/logger');
const { config } = require('../../utils/env');

app.http('version', {
  methods:   ['GET'],
  authLevel: 'anonymous',
  route:     'version',

  handler: async (request, context) => {
    logger.info('Version requested', { invocationId: context.invocationId });

    const body = {
      version:   config.apiVersion,
      runtime:   'Azure Functions v4',
      node:      process.version,
      env:       config.nodeEnv,
      timestamp: new Date().toISOString(),
    };

    return {
      status:  200,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    };
  },
});
