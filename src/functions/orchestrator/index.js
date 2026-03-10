/**
 * Durable Task orchestrator.
 *
 * This function is triggered by the Durable Functions runtime and drives a
 * workflow by calling one or more activity functions in sequence (or in
 * parallel).  It is deterministic and must not perform any I/O directly —
 * all side-effects (including logging) must be delegated to activity
 * functions via context.df.callActivity().
 *
 * IMPORTANT: Orchestrator code replays from the beginning on every checkpoint.
 * Do NOT call logger, Date.now(), Math.random(), or any other non-deterministic
 * operation directly here — use activity functions instead.
 *
 * Trigger: orchestrationTrigger (invoked by a client function or via HTTP
 *           starter — see the durable-functions documentation for starters).
 */

'use strict';

const df = require('durable-functions');

df.app.orchestration('raahOrchestrator', function* (context) {
  const input = context.df.getInput();
  const results = [];

  // Step 1 — run the primary activity.
  const step1 = yield context.df.callActivity('raahActivity', {
    step:    1,
    payload: input,
  });
  results.push(step1);

  // Add further steps / fan-out patterns as the workflow grows.
  // Example fan-out:
  //   const tasks = ['a', 'b', 'c'].map(item =>
  //     context.df.callActivity('raahActivity', { item }));
  //   const fanOut = yield context.df.Task.all(tasks);
  //   results.push(...fanOut);

  return { status: 'completed', results };
});
