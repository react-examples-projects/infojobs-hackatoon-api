const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENIA_TOKEN,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
