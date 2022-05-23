import React from "react";
import { useState, useEffect } from "react";
import "../style/Feed.css";
import TweetBox from "../components/TweetBox";
import Post from "../components/Post";
import FlipMove from "react-flip-move";
import axios from "axios";
import {TwitterContractAddress} from '../config.js';
import {ethers} from 'ethers';
import Twitter from '../utils/TwitterContract.json';
import { Provider } from "@ethersproject/abstract-provider";

function Feed() {

    const [posts, setPosts] = useState([]);

    const getUpdatedTweets = (allTweets, address) => {
        let updatedTweets = [];
        for (let i=0; i<allTweets.length; i++) {
            if (allTweets[i].username.toLowerCase() == address.toLowerCase()) {
                let tweet = {
                    'id': allTweets[i].id,
                    'tweetText': allTweets[i].tweetText,
                    'isDeleted': allTweets[i].isDeleted,
                    'username': allTweets[i].username,
                    'personal': true
                };
                updatedTweets.push(tweet);
            } else {
                let tweet = {
                    'id': allTweets[i].id,
                    'tweetText': allTweets[i].tweetText,
                    'isDeleted': allTweets[i].isDeleted,
                    'username': allTweets[i].username,
                    'personal': false
                }
                updatedTweets.push(tweet);
            }
        }
        return updatedTweets;
    }

    const getAllTweets = async() => {
        try {
            const {ethereum} = window
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const TwitterContract = new ethers.Contract(
                    TwitterContractAddress,
                    Twitter.abi,
                    signer
                )
                let allTweets = await TwitterContract.getAllTweets();
                setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
            } else {
                console.log("Ethereum object doesn't exist");
            }
        } catch (error) {
            console.log(error);
        }
    } 
    
    useEffect(() => {
        getAllTweets();
    }, [])

    const deleteTweet = key => async() => {
        console.log(key);
        try {
            const {ethereum} = window
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const TwitterContract = new ethers.Contract(
                    TwitterContractAddress,
                    Twitter.abi,
                    signer
                )
                let deleteTweetTx = await TwitterContract.deleteTweet(key, true);
                let allTweets = await TwitterContract.getAllTweets();
                setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
            } else {
                console.log("Ethereum object doesn't exist");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="feed">
            <div className="feed__header">
                <h2>Home</h2>
            </div>

            <TweetBox />

            <FlipMove>
                {posts.map((post) => (
                    <Post 
                        key={post.id}
                        displayName={post.username}
                        text={post.tweetText}
                        personal={post.personal}
                        onClick={deleteTweet(post.id)}
                    />
                ))}
            </FlipMove>
        </div>
    );
}

export default Feed;