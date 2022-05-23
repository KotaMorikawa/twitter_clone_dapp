const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Twitter Contract", function() {
    let Twitter;
    let twitter;
    let owner;

    const NUM_TOTAL_NOT_MY_TWEETS = 5;
    const NUM_TOTAL_MY_TWEETS = 3;

    let totalTweets;
    let totalMyTweets;

    beforeEach(async function() {
        Twitter = await ethers.getContractFactory("TwitterContract");
        [owner, addr1, addr2] = await ethers.getSigners();
        twitter = await Twitter.deploy();

        totalTweets = [];
        totalMyTweets = [];

        for (let i=0; i<NUM_TOTAL_NOT_MY_TWEETS; i++) {
            let tweet = {
                'tweetText': 'Ramdom text with id:- ' + i,
                'username': addr1,
                'isDeleted': false,
            };

            await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
        }

        for (let i=0; i<NUM_TOTAL_MY_TWEETS; i++) {
            let tweet = {
                'tweetText': 'Ramdom text with id:- ' + (NUM_TOTAL_NOT_MY_TWEETS+i),
                'username': owner,
                'isDeleted': false,
            };
            
            await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
        }
    });

    describe("Add Tweet", function() {
        it("Should emit AddTweet event", async function() {
            let tweet = {
                'tweetText': 'New Tweet',
                'isDeleted': false, 
            };

            await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted)
        ).to.emit(twitter, 'AddTweet').withArgs(owner.address, NUM_TOTAL_NOT_MY_TWEETS+NUM_TOTAL_MY_TWEETS)
        })
    });

    describe("Get All Tweets", function() {
        it("should return the correnct number of total tweets", async function() {
            const tweetsFromChain = await twitter.getAllTweets();
            expect(tweetsFromChain.length).to.equal(NUM_TOTAL_NOT_MY_TWEETS+NUM_TOTAL_MY_TWEETS)
        })

        it("shoud return the correct number of all my tweets", async function() {
            const myTweetsFormChain = await twitter.getMyTweets();
            expect(myTweetsFormChain.length).to.equal(NUM_TOTAL_MY_TWEETS);
        })
    });

    describe("Delete Tweets", function() {
        it("should emit delete Tweet event", async function() {
            const TWEET_ID = 0;
            const TWEET_DELETED = true;

            await expect(
                twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED)
            ).to.emit(
                twitter, "DeleteTweet"
            ).withArgs(
                TWEET_ID, TWEET_DELETED
            );
        })
    });
})