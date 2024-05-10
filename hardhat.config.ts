import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-preprocessor";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

import { HashZero } from "@ethersproject/constants";
import type { HardhatUserConfig } from "hardhat/types";
if (process.env.DOCKER) {
  require("hardhat-ethernal");
}
import { removeConsoleLog } from "hardhat-preprocessor";

import { getHardhatConfigNetworks } from "./hardhat.config.networks";
import { getHardhatConfigScanners } from "./hardhat.config.scanners";

const PRIVATE_KEY = `${process.env.PRIVATE_KEY || HashZero.slice(2)}`;

const config: HardhatUserConfig = {
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
  },
  etherscan: {
    ...getHardhatConfigScanners(),
    //@ts-ignore
    customChains: [
      {
        chainId: 132902,
        network: "formtestnet",
        urls: {
          apiURL: "https://testnet-explorer.form.network/api",
          browserURL: "https://testnet-explorer.form.network",
        },
      },
    ],
  },
  networks: {
    ...getHardhatConfigNetworks([`0x${PRIVATE_KEY}`]),
  },
  preprocess: {
    eachLine: removeConsoleLog((hre) => {
      return hre.network.name !== "hardhat" && hre.network.name !== "localhost";
    }),
  },

  solidity: {
    compilers: [
      {
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
        version: "0.8.24",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

  //@ts-ignore
  typechain: {
    outDir: "contracts/types",
  },
};

export default config;
