const InventoryManagement = artifacts.require("InventoryManagement");

module.exports = function (deployer) {
  deployer.deploy(InventoryManagement);
};
