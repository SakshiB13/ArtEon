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

    struct Auction {
        uint256 id;
        uint256 tokenId;
        address seller;
        uint256 startPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }

    mapping(uint256 => Auction) public auctions;
    uint256 public nextAuctionId = 1;

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

    event AuctionCreated(uint256 auctionId, uint256 tokenId, address seller, uint256 startPrice, uint256 startTime, uint256 endTime);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);

    // Function to create a new auction listing

    function createAuction(uint256 tokenId, uint256 startPrice, uint256 startTime, uint256 endTime) external returns (Auction[] memory) { 
    require(ownerOf(tokenId) == msg.sender);
    require(auctions[tokenId].active == false);
    require(startTime >= block.timestamp) ;
    require(endTime > startTime);

    auctions[nextAuctionId] = Auction(nextAuctionId, tokenId, msg.sender, startPrice, 0, address(0), startTime, endTime, true);

    emit AuctionCreated(nextAuctionId, tokenId, msg.sender, startPrice, startTime, endTime);

    nextAuctionId++;
    Auction[] memory updatedAuctions = new Auction[](nextAuctionId - 1);
    for (uint256 i = 1; i < nextAuctionId; i++) {
        updatedAuctions[i - 1] = auctions[i];
    }

    return updatedAuctions;
    }

    // Function to place a bid on an auction
    function placeBid(uint256 auctionId) external payable {
        Auction storage auction = auctions[auctionId];

        require(auction.active);
        require(block.timestamp < auction.endTime);
        require(msg.value > auction.currentBid, "");

        if (auction.currentBidder != address(0)) {
            // Refund the previous bidder
            payable(auction.currentBidder).transfer(auction.currentBid);
        }

        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }
    
    // Function to end an auction and transfer the NFT to the highest bidder
    function endAuction(uint256 auctionId) external {
        Auction storage auction = auctions[auctionId];

        require(auction.active);
        require(block.timestamp >= auction.endTime);

        address winner = auction.currentBidder;
        uint256 winningBid = auction.currentBid;

        _transfer(auction.seller, winner, auction.tokenId);
        

        // Update the minted array to reflect the new owner
        for (uint256 i = 0; i < minted.length; i++) {
            if (minted[i].id == auction.tokenId) {
                minted[i].owner = winner;
                break;
            }
        }

        // Pay royalty to artist
        uint256 royalty = (winningBid * royalityFee) / 100;
        payTo(payable(address(artist)), royalty);

        // Pay remaining amount to seller
        payTo(payable(address(auction.seller)), winningBid - royalty);

        auction.active = false;
        auctions[auctionId] = auction;
    
        emit AuctionEnded(auctionId, winner, winningBid);
    }

    // Function to cancel an auction
    function cancelAuction(uint256 auctionId) external {
        Auction storage auction = auctions[auctionId];

        require(auction.active);
        require(msg.sender == auction.seller);

        auction.active = false;

        // Transfer the NFT back to the seller
        _transfer(address(this), auction.seller, auction.tokenId);
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

    function getAllAuctions() external view returns (Auction[] memory) {
    Auction[] memory allAuctions = new Auction[](nextAuctionId - 1);
    for (uint256 i = 1; i < nextAuctionId; i++) {
        allAuctions[i - 1] = auctions[i];
    }
    
    return allAuctions;
}

    
    
}