// SPDX-License-Identifier: MIT

import "./IGroup.sol";

pragma solidity ^0.8.9;

contract Poll {
    struct PollData {
        string question;
        string option1;
        string option2;
        uint256 endTime;
        mapping(uint256 => uint256) votes;
        mapping(address => Vote) userVotes;
        mapping(uint256 => VoteDetails[]) voteDetails;
        bool hasEnded;
        address creator;
        uint256 duration;
        address groupAddress;
    }

    struct Vote {
        uint256 optionIndex;
        bool hasVoted;
    }

    struct VoteDetails {
        address voter;
        uint256 blockNumber;
        uint256 blockTimestamp;
        bytes32 transactionId;

    }

    PollData public pollData;

    constructor(address _creator, string memory _question, string memory _option1, string memory _option2, uint256 _duration,address _groupAddress) {
        pollData.creator = _creator;
        pollData.question = _question;
        pollData.option1 = _option1;
        pollData.option2 = _option2;
        pollData.groupAddress = _groupAddress;
        pollData.duration = _duration;

        pollData.endTime = block.timestamp + _duration;

        pollData.votes[0] = 0;
        pollData.votes[1] = 0;
    }

    function getOption(uint256 index) public view returns (string memory) {
        require(index < 2, "Invalid option index!");
        if (index == 0) {
            return pollData.option1;
        } else {
            return pollData.option2;
        }
    }

    function endPoll() public {
        require(block.timestamp > pollData.endTime, "The poll has not yet reached its end time!");
        require(!pollData.hasEnded, "The poll has already been ended!");

        pollData.hasEnded = true;
    }

    function vote(uint256 _optionIndex) public {
        require(IGroup(pollData.groupAddress).isMember(msg.sender), "Caller is not a group member!");
        require(!pollData.hasEnded, "The poll has ended!");
        require(!pollData.userVotes[msg.sender].hasVoted, "You have already voted!");
        require(_optionIndex < 2, "Invalid option!");

        pollData.userVotes[msg.sender].optionIndex = _optionIndex;
        pollData.userVotes[msg.sender].hasVoted = true;
        pollData.votes[_optionIndex]++;
        VoteDetails memory newVoteDetails = VoteDetails({
            voter: msg.sender,
            blockNumber: block.number,
            blockTimestamp: block.timestamp,
            transactionId: ""
        });
        pollData.voteDetails[_optionIndex].push(newVoteDetails);
    }

     function updateTransactionId(bytes32 _transactionId) public {
        require(pollData.userVotes[msg.sender].hasVoted, "You have not voted yet!");

        uint256 optionIndex = pollData.userVotes[msg.sender].optionIndex;
        uint256 voteDetailsLength = pollData.voteDetails[optionIndex].length;

        for (uint256 i = 0; i < voteDetailsLength; i++) {
            if (pollData.voteDetails[optionIndex][i].voter == msg.sender) {
                pollData.voteDetails[optionIndex][i].transactionId = _transactionId;
                break;
            }
        }
    }

    function getVoteDetails(uint256 _optionIndex, uint256 _startIndex, uint256 _count) public view returns (VoteDetails[] memory) {
        require(_optionIndex < 2, "Invalid option index!");

        uint256 voteDetailsLength = pollData.voteDetails[_optionIndex].length;

        if (_startIndex >= voteDetailsLength) {
            return new VoteDetails[](0);
        }

        uint256 endIndex = _startIndex + _count;
        if (endIndex > voteDetailsLength) {
            endIndex = voteDetailsLength;
        }

        uint256 resultLength = endIndex - _startIndex;
        VoteDetails[] memory voteDetailsSlice = new VoteDetails[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            voteDetailsSlice[i] = pollData.voteDetails[_optionIndex][_startIndex + i];
        }

        return voteDetailsSlice;
    }

    function hasEnded() public view returns (bool) {
        return pollData.hasEnded;
    }

    function getVoteCount(uint256 _optionIndex) public view returns (
                uint256) {
        return pollData.votes[_optionIndex];
    }

    function getUserVote(address _voterAddress) public view returns (uint256, bool) {
        Vote memory userVote = pollData.userVotes[_voterAddress];
        return (userVote.optionIndex, userVote.hasVoted);
    }

   function getWinner() public view returns (string memory) {
        require(pollData.hasEnded, "The poll has not ended yet!");
        uint256 winningOptionIndex = 0;
        uint256 maxVotes = 0;
        bool isTie = false;

        for (uint256 i = 0; i < 2; i++) {
            uint256 optionVotes = pollData.votes[i];
            if (optionVotes > maxVotes) {
                maxVotes = optionVotes;
                winningOptionIndex = i;
                isTie = false;
            } else if (optionVotes == maxVotes) {
                isTie = true;
            }
        }

        if (isTie) {
            return "tie";
        } else {
            if (winningOptionIndex == 0) {
                return pollData.option1;
            } else {
                return pollData.option2;
            }
        }
    }
  

}


    