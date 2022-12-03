import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import Explore from "../pages/Explore";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Mirac.eth NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmaRBTxtrEBADbiczuvDeFRrTo4g5uDHo4tTVMUu1tmFSW",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x000000",
    },
    {
        "name": "NFT#2",
        "description": "Mirac.eth NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmbKtAj16YWirB6MWB6tLodUrwtfZ4FsYphEuf51Ghi8Vj",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x00000",
    },
    {
        "name": "NFT#3",
        "description": "Mirac.eth NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmczmvN9k6wTBvQ3JrFRqjbky1vrbfhKaRTZzQMzgoK2qP",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x00000",
    },


];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <Explore></Explore>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);
            }