var compresser = require("./lz-string.js");

var UNCOMPRESSED_STORIES= [
    "You finally sneak into the dragon's cave and find his treasure chest. Breathless with excitement, you open it and there is just a macaroni drawing by the dragon's son. \"IT'S TREASURE TO MEEEE!\" the dragon bellows",
    "Just go for it and give it a try! You don't have to be a professional to build a successful product. Amateurs started Google and Apple. Professionals built the Titanic",
    "Today, at my mother's funeral, her best friend of 40 years came up to me and asked me how I knew the deceased",
    "Traveling in Kenya, I met a refugee from Zimbabwe. He said he hadn't eaten anything in over 3 days and looked extremely skinny and unhealthy. I reached in my bag and offered him my sandwich. The first thing he said was, \"We can share it.\"",
    "My grandma still wears the beaded bracelet my grandpa made for her when they were in high school",
    "Today I was approached by a homeless man who asked if I had any change. I only had two dimes, but I gave it to him anyway. As I watched him walk away, he put the dimes in an expired parking meter of a strangers car",
    "My daughter who struggled to get C's in grade school owns a multi-million dollar cosmetics company. My daughter who was in the gifted program in grade school is happily employed as a kindergarten teacher making $35K a year. Makes you think",
    "A little bit of knowledge and a lot of action always trumps a lot of knowledge and no action",
    "That's the thing about people who think they hate computers. What they really hate is lousy programmers",
    "How you look at it is pretty much how you'll see it",
    "The things that make us happy, make us wise",
    "The Chinese, you know, believe that deep within each of us, no larger than the ball of your thumb, is the garden of the immortals, the great valley where we are all king forever",
    "It is not only the violin that shapes the violinist, we are all shaped by the tools we train ourselves to use, and in this respect programming languages have a devious influence: they shape our thinking",
    "Life doesn't have a CTRL-Z. Type wisely",
    "Your limitations are largely programming instilled by others that you choose to believe",
    "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week fixing the problems you created on Monday",
    "You only live once, but if you do it right, once is enough",
    "Life isn't about finding yourself. Life is about creating yourself",
    "Life is like riding a bicycle. To keep your balance, you must keep moving",
    "\"After all this time?\" \"Always,\" said Snape",
    "Tell me, what is it you plan to do with your one wild and precious life?",
    "The secret of success, though, is to fall seven times and to get up eight times",
    "I'm a success today because I had a friend who believed in me and I didn't have the heart to let him down",
    "Anybody can sympathise with the sufferings of a friend, but it requires a very fine nature to sympathise with a friend's success",
    "Moonlight floods the whole sky from horizon to horizon; How much it can fill your room depends on your windows",
    "When someone is handing something out for you, don't look at your hands, or what it is. Look at the giver",
    "It's not at all important to get it right the first time. It's really important to get it right the last time",
    "Go back? No good at all! Go sideways? Impossible! Go forward? Only thing to do! On we go!",
    "From the moment I picked your book up until I laid it down I was convulsed with laughter. Some day I intend reading it",
    "Bigamy is having one wife too many. Monogamy is the same",
    "All you need is something to do that moves you, a meaningful milestone to aspire to, and someone special to share your journey with",
    "Today, I accidentally sent a text message intended for my husband to my father-in-law. Luckily it only said \"I love you.\" My father-in-law sent me a really sweet reply and signed it \"Love, Dad\" for the first time",
    "Due to Alzheimer's and dementia, my grandfather usually can't remember who my grandmother is when he wakes up in the morning. It bothered my grandmother a year ago when it first happened, but now she's fully supportive of his condition. In fact, she plays a game every day in which she tries to get my grandfather to ask her to re-marry him before dinnertime. She hasn't failed yet",
    "Today, I met the prettiest woman on an airplane. After some small talk, and under the assumption that I wouldn't see her again after we made our connections in Atlanta, I told her how pretty I thought she was. She gave me the most sincere smile and said, \"Nobody has said that to me in 10 years.\" It turns out we’re both in our mid-30's, never married, no kids, and we live about 5 miles away from each other in Dallas. We have a date set for next Saturday after we return home",
    "Today, a homeless man whom I recognize from around the neighborhood came into my bakery and purchased a large birthday cake (I gave him a 40% discount). I curiously watched as he walked the cake across the street to another homeless man. The other man started laughing and then the two men hugged",
    "My boyfriend and I went to the county fair, rode the Ferris wheel, ate candy corn, and then he won me a stuffed teddy to celebrate my 79th birthday",
    "Today, in the grocery store parking lot, I watched a man run as fast as he could with a packed shopping cart and then jump on the back for a ride. He smiled and chuckled aloud as he rode the cart all the way to his car. He was in his mid-40's and wearing a formal suit and tie",
];

function make_stories() {
    var stories = [];
    for(var i = 0;i < UNCOMPRESSED_STORIES.length;i++) {
        var story = UNCOMPRESSED_STORIES[i];
        stories.push(to_compressed_story_object(story));
    }
    console.log(JSON.stringify(stories, null, '  '));
}

function to_compressed_story_object(story) {
    return {
        text: compresser.compressToBase64(story),
        length: story.length,
    };
}

make_stories();

