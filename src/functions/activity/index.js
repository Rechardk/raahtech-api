/**
 * Durable Task activity function.
 *
 * Activities are the building blocks of orchestrations. They run once and can
 * perform any I/O (database queries, HTTP calls, queue operations, etc.).
 * Return values are serialised and sent back to the orchestrator.
 *
 * Trigger: activityTrigger (called by the orchestrator via
 *           context.df.callActivity('raahActivity', input)).
 */

'use strict';

const df     = require('durable-functions');
const logger = require('../../utils/logger');

df.app.activity('raahActivity', {
  handler: async (input, context) => {
    logger.info('Activity invoked', {
      invocationId: context.invocationId,
      input,
    });

    // ---------------------------------------------------------------------------
    // Replace the stub below with real business logic:
    //   - Query a database
    //   - Call an external API
    //   - Process a message from a queue
    //   - Write to Blob Storage / Cosmos DB
    // ---------------------------------------------------------------------------
    const result = {
      step:      input?.step ?? 0,
      processed: true,
      output:    `Processed payload for step ${input?.step ?? 0}`,
      timestamp: new Date().toISOString(),
    };

    logger.info('Activity complete', {
      invocationId: context.invocationId,
      result,
    });

    return result;
  },
});
