const getDataStorePath = function() {
  return process.env.DATA_STORE || `${__dirname}/todoData.json`;
};

module.exports = { getDataStorePath };
