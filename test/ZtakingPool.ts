import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
use(solidity);
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
//@ts-ignore
import { ethers } from "hardhat";

import { ZtakingPool__factory, type ZtakingPool, type MockERC20, MockERC20__factory, type MigratorDefault, MigratorDefault__factory } from "../contracts/types";

const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

const MIGRATE_TYPEHASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Migrate(address user,address migratorContract,address destination,address[] tokens,uint256 signatureExpiry,uint256 nonce)"));

const getSignature = async (wallet:SignerWithAddress, verifyingContract:string, user: string, tokens: string[], migratorContract: string, destination: string, signatureExpiry:number, nonce: number) => {

    // Encoding the tokens as a keccak256 hash of the packed encoding of addresses
    const tokenHash = ethers.utils.keccak256(ethers.utils.solidityPack(["address[]"], [tokens]));

    const structEncoded = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "address", "address", "bytes32", "uint256", "uint256"],
        [MIGRATE_TYPEHASH, user, migratorContract, destination, tokenHash, signatureExpiry, nonce]
    );

    const structHash = ethers.utils.keccak256(structEncoded);
    console.log("structHash ts", structHash);

    const domain = {
        name: 'ZtakingPool',
        version: '1',
        chainId: 1337,
        verifyingContract: verifyingContract
    };

    const types = {
        Migrate: [
            { name: 'user', type: 'address' },
            { name: 'migratorContract', type: 'address' },
            { name: 'destination', type: 'address' },
            { name: 'tokens', type: 'bytes32' },
            { name: 'signatureExpiry', type: 'uint256' },
            { name: 'nonce', type: 'uint256' }
        ]
    };

    const value = {
        user,
        migratorContract,
        destination,
        tokens: tokenHash,
        signatureExpiry,
        nonce
    };
    // Signing the data
    const signature = await wallet._signTypedData(domain, types, value);

    const expectedSignerAddress = wallet.address;
    const recoveredAddress = ethers.utils.verifyTypedData(domain, types, value, signature);
    console.log(recoveredAddress === expectedSignerAddress);

    return signature;
}


describe("ZtakingPool Contract test", () => {
  let testContract: ZtakingPool, owner: SignerWithAddress, signer: SignerWithAddress, friend: SignerWithAddress, addrs: SignerWithAddress[];
  let migratorDefault: MigratorDefault;
  let token1: MockERC20, token2: MockERC20, token3: MockERC20;

  beforeEach(async () => {
    [owner, signer, friend, ...addrs] = await ethers.getSigners();
    const mockERC20Factory = new MockERC20__factory(owner);
    token1 = await mockERC20Factory.deploy("Token1", "TK1", 18);
    token2 = await mockERC20Factory.deploy("Token2", "TK2", 18);
    token3 = await mockERC20Factory.deploy("Token3", "TK3", 18);

    const ztakingPoolFactory = new ZtakingPool__factory(owner);
    testContract = await ztakingPoolFactory.deploy(signer.address, [token1.address, token2.address, token3.address, WETH_ADDRESS], WETH_ADDRESS);    

    const migratorDefaultFactory = new MigratorDefault__factory(owner);
    migratorDefault = await migratorDefaultFactory.deploy();
  });

  describe("True", () => {
    it("Should be true", async () => {
      expect(true).to.equal(true);
    });
  });

  describe("ZtakingPool test", () => {
  
    it("Should be able to migrate", async () => {
      const amount = 1000;
      await token1.mint(owner.address, amount);
      await token1.approve(testContract.address, amount);

      await testContract.depositFor(token1.address, friend.address, amount);

      // get current block timestamp
      const block = await ethers.provider.getBlock("latest");
      const signatureExpiry = block.timestamp + 1000;
      const nonce = (await testContract.nonces(friend.address)).toNumber();

      const signature = await getSignature(
          friend,
          testContract.address,
          friend.address, [token1.address], migratorDefault.address,
          friend.address, signatureExpiry, nonce
      );
  

      


      await testContract.migrateWithSig(
          friend.address, [token1.address], migratorDefault.address,
          friend.address, signatureExpiry, signature
      );
    });
  });
});
