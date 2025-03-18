// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EduFund is ReentrancyGuard {
    struct Fundraiser {
        string name;
        string description;
        uint256 goal;
        uint256 amountRaised;
        address creator;
        address beneficiary;
        bool isClosed;
    }

    mapping(uint256 => Fundraiser) public fundraisers;
    uint256 public fundraiserCount;

    event FundraiserCreated(
        uint256 fundraiserId,
        string name,
        uint256 goal,
        address indexed creator,
        address indexed beneficiary
    );

    event DonationReceived(
        uint256 fundraiserId,
        address indexed donor,
        uint256 amount
    );

    event FundsWithdrawn(uint256 fundraiserId, uint256 amount, address indexed beneficiary);

    /// @notice Creates a new fundraiser
    /// @param _name The title of the fundraiser
    /// @param _description The purpose of the fundraiser
    /// @param _goal The fundraising goal (in wei)
    /// @param _beneficiary The address that will receive the funds
    function createFundraiser(
        string memory _name,
        string memory _description,
        uint256 _goal,
        address _beneficiary
    ) public {
        require(_goal > 0, "Goal must be greater than zero");
        require(_beneficiary != address(0), "Invalid beneficiary address");

        fundraisers[fundraiserCount] = Fundraiser({
            name: _name,
            description: _description,
            goal: _goal,
            amountRaised: 0,
            creator: msg.sender,
            beneficiary: _beneficiary,
            isClosed: false
        });

        emit FundraiserCreated(fundraiserCount, _name, _goal, msg.sender, _beneficiary);
        fundraiserCount++;
    }

    /// @notice Allows donors to contribute to a fundraiser
    /// @param fundraiserId The ID of the fundraiser
    function donate(uint256 fundraiserId) public payable nonReentrant {
        require(fundraiserId < fundraiserCount, "Fundraiser does not exist");
        require(msg.value > 0, "Donation must be greater than zero");
        require(!fundraisers[fundraiserId].isClosed, "Fundraiser is closed");

        fundraisers[fundraiserId].amountRaised += msg.value;

        emit DonationReceived(fundraiserId, msg.sender, msg.value);
    }

    /// @notice Allows the beneficiary to withdraw funds if the goal is met
    /// @param fundraiserId The ID of the fundraiser
    function withdrawFunds(uint256 fundraiserId) public nonReentrant {
    Fundraiser storage fundraiser = fundraisers[fundraiserId];

    require(fundraiser.creator != address(0), "Fundraiser does not exist");
    require(msg.sender == fundraiser.beneficiary, "Only the beneficiary can withdraw");
    require(fundraiser.amountRaised >= fundraiser.goal, "Goal not met yet");

    uint256 amount = fundraiser.amountRaised;
    fundraiser.amountRaised = 0;
    fundraiser.isClosed = true; // Mark fundraiser as closed

    (bool success, ) = payable(fundraiser.beneficiary).call{value: amount}("");
    require(success, "Transfer failed");

    emit FundsWithdrawn(fundraiserId, amount, fundraiser.beneficiary);
}

    /// @notice Fetches fundraiser details
    /// @param fundraiserId The ID of the fundraiser
    /// @return Fundraiser struct containing details
    function getFundraiser(uint256 fundraiserId) public view returns (Fundraiser memory) {
        require(fundraiserId < fundraiserCount, "Fundraiser does not exist");
        return fundraisers[fundraiserId];
    }

    /// @notice Returns contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
