// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    mapping(string => bool) private issuedHashes; // Track issued certificates

    constructor(address initialOwner) ERC721("CertificateNFT", "CNFT") Ownable(initialOwner) {}

    function issueCertificate(address recipient, string memory tokenURI, string memory certificateHash) public onlyOwner {
        require(!issuedHashes[certificateHash], "Certificate already issued");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        issuedHashes[certificateHash] = true;
    }
}
