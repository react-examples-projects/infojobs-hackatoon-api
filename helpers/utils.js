const chalk = require("chalk");
const extract = require("extract-json-from-string");

const message = {
  success(str) {
    console.log(chalk.greenBright(`[✔️] ${str}`) + "\n");
  },

  error(str, err = null) {
    console.error(chalk.redBright(`[❌] ${str}`) + "\n");
    err && console.error(chalk.redBright(`[❌] Error message: ${err}`) + "\n");
  },

  warn(str) {
    console.warn(chalk.yellowBright(`[⚠️] ${str}`) + "\n");
  },
};

function isRequestAjaxOrApi(req) {
  return !req.accepts("html") || req.xhr;
}

function extractJSONS(str) {
  return extract(str);
}

module.exports = {
  message,
  isRequestAjaxOrApi,
  extractJSONS,
};
