/**
 * Logger utility — thin wrapper that enriches log output with a timestamp,
 * log level, and optional correlation id before writing to stdout/stderr.
 *
 * In production the Azure Functions host captures stdout/stderr and forwards
 * everything to Application Insights automatically, so no SDK dependency is
 * required here.
 */

'use strict';

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const configuredLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const configuredLevelValue = LOG_LEVELS[configuredLevel] ?? LOG_LEVELS.info;

/**
 * Format a single log entry as a JSON string so it is machine-readable in
 * Application Insights / Log Analytics.
 *
 * @param {string} level
 * @param {string} message
 * @param {object} [meta]
 * @returns {string}
 */
function format(level, message, meta) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
  });
}

/**
 * Write a log line if the effective log level permits it.
 *
 * @param {string} level
 * @param {string} message
 * @param {object} [meta]
 */
function log(level, message, meta) {
  const levelValue = LOG_LEVELS[level] ?? LOG_LEVELS.info;
  if (levelValue < configuredLevelValue) return;

  const line = format(level, message, meta);
  if (level === 'error' || level === 'warn') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
}

const logger = {
  debug: (message, meta) => log('debug', message, meta),
  info:  (message, meta) => log('info',  message, meta),
  warn:  (message, meta) => log('warn',  message, meta),
  error: (message, meta) => log('error', message, meta),
};

module.exports = logger;
