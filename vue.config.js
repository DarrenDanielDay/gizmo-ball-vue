/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const config = {
  publicPath: (process.env.DEPLOY_BASE_URL || "") + "/"
};
module.exports = config;
