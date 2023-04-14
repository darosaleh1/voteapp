// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract VotedNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct NFTMetadata {
        string pollName;
        uint256 voterNumber;
        uint256 voteTimestamp;
    }

    mapping(uint256 => NFTMetadata) private _nftMetadata;

    constructor() ERC721("VotedNFT", "VNFT") {}

    function mint(address to, string memory pollName, uint256 voterNumber, uint256 voteTimestamp) public onlyOwner {
        _mint(to, _tokenIdCounter);
        _nftMetadata[_tokenIdCounter] = NFTMetadata(pollName, voterNumber, voteTimestamp);
        _tokenIdCounter++;
    }

    function tokenMetadata(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return _nftMetadata[tokenId];
    }

    function _constructTokenURI(uint256 tokenId) internal view returns (string memory) {
        NFTMetadata memory metadata = tokenMetadata(tokenId);
        string memory json = string(abi.encodePacked('{"name": "', metadata.pollName, '", "description": "Voted in the poll ', metadata.pollName, '", "voterNumber": "', Strings.toString(metadata.voterNumber), '", "voteTimestamp": "', Strings.toString(metadata.voteTimestamp), '"}'));
        string memory encodedJson = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", encodedJson));
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");

        return _constructTokenURI(tokenId);
    }
}
