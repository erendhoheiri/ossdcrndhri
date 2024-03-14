const dc = require('./discord');
const { sig } = require("./utils/sig");

(async () => {
    sig();

    await dc.initialize();
    // here is where you enter your email and password
    await dc.login('username', 'password')

    await dc.likeChannelProcess('823953904512401469', '1117244509273735198', 1) // 1 = 1 minute

    debugger;

})();
