// SPDX-License-Identifier: MIT
const Paypal = artifacts.require("Paypal");

module.exports = function (deployer) {
  deployer.deploy(Paypal);
};
