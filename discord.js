const puppeteer = require('puppeteer-core');
const { types } = require('./utils/types');

// list all the words here, will pick them randomly, doesn't matter how many!
// const words = [
//   'Wah, proyek BURNT keren banget deh!',
//   'Tim di BURNT tuh bener-bener ahli semua.',
//   'Pasti deh, BURNT bakal ngeguncang industri ini.',
//   'Konsep di BURNT tuh asik banget, ngebahas yang lagi kekinian.',
//   'Gila, BURNT bisa bikin perubahan besar nih.',
//   'Aku 100% dukung visi dan misi BURNT!',
//   'Teknologi yang dipake BURNT keren banget, bikin kagum.',
//   'Yakin deh, BURNT bakal jadi kesuksesan besar.',
// ];
const getRandomIndonesianMessage = () => {
  const greetings = ['Hoi,', 'Woy', 'Hmm', 'Coy,', 'Cok,'];

  const activities = [
    'lagi pada sibuk amat',
    'sedang mengbadut terus.',
    'jalan-jalan ke pasar malem, jangan lupa membeli seblak',
    'bosen, pengennya dapet JP aja.',
    'sedang orang-orang mengbadut.',
    'jangan lupa ngopi.',
    'udah pada makannn belommm.',
    'nikmati hari-hari liat orang dapet jepeh.'
  ];

  const expressions = [
    'semangat terus ya!',
    'seru nih.',
    'jangan pernah semangat',
    'huft',
    'turuuu',
    'gabutttt',
    'kok bisaaa'
  ];

  const emojis = ['😊', '🌟', '🍜', '📺', '🎉', '🤔', '💻'];

  const randomMessages = [];

  for (let i = 0; i < 100; i++) {
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];
    const randomExpression =
      expressions[Math.floor(Math.random() * expressions.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const message = `${randomGreeting} ${randomActivity} ${randomExpression}`;
    randomMessages.push(message);
  }

  return randomMessages;
};

const words = getRandomIndonesianMessage();
let logCount = 0;

// 823953904512401469/1117244509273735198

const BASE_URL =
  'https://discord.com/channels/823953904512401469/1117244509273735198';
// change this & enter the channel url
const discord = {
  browser: null,
  page: null,

  initialize: async () => {
    discord.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
      args: ['--start-maximized']
    });

    discord.page = await discord.browser.newPage();
  },

  /**
   * username and password
   * @param {string} username
   * @param {string} password
   * @return {Promise<void>}
   */

  login: async (username, password) => {
    let a = await discord.page.goto(BASE_URL, {
      waitUntil: 'networkidle2'
    });

    // let loginButton = await discord.page.$x('//a[contains(., "Login")]');
    // await discord.page.waitFor(5000);
    // /* Click on login url button */
    // await loginButton[1].click();

    // await discord.page.waitForNavigation({
    //   waitUntil: 'networkidle2'
    // });

    // await discord.page.waitFor(100);

    /* username and password */

    await discord.page.type('input[name="email"]', username, {
      delay: 100
    });

    await discord.page.type('input[name="password"]', password, {
      delay: 110
    });

    /* clicking on login button */

    loginButton = await discord.page.$x('//div[contains(text(), "Log In")]');
    await loginButton[0].click();

    await discord.page.waitFor(1000);
  },

  /**
   * Enter server id and channel urk
   * @param { string } serverID
   * @param { string } channelID
   * @param { number } delay
   * @return {Promise<void>}
   */

  likeChannelProcess: async (serverID, channelID, delay = 1) => {
    types('string', serverID);
    types('string', channelID);
    const CHANNELS_URL = `https://discord.com/channels/${serverID}/${channelID}`;

    await discord.page.goto(CHANNELS_URL, {});
    await discord.page.waitFor(9000);

    async function initalStart() {
      await discord.page.type(
        'span[data-slate-node="text"]',
        'Pada ngapain sihhhh',
        {
          delay: 100
        }
      );

      await discord.page.keyboard.press('Enter');

      console.debug('Auto typer started ' + new Date());
    }

    await initalStart();

    async function randomWord() {
      const random = words[Math.floor(Math.random() * words.length)];
      await discord.page.type('span[data-slate-node="text"]', random, {
        delay: 100
      });

      await discord.page.keyboard.press('Enter');

      logCount++;

      // this logs the time the message was sent at and the total message count
      console.debug(
        'Message sent: ' +
          random +
          ' , at: ' +
          new Date() +
          ', Message Count: ' +
          logCount
      );
    }

    // change the first number for minutes
    // 3 * 60 * 1000 = 180000ms === 3 minutes
    setInterval(randomWord, 1 * 60 * 500);
  }
};

module.exports = discord;
