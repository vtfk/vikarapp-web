import set from 'lodash.set';
import merge from 'lodash.merge';

function typeifyVariable(variable) {
  if(!variable) return variable;

  function parseNumber(variable) {
    let parsed = undefined;
    if(variable.match(/-|:/)) return undefined; // Prevents parsing dates as numbers
    if(variable.includes('.') || variable.includes(',')) parsed = parseFloat(variable);
    else parsed = parseInt(variable)

    return parsed || undefined;
  }

  if(typeof variable === 'string') {
    // Int and float
    if(parseNumber(variable)) return parseNumber(variable)

    // Booleans
    if(variable.toLowerCase() === 'false') return false;
    if(variable.toLocaleLowerCase() === 'true') return true;

    // Dates
    if(Date.parse(variable)) return new Date(variable)

    // Arrays
    if(variable.startsWith('[') && variable.endsWith(']')) {
      variable = variable.substring(1, variable.length - 1)
      variable = variable.split(',').map((i) => { 
        if((i.startsWith("'") && i.endsWith("'")) || (i.startsWith('"') && i.startsWith('"'))) return i.substring(1, i.length - 1).trim()
        return typeifyVariable(i)
      })
    }
  }

  return variable;
}

/**
 * @param {Object} defaultConfig Object containing default configuration
 * @param {String || [String]} prefixes The prefixes of the enviroment variables to generate config from
 * @param {String || [String]} spreadPrefixes Drill down and spread environment variables stored in a environment variables
 * @returns {Object}
 */
/* eslint-disable import/no-anonymous-default-export */
export default function (defaultConfig = {}, prefixes, spreadPrefixes) {
  // Input validation/normalization
  if(!process.env) return
  if(typeof defaultConfig !== 'object') defaultConfig = {}
  if(prefixes && !Array.isArray(prefixes)) prefixes = [prefixes]
  if(spreadPrefixes && !Array.isArray(spreadPrefixes)) spreadPrefixes = [spreadPrefixes]

  // Determine the prefix patterns
  const systemPrefixes = /REACT_APP_|VUE_APP_/
  const prefixPattern = prefixes ? new RegExp(prefixes.map((p) => `^${p}`).join('|')) : undefined;

  // Determine spread variables
  spreadPrefixes = spreadPrefixes || ['ENVIRONMENT']
  
  // Normalize the environment variables
  let environmentVariables = []
  for(const key of Object.keys(process.env)) {
    // Normalized key
    let normalKey = key;

    // Strip away any system prefixes
    const systemMatch = systemPrefixes.exec(normalKey);
    if(systemMatch && systemMatch[0]) normalKey = normalKey.substring(systemMatch[0].length)

    // Add the normalized key to the array
    environmentVariables.push({key, path: normalKey});
  }
  console.log('Before spreading', environmentVariables);
  // Spread variables
  if(spreadPrefixes) {
    const toSpread = environmentVariables.filter((i) => spreadPrefixes.some((p) => p.startsWith(i.path)));
    console.log('Spreading', toSpread)
    for(const spreadVar of toSpread) {
      let val = process.env[spreadVar.key];
      if(!val) continue;
      const rows = val.split(/\r?\n/)
      for(const row of rows) {
        if(!row.includes('=')) continue;
        console.log('Row ' + row)
        const [key, value] = row.split('=');
        environmentVariables.push({ key, path: key, value })
      }
    }
  }

  console.log('After spreading', environmentVariables)

  // Filter out environment variables that does not match
  const filteredEnvironmentVariables = [];
  if(prefixPattern) {
    console.log('Pattern: ', prefixPattern)
    for(const envvar of environmentVariables) {
      const match = prefixPattern.exec(envvar.path);
      if(!match || !match[0]) continue;
      envvar.path = envvar.path.substring(match[0].length).replace(/^\.*/, '')
      filteredEnvironmentVariables.push(envvar);
    }
    console.log('FILTERED!', filteredEnvironmentVariables)
  }
  environmentVariables = filteredEnvironmentVariables;
  console.log('After filter', environmentVariables)

  // Parse values and create config object
  const environmentConfig = {}
  for(const envvar of filteredEnvironmentVariables) {
    let path = envvar.path;
    let value = envvar.value || process.env[envvar.key];

    // Retreive the value and trim it
    if(value && typeof value === 'string') value = value.trim()
    value = typeifyVariable(value);

    // Set the value to the environment config
    set(environmentConfig, path, value)
  }
  console.log('Parsed environment config', environmentConfig)
  // Merge the default and environment config
  let mergedConfig = {};
  merge(mergedConfig, defaultConfig, environmentConfig);

  // Return the merged config
  return mergedConfig;
}

