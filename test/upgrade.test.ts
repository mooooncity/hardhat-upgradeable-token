import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("UUPS upgrade", function () {
  it("deploys V1 and upgrades to V2", async function () {
    const [owner, user] = await ethers.getSigners();
    const V1 = await ethers.getContractFactory("TokenV1");
    const proxy = await upgrades.deployProxy(V1, ["MyToken", "MTK"], { kind: "uups" });
    await proxy.waitForDeployment();
    await proxy.connect(owner).mint(user.address, 100n);
    expect(await proxy.balanceOf(user.address)).to.equal(100n);

    const V2 = await ethers.getContractFactory("TokenV2");
    const v2 = await upgrades.upgradeProxy(await proxy.getAddress(), V2, {
      unsafeAllow: ["missing-initializer-call"],
    });
    await v2.waitForDeployment();
    await v2.connect(owner).initializeV2();
    await v2.connect(owner).pause();
    await expect(v2.connect(user).transfer(owner.address, 1n)).to.be.reverted;
  });
});
