// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Poll {


    // Group
    // Group (creator )
    // add to group
    // request to join
    // Create Poll


    // struct Voter {
    //     bool voted; // check to see if voter has already voted
    //     address user;

    // }

    struct Option {
        uint pollId;
        string title;
        uint256 votes;
    }

    mapping(address => bool) public voters;
    uint256 totalVotes;

    mapping(uint => Option) public options;

    uint public optionsCount;

    event votedEvent (
        uint indexed _OptionId
    );

    constructor () {
        addOption("Option 1");
        addOption("Option 2");
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

}
    // function computeWinner() public view  {
    //     if (totalVotes > 0){
    //         return (Poll.title)
    //     }
    // } 

    