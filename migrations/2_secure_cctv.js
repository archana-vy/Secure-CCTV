const SecureCCTV = artifacts.require("SecureCCTV");

module.exports = function(deployer) {
  deployer.deploy(SecureCCTV);
};
