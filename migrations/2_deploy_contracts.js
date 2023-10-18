/* eslint-disable no-undef */

const Demo_Contract = artifacts.require("ArtEon");

module.exports = async(deployer) => {
  await deployer.deploy(Demo_Contract);
};


