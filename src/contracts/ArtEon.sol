// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtEon is ERC721Enumerable, Ownable {
    using Strings for uint256;
    mapping(string => uint8) existingURIs;
    mapping(uint256 => address) public holderOf;
    mapping(uint256 => address) private tokenOwners;

    address public artist;
    uint256 public royalityFee;
    uint256 public supply = 0;
    uint256 public totalTx = 0;
    uint256 public cost = 0.01 ether;

    event Sale(
        uint256 id,
        address indexed owner,
        uint256 cost,
        string metadataURI,
        //string phash,
        uint256 timestamp
    );

    struct TransactionStruct {
    uint256 id;
    address owner;
    uint256 cost;
    string title;
    string description;
    string metadataURI;
    uint256 timestamp;
}


    TransactionStruct[] transactions;
    TransactionStruct[] minted;


    constructor(
        string memory __name,
        string memory __symbol,
        uint256 _royalityFee,
        address _artist
    ) ERC721(__name, __symbol)
    Ownable(msg.sender) {
        royalityFee = _royalityFee;
        artist = _artist;
    }
    
    function payToMint(
    string memory title,
    string memory description,
    string memory metadataURI,
    uint256 salesPrice
) external payable {
    require(msg.value >= cost);
    require(existingURIs[metadataURI] == 0);

    uint256 royalty = (msg.value * royalityFee) / 100;
    payTo(payable(address(artist)), royalty);
    payTo(payable(address(owner())), (msg.value - royalty));

    supply++;

    minted.push(
        TransactionStruct(
            supply,
            msg.sender,
            salesPrice,
            title,
            description,
            metadataURI,
    
            block.timestamp
        )
    );

    emit Sale(
        supply,
        msg.sender,
        msg.value,
        metadataURI,
        block.timestamp    
    );

    _safeMint(msg.sender, supply);
    existingURIs[metadataURI] = 1;
    holderOf[supply] = msg.sender;
   }


    function payToBuy(uint256 id) external payable {
        require(msg.value >= minted[id - 1].cost);
        require(msg.sender != minted[id - 1].owner);

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(payable(address(artist)), royality);
        payTo(payable(address(minted[id - 1].owner)), (msg.value - royality));

        totalTx++;

        transactions.push(
            TransactionStruct(
                totalTx,
                msg.sender,
                msg.value,
                minted[id - 1].title,
                minted[id - 1].description,
                minted[id - 1].metadataURI,
               
                block.timestamp        
            )
        );

        emit Sale(
            totalTx,
            msg.sender,
            msg.value,
            minted[id - 1].metadataURI,
            block.timestamp     
        );
        
        minted[id - 1].owner = msg.sender;
    }

    function changePrice(uint256 id, uint256 newPrice) external returns (bool) {
        require(newPrice > 0 ether);
        require(msg.sender == minted[id - 1].owner);

        minted[id - 1].cost = newPrice;
        return true;
    }

    function payTo(address payable to, uint256 amount) internal {
    require(address(this).balance >= amount, "Insufficient contract balance");
    (bool success, ) = to.call{value: amount}("");
    require(success, "Payment failed");
    }


    function getAllNFTs() external view returns (TransactionStruct[] memory) {
        return minted;
    }

    function getNFT(uint256 id) external view returns (TransactionStruct memory) {
    TransactionStruct memory nft = minted[id - 1];
    return nft;
    }

    function getAllTransactions() external view returns (TransactionStruct[] memory) {
        return transactions;
    }

    function getNFTsByAddress(address _owner) external view returns (TransactionStruct[] memory) {
    uint256 count = balanceOf(_owner);
    TransactionStruct[] memory ownedNFTs = new TransactionStruct[](count);
    
    uint256 currentIndex = 0;
    for (uint256 i = 0; i < minted.length; i++) {
        if (ownerOf(i + 1) == _owner) {
            ownedNFTs[currentIndex] = minted[i];
            currentIndex++;
        }
    }
    
    return ownedNFTs;
    }
    
}