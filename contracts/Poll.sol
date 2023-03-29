// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Poll {
    struct PollData {
        string question;
        string[] options;
        uint256 endTime;
        mapping(uint256 => uint256) votes; // optionIndex => voteCount
        mapping(address => Vote) userVotes; // voterAddress => Vote
        bool hasEnded;
        address creator;
    }

    struct Vote {
        uint256 optionIndex;
        bool hasVoted;
    }

    PollData public pollData;

    constructor(address _creator, string memory _question, string memory _option1, string memory _option2, uint256 _duration) {
        pollData.creator = _creator;
        pollData.question = _question;
        pollData.options.push(_option1);
        pollData.options.push(_option2);
        pollData.endTime = block.timestamp + _duration;
    }

    function vote(uint256 _optionIndex) public {
        require(block.timestamp < pollData.endTime, "The poll has already ended.");
        require(!pollData.userVotes[msg.sender].hasVoted, "You have already voted.");
        require(_optionIndex < pollData.options.length, "Invalid option index.");

        pollData.userVotes[msg.sender].optionIndex = _optionIndex;
        pollData.userVotes[msg.sender].hasVoted = true;
        pollData.votes[_optionIndex]++;
    }

}

    