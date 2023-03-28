// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Poll {


    struct Option {
        uint optionId;
        string title;
        uint256 votes;
    }

    mapping(address => bool) public voters;
    uint256 totalVotes;
    mapping(uint => Option) public options;
    uint public optionsCount;
    uint public deadline;

    event votedEvent (
        uint indexed _OptionId
    );

    constructor (uint pollDuration) {
        addOption("Option 1");
        addOption("Option 2");
        deadline = block.timestamp + (pollDuration * 1 minutes);
    }

    function displayDeadline() public view returns (uint)  {
        return deadline;
    }

    function addOption (string memory _name) private {
        optionsCount ++;   
        options[optionsCount] = Option(optionsCount, _name, 0);
    }

    function vote(uint _optionId) external {
        require(!voters[msg.sender], "You have already voted!");

        require(_optionId > 0 && _optionId <= optionsCount);

        voters[msg.sender] = true;

        options[_optionId].votes ++;

        emit votedEvent(_optionId);
    }


    function pollHasEnded() external view returns (bool) {
        return block.timestamp >= deadline;
    }
}
    