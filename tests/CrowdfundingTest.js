const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, assert } = require('chai');
const { ethers } = require('hardhat')
require('dotenv/config');

describe('Crowdfunding', async function () {

    let crowdfunding;

    async function deployContractAndSetVariables() {
        const Crowdfunding = await ethers.getContractFactory('Crowdfunding');
        crowdfunding = await Crowdfunding.deploy();

        await crowdfunding.deployed();

        const [owner, otherAccount] = await ethers.getSigners();


        return { crowdfunding, owner, otherAccount };
    }
    describe('Deployment', () => {
        it("Should deploy a Crowdfunding", async function () {
            const { crowdfunding } = await loadFixture(deployContractAndSetVariables);

            expect(crowdfunding.address).to.not.be.empty;
        });

        it('should deploy and set the number of campaigns correctly', async () => {
            const { crowdfunding } = await loadFixture(deployContractAndSetVariables);

            expect(await crowdfunding.getNumberOfCampaigns()).to.equal(ethers.BigNumber.from(0));
        });
    })




});

// describe('after creating a campaign', () => {

//     before(async () => {
//         await crowdfunding.createCampaign();
//     })


// });

// const Crowdfunding = artifacts.require("Crowdfunding");




// describe("Crowdfunding", (accounts) => {
//     let crowdfunding = Crowdfunding;

//     beforeEach(async () => {
//         const Crowdfunding = await ethers.getContractFactory('Crowdfunding');
//         crowdfunding = await Crowdfunding.deploy();

//     });

//     describe('testing campaigns', () => {
//         it("should create a campaign", async () => {
//             await crowdfunding.deployed();

//             const owner = accounts[0];
//             const title = "Test Campaign";
//             const description = "Test campaign description";
//             const target = 100;
//             const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
//             const image = "test.jpg";

//             const campaignId = await crowdfunding.createCampaign(
//                 owner,
//                 title,
//                 description,
//                 target,
//                 deadline,
//                 image
//             );

//             assert.equal(campaignId, 0, "Campaign ID should be 0");

//             const campaign = await crowdfunding.campaigns(campaignId);

//             assert.equal(campaign.owner, owner, "Incorrect campaign owner");
//             assert.equal(campaign.title, title, "Incorrect campaign title");
//             assert.equal(campaign.description, description, "Incorrect campaign description");
//             assert.equal(campaign.target, target, "Incorrect campaign target");
//             assert.equal(campaign.deadline, deadline, "Incorrect campaign deadline");
//             assert.equal(campaign.amountCollected, 0, "Incorrect campaign amount collected");
//             assert.equal(campaign.image, image, "Incorrect campaign image");
//         });
//     })


//     it("should donate to a campaign", async () => {
//         const owner = accounts[0];
//         const donor = accounts[1];
//         const title = "Test Campaign";
//         const description = "Test campaign description";
//         const target = 100;
//         const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
//         const image = "test.jpg";
//         const donationAmount = 50;

//         const campaignId = await crowdfunding.createCampaign(
//             owner,
//             title,
//             description,
//             target,
//             deadline,
//             image
//         );

//         await crowdfunding.donateToCampaign(campaignId, { from: donor, value: donationAmount });

//         const campaign = await crowdfunding.campaigns(campaignId);

//         assert.equal(campaign.amountCollected, donationAmount, "Incorrect amount collected");

//         const [donators, donations] = await crowdfunding.getDonators(campaignId);

//         assert.equal(donators.length, 1, "Incorrect number of donators");
//         assert.equal(donators[0], donor, "Incorrect donator address");
//         assert.equal(donations.length, 1, "Incorrect number of donations");
//         assert.equal(donations[0], donationAmount, "Incorrect donation amount");
//     });

//     it("should retrieve campaign details", async () => {
//         const owner = accounts[0];
//         const title = "Test Campaign";
//         const description = "Test campaign description";
//         const target = 100;
//         const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
//         const image = "test.jpg";

//         await crowdfunding.createCampaign(owner, title, description, target, deadline, image);

//         const [donators, donations] = await crowdfunding.getDonators(0);
//         const campaigns = await crowdfunding.getcampaigns();

//         assert.equal(donators.length, 0, "Donators should be empty");
//         assert.equal(donations.length, 0, "Donations should be empty");
//         assert.equal(campaigns.length, 1, "Incorrect number of campaigns");

//         const campaign = campaigns[0];

//         assert.equal(campaign.owner, owner, "Incorrect campaign owner");
//         assert.equal(campaign.title, title, "Incorrect campaign title");
//         assert.equal(campaign.description, description, "Incorrect campaign description");
//         assert.equal(campaign.target, target, "Incorrect campaign target");
//         assert.equal(campaign.deadline, deadline, "Incorrect campaign deadline");
//         assert.equal(campaign.amountCollected, 0, "Incorrect campaign amount collected");
//         assert.equal(campaign.image, image, "Incorrect campaign image");
//     });

//     it("should handle edge cases and constraints", async () => {
//         const owner = accounts[0];
//         const title = "Test Campaign";
//         const description = "Test campaign description";
//         const target = 100;
//         const deadline = Math.floor(Date.now() / 1000) - 3600; // Past deadline
//         const image = "test.jpg";

//         await truffleAssert.reverts(
//             crowdfunding.createCampaign(owner, title, description, target, deadline, image),
//             "The deadline should be in the future"
//         );

//         const nonExistentCampaignId = 999;

//         await truffleAssert.reverts(
//             crowdfunding.donateToCampaign(nonExistentCampaignId, { value: 50 }),
//             "Campaign does not exist"
//         );

//         const donationAmount = 0;

//         await truffleAssert.reverts(
//             crowdfunding.donateToCampaign(0, { value: donationAmount }),
//             "Invalid donation amount"
//         );

//         await crowdfunding.createCampaign(owner, title, description, target, deadline + 3600, image);

//         const campaigns = await crowdfunding.getcampaigns();
//         const campaign = campaigns[0];

//         await truffleAssert.reverts(
//             crowdfunding.donateToCampaign(0, { from: accounts[1], value: 200 }),
//             "Campaign target already reached"
//         );

//         const initialBalance = web3.utils.toBN(await web3.eth.getBalance(owner));
//         await crowdfunding.donateToCampaign(0, { value: 50 });
//         const finalBalance = web3.utils.toBN(await web3.eth.getBalance(owner));

//         assert(finalBalance.sub(initialBalance).toNumber() === 50, "Owner did not receive the correct payout amount");
//     });
// });




