// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

enum CrowdfundingState {
    active,
    finished
}

contract Crowdfunding {
    address public owner;
    uint256 public numberOfCampaigns;

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        CrowdfundingState state;
    }

    mapping(uint256 => Campaign) public campaigns;

    event Deployed(address indexed owner);

    event CampaignCreated(
        address indexed owner,
        uint target,
        CrowdfundingState isActive
    );

    event Donation(address indexed donator, uint donation);

    event CampaignEnded(uint256 _id);

    constructor() {
        emit Deployed(msg.sender);
        owner = msg.sender;
        numberOfCampaigns = 0;
    }

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        emit CampaignCreated(_owner, _target, CrowdfundingState.active);

        require(
            block.timestamp < campaign.deadline,
            "The deadline should be in the future"
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.amountCollected = 0;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.state = CrowdfundingState.active;
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];
        require(
            campaign.state == CrowdfundingState.active,
            "The campaign has already finished"
        );

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        emit Donation(msg.sender, amount);

        (bool success, ) = payable(campaign.owner).call{value: amount}("");
        if (success) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }

        if (
            campaign.amountCollected >= campaign.target ||
            campaign.deadline > block.timestamp
        ) {
            campaign.state = CrowdfundingState.finished;

            emit CampaignEnded(_id);
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getcampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaings = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaings[i] = item;
        }

        return allCampaings;
    }

    function getNumberOfCampaigns() public view returns (uint256) {
        return numberOfCampaigns;
    }
}
