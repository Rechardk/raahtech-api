/**
 * Health check function.
 *
 * GET /api/health
 *
 * Returns a 200 JSON response with a simple status payload so that load
 * balancers and monitoring tools can confirm the Function App is alive.
 */

'use strict';

const { app } = require('@azure/functions');
const logger   = require('../utils/logger');
const { config } = require('../utils/env');

app.http('health', {
  methods:   ['GET'],
  authLevel: 'anonymous',
  route:     'health',

  handler: async (request, context) => {
    logger.info('Health check requested', { invocationId: context.invocationId });

    const body = {
      status:    'healthy',
      version:   config.apiVersion,
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
