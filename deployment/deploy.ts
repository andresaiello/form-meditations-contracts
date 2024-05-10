//@ts-ignore
import { ethers } from "hardhat";

import { ContractsKeys, deployConfigMap } from "./config";
import { deployContract, getCurrentDeploy } from "./tools";

const getDeploy = async (key: ContractsKeys, deploy: boolean) => {
  if (deploy) {
    await deployContract(deployConfigMap[key].meta);
  }
  return getCurrentDeploy(key);
};

const getContract = async (key: ContractsKeys) => {
  const data = await getDeploy(key, false);

  const factory = await ethers.getContractFactory(data.contractMeta.name);
  const contract = await factory.attach(data.address);
  return contract;
};

const deployCurves = async (): Promise<string> => {
  {
    const metaZtakingPool = deployConfigMap[ContractsKeys.ZtakingPool].meta;
    await deployContract(metaZtakingPool);
  }
  // {
  //   const metaFeeSplitter = deployConfigMap[ContractsKeys.FeeSplitter].meta;
  //   await deployContract(metaFeeSplitter);
  // }

  return "";
};

export const deployContracts = async (): Promise<string> => {
  await deployCurves();
  console.log("all contracts successfully deployed");
  return "";
};

export const postDeploy = async () => {
  console.log("post deploy routine done");
};
