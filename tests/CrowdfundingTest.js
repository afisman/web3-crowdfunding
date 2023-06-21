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
            await crowdfunding.deployed();

            const { crowdfunding, owner } = await loadFixture(async () => {
                return await deployContractAndSetVariables();
            });

            expect(crowdfunding.owner).to.equal(owner);
        });

        it('should deploy and set the number of campaigns correctly', async () => {
            await crowdfunding.deployed();

            const { crowdfunding } = await loadFixture(async () => {
                return await deployContractAndSetVariables();
            });
            const numOfCampaigns = await crowdfunding.getNumberOfCampaigns();

            expect(numOfCampaigns).to.equal(0);
        });
    })

    describe('testing campaigns', () => {
        it("should create a campaign", async () => {
            await crowdfunding.deployed();
            const { crowdfunding, otherAccount } = await loadFixture(async () => {
                return await deployContractAndSetVariables();
            });

            const owner = otherAccount;
            const title = "Test Campaign";
            const description = "Test campaign description";
            const target = 100;
            const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
            const image = "test.jpg";

            const campaignId = await crowdfunding.createCampaign(
                owner,
                title,
                description,
                target,
                deadline,
                image
            );

            assert.equal(campaignId, 0, "Campaign ID should be 0");

            const campaign = await crowdfunding.campaigns(campaignId);

            assert.equal(campaign.owner, owner, "Incorrect campaign owner");
            assert.equal(campaign.title, title, "Incorrect campaign title");
            assert.equal(campaign.description, description, "Incorrect campaign description");
            assert.equal(campaign.target, target, "Incorrect campaign target");
            assert.equal(campaign.deadline, deadline, "Incorrect campaign deadline");
            assert.equal(campaign.amountCollected, 0, "Incorrect campaign amount collected");
            assert.equal(campaign.image, image, "Incorrect campaign image");
        });
    })

    it("should donate to a campaign", async () => {
        const { crowdfunding, owner, otherAccount } = await loadFixture(async () => {
            return await deployContractAndSetVariables();
        });
        const donor = otherAccount;
        const title = "Test Campaign";
        const description = "Test campaign description";
        const target = 100;
        const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const image = "test.jpg";
        const donationAmount = 50;

        const campaignId = await crowdfunding.createCampaign(
            owner,
            title,
            description,
            target,
            deadline,
            image
        );

        await crowdfunding.donateToCampaign(campaignId, { from: donor, value: donationAmount });

        const campaign = await crowdfunding.campaigns(campaignId);

        assert.equal(campaign.amountCollected, donationAmount, "Incorrect amount collected");

        const [donators, donations] = await crowdfunding.getDonators(campaignId);

        assert.equal(donators.length, 1, "Incorrect number of donators");
        assert.equal(donators[0], donor, "Incorrect donator address");
        assert.equal(donations.length, 1, "Incorrect number of donations");
        assert.equal(donations[0], donationAmount, "Incorrect donation amount");
    });

    it("should retrieve campaign details", async () => {
        const { crowdfunding, owner } = await loadFixture(async () => {
            return await deployContractAndSetVariables();
        }); const title = "Test Campaign";
        const description = "Test campaign description";
        const target = 100;
        const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
        const image = "test.jpg";

        await crowdfunding.createCampaign(owner, title, description, target, deadline, image);

        const [donators, donations] = await crowdfunding.getDonators(0);
        const campaigns = await crowdfunding.getcampaigns();

        assert.equal(donators.length, 0, "Donators should be empty");
        assert.equal(donations.length, 0, "Donations should be empty");
        assert.equal(campaigns.length, 1, "Incorrect number of campaigns");

        const campaign = campaigns[0];

        assert.equal(campaign.owner, owner, "Incorrect campaign owner");
        assert.equal(campaign.title, title, "Incorrect campaign title");
        assert.equal(campaign.description, description, "Incorrect campaign description");
        assert.equal(campaign.target, target, "Incorrect campaign target");
        assert.equal(campaign.deadline, deadline, "Incorrect campaign deadline");
        assert.equal(campaign.amountCollected, 0, "Incorrect campaign amount collected");
        assert.equal(campaign.image, image, "Incorrect campaign image");
    });

});





