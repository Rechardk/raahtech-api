/**
 * Environment variable loader.
 *
 * Centralises access to process.env and provides:
 *  - A typed getter with an optional default value
 *  - A required getter that throws on missing values (fail-fast at startup)
 *  - A validate() helper that asserts all required variables are present
 */

'use strict';

/**
 * Return the value of an environment variable, or a default if it is absent.
 *
 * @param {string} name
 * @param {string} [defaultValue]
 * @returns {string | undefined}
 */
function get(name, defaultValue) {
  return process.env[name] ?? defaultValue;
}

/**
 * Return the value of an environment variable. Throws if the variable is not
 * set or is an empty string.
 *
 * @param {string} name
 * @returns {string}
 */
function require(name) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Assert that every variable in the supplied list is present and non-empty.
 * Call this once during application startup so that misconfiguration is caught
 * early rather than at request time.
 *
 * @param {string[]} names
 */
function validate(names) {
  const missing = names.filter(
    (name) => process.env[name] === undefined || process.env[name] === ''
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/**
 * Pre-loaded, validated application configuration.
 * Add new variables here as the application grows.
 */
const config = {
  nodeEnv:     get('NODE_ENV', 'production'),
  apiVersion:  get('API_VERSION', '1.0.0'),
  logLevel:    get('LOG_LEVEL', 'info'),
  taskHubName: get('TASK_HUB_NAME', 'raahtech'),
  durableSchedulerEndpoint: get('DURABLE_TASK_SCHEDULER_ENDPOINT', ''),
  appInsightsConnectionString: get('APPLICATIONINSIGHTS_CONNECTION_STRING', ''),
};

module.exports = { get, require, validate, config };
