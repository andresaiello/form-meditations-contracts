import { DeployConfig } from "./tools";

export interface DeployConfigMap {
  [key: string]: {
    meta: DeployConfig;
  };
}

export enum ContractsKeys {
  ZtakingPool = "ZtakingPool",
  CurvesERC20Factory = "CurvesERC20Factory",
  CurvesGroups = "CurvesGroups",
  FeeSplitter = "FeeSplitter",
}

export const deployConfigMap: DeployConfigMap = {
  [ContractsKeys.ZtakingPool]: {
    meta: {
      create2Salt: undefined,
      isUpgradable: false,
      key: ContractsKeys.ZtakingPool,
      name: "ZtakingPool",
      params: ["0x75A3FEF67B4eD2CcF902fD288743FCa937f6593d", [], "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
    },
  },
  [ContractsKeys.CurvesGroups]: {
    meta: {
      create2Salt: undefined,
      isUpgradable: false,
      key: ContractsKeys.CurvesGroups,
      name: "CurvesGroups",
      params: [],
    },
  },
  [ContractsKeys.CurvesERC20Factory]: {
    meta: {
      create2Salt: undefined,
      isUpgradable: false,
      key: ContractsKeys.CurvesERC20Factory,
      name: "CurvesERC20Factory",
      params: [],
    },
  },
  [ContractsKeys.FeeSplitter]: {
    meta: {
      create2Salt: undefined,
      isUpgradable: false,
      key: ContractsKeys.FeeSplitter,
      name: "FeeSplitter",
      params: [],
    },
  },
};
