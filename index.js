#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");
const readline = require("readline");
const { Command } = require("commander");
const config = require("./config.json");

const program = new Command();

program
  .option("-l, --list <names>", "Provide a JSON array of names to use")
  .option(
    "-a, --add <name>",
    "Add a name to the list",
    (value, previous) => {
      return previous ? [...previous, value] : [value];
    },
    [],
  )
  .option(
    "-r, --remove <name>",
    "Remove a name from the list",
    (value, previous) => {
      return previous ? [...previous, value] : [value];
    },
    [],
  );

program.parse();

const options = program.opts();

let availableNames = [];

if (options.list) {
  try {
    availableNames = JSON.parse(options.list);
    if (!Array.isArray(availableNames)) {
      console.error(chalk.red("Error: --list must be a valid JSON array"));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red("Error: Invalid JSON format for --list option"));
    console.error(chalk.yellow('Example: -l \'["Name1", "Name2", "Name3"]\''));
    process.exit(1);
  }
} else {
  availableNames = [...config.names];
}

if (options.add && options.add.length > 0) {
  availableNames = [...availableNames, ...options.add];
}

if (options.remove && options.remove.length > 0) {
  availableNames = availableNames.filter(
    (name) => !options.remove.includes(name),
  );
}

const personalities = {
  cool: ["😎", "🕶️", "🔥", "💪", "🏆", "💯", "⚡", "🤘", "👑", "🎸"],
  smart: ["🧠", "📚", "💡", "🎓", "🤓", "📖", "🔬", "✍️", "🧪", "📝"],
  sporty: ["⚽", "🏃", "💪", "🎾", "🏋️", "🏀", "⚡", "🥇", "🎯", "🔥"],
  girly: ["💖", "🌸", "💅", "👗", "💐", "🦋", "🌺", "✨", "🎀", "🌷"],
  technical: ["💻", "⚙️", "🔧", "🤖", "⚡", "🖥️", "🔌", "📡", "🛠️", "⌨️"],
  artistic: ["🎨", "🖌️", "🎭", "🖼️", "✨", "🌈", "🎪", "🦄", "💫", "🎬"],
  adventurous: ["🗺️", "🏔️", "🧭", "⛺", "🚀", "🌍", "🏕️", "🎒", "🔭", "🌠"],
  foodie: ["🍕", "🍔", "🍰", "🍜", "🥘", "🍣", "🧁", "🍪", "☕", "🥗"],
  musical: ["🎵", "🎶", "🎸", "🎹", "🎤", "🥁", "🎺", "🎼", "🎧", "🔊"],
  relaxed: ["😌", "🧘", "🌿", "☮️", "🍃", "🕊️", "💆", "🛋️", "🌾", "🧖"],
  energetic: ["⚡", "💥", "🔋", "🎆", "🌟", "💫", "✨", "🎇", "⭐", "🔥"],
  mysterious: ["🔮", "🌙", "⭐", "🦇", "🎩", "🕵️", "🌌", "🔐", "🗝️", "👁️"],
  funny: ["😂", "🤣", "😆", "🤪", "😜", "🤡", "🎉", "🎊", "🥳", "😹"],
  earthy: ["🌳", "🌻", "🌺", "🍀", "🌿", "🌾", "🦋", "🐝", "🌼", "🌷"],
  gamer: ["🎮", "🕹️", "👾", "🎯", "🏆", "💥", "⚔️", "🛡️", "🎲", "🃏"],
  romantic: ["💕", "💘", "💝", "💗", "💓", "💞", "💑", "🌹", "💐", "😍"],
  sleepy: ["😴", "💤", "🛏️", "🌙", "⭐", "🌛", "😪", "🥱", "☁️", "🌜"],
  magical: ["✨", "🪄", "🔮", "🌟", "⭐", "💫", "🦄", "🧚", "🌈", "🎆"],
  serious: ["🤨", "📋", "⚖️", "🎯", "📊", "💼", "🔍", "📈", "🧐", "⏰"],
  wild: ["🦁", "🐅", "🦅", "🐺", "🌪️", "🔥", "⚡", "💥", "🦖", "🌋"],
  peaceful: ["☮️", "🕊️", "🌸", "🌺", "🍃", "🌾", "💮", "🏵️", "🌼", "🦢"],
  piratey: ["🏴‍☠️", "⚓", "🦜", "🗡️", "💎", "🏝️", "🚢", "🧭", "🪙", "🍻"],
  cosmic: ["🌌", "🪐", "🌠", "☄️", "🛸", "👽", "🚀", "🌙", "⭐", "✨"],
  festive: ["🎉", "🎊", "🎈", "🎁", "🎀", "🥳", "🎂", "🍾", "🎆", "🎇"],
  creative: ["💡", "✏️", "🖊️", "📐", "🎨", "💭", "🧩", "🔧", "⚙️", "🛠️"],
  luxurious: ["💎", "👑", "🏰", "💰", "🥂", "✨", "🌟", "💫", "🎩", "👔"],
  spicy: ["🌶️", "🔥", "💥", "⚡", "🥵", "😈", "👹", "💢", "🎇", "💃"],
  vintage: ["📻", "📞", "📷", "🎞️", "🕰️", "🎩", "👒", "🎺", "🎹", "🎻"],
  royal: ["👑", "🏰", "🦁", "👸", "🤴", "💎", "🗡️", "🛡️", "🏆", "⚜️"],
  stealthy: ["🥷", "⚔️", "🗡️", "🥋", "🌙", "⚡", "💨", "🔪", "🎯", "🌑"],
  wizardly: ["🧙", "🪄", "📚", "🔮", "⚡", "🌟", "🦉", "🧪", "📜", "🏰"],
  beachy: ["🏖️", "🌊", "🏄", "🐚", "🌴", "☀️", "🕶️", "🍹", "⛱️", "🦀"],
  dreamy: ["💭", "☁️", "🌙", "⭐", "✨", "🦋", "🌈", "💫", "🎨", "🌸"],
  groovy: ["🪩", "💃", "🕺", "🎵", "🎶", "✨", "🌈", "🎉", "🎊", "💫"],
  rebellious: ["🤘", "🎸", "💀", "🔥", "⚡", "💥", "🏴", "⛓️", "🎯", "💣"],
  fancy: ["🎩", "🍾", "💎", "🌟", "✨", "🥂", "🎭", "💄", "👔", "🦢"],
  silly: ["🤡", "🙃", "🤪", "😜", "🎈", "🎪", "🎊", "🤹", "🎭", "🎉"],
  savage: ["🦖", "🐉", "🔥", "💥", "⚡", "🗡️", "⚔️", "💪", "😤", "👊"],
  chill: ["🧊", "❄️", "🏔️", "🌨️", "⛷️", "🎿", "🥶", "💙", "🌊", "🐧"],
  tropical: ["🌴", "🥥", "🍹", "🦜", "🌺", "🏝️", "🐠", "☀️", "🌊", "🦩"],
  retro: ["📼", "💾", "📟", "🕹️", "📺", "🎧", "🎸", "🎤", "💿", "📻"],
  glowy: ["💡", "🌈", "✨", "💫", "🌟", "⚡", "💥", "🔥", "🎆", "🎇"],
  tranquil: ["🧘", "☯️", "🕉️", "🌸", "🍃", "🌿", "💮", "🎋", "🧖", "🌾"],
  culinary: ["👨‍🍳", "🍳", "🥘", "🍽️", "🔪", "🧂", "🥄", "🍴", "🧑‍🍳", "👩‍🍳"],
  spacey: ["🚀", "🛸", "🌌", "🪐", "👨‍🚀", "🌠", "☄️", "🛰️", "👽", "🌙"],
  kawaii: ["🥺", "💗", "🌸", "🎀", "✨", "🦄", "🍓", "🧁", "💖", "🌈"],
  spooky: ["👻", "🎃", "🦇", "🕷️", "🕸️", "💀", "🧟", "🌙", "🔮", "🕯️"],
  classy: ["🍷", "🎩", "💼", "📚", "🖋️", "☕", "🎻", "🥃", "🎭", "🏛️"],
  electric: ["⚡", "🔌", "💡", "⚙️", "🔋", "💥", "⚗️", "🧲", "🔬", "💫"],
  jungle: ["🦍", "🐒", "🦜", "🐍", "🌴", "🌿", "🦎", "🐊", "🌺", "🦧"],
  oceany: ["🐋", "🐠", "🦈", "🐙", "🌊", "🐚", "🦑", "🦀", "🏄", "⛵"],
  party: ["🥳", "🎊", "🎉", "🎈", "🍾", "💃", "🕺", "🎵", "🎶", "🪩"],
  elegant: ["🦢", "🌹", "💎", "✨", "🎀", "🌸", "💫", "🌟", "🦋", "🏰"],
  fierce: ["🦁", "🐯", "🔥", "💪", "⚡", "👊", "💥", "🦅", "🗡️", "🏹"],
  bubbly: ["🫧", "💭", "✨", "🎈", "💫", "🌟", "🎊", "💖", "🦋", "🌈"],
};

const namePersonalities = {};

let isAnimating = false;

function getRandomPersonality() {
  const personalityKeys = Object.keys(personalities);
  return personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
}

function getRandomEmoji(name) {
  if (!namePersonalities[name]) {
    namePersonalities[name] = getRandomPersonality();
  }
  const personalityEmojis = personalities[namePersonalities[name]];
  return personalityEmojis[
    Math.floor(Math.random() * personalityEmojis.length)
  ];
}

function clearScreen() {
  console.clear();
}

function displayTitle() {
  const title = figlet.textSync("TEAM SPINNER 3000", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(gradient.atlas(title));
  console.log("\n");
}

function displayName(name, isSelected = false) {
  clearScreen();
  displayTitle();
  const personality = namePersonalities[name];

  const nameText = figlet.textSync(`${personality || ""} ${name}`, {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  if (isSelected) {
    const emojis = Array.from({ length: 10 }, () => getRandomEmoji(name)).join(
      " ",
    );
    const surroundEmojis = Array.from({ length: 5 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    const emojiRow1 = Array.from({ length: 30 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    const emojiRow2 = Array.from({ length: 30 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    const emojiRow3 = Array.from({ length: 30 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    const emojiRow4 = Array.from({ length: 30 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    const leftEmojis = Array.from({ length: 5 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    const rightEmojis = Array.from({ length: 5 }, () =>
      getRandomEmoji(name),
    ).join(" ");
    console.log(
      gradient.pastel.multiline(
        `${surroundEmojis} ${nameText} ${surroundEmojis}`,
      ),
    );
    console.log(chalk.bold.cyan(`\n${emojiRow1}`));
    console.log(chalk.bold.cyan(`${emojiRow2}`));
    console.log(
      chalk.bold.green(
        `${leftEmojis} 🎯 ${name} is feeling very ${personality} today! ${rightEmojis}`,
      ),
    );
    console.log(chalk.bold.cyan(`${emojiRow3}`));
    console.log(chalk.bold.cyan(`${emojiRow4}\n`));
  } else {
    console.log(gradient.cristal.multiline(nameText));
  }

  console.log(chalk.cyan("\n📍 Press SPACE or ENTER to get next name"));
  console.log(chalk.yellow("💫 Press Q to quit"));
  console.log(
    chalk.bold.blue(`\n📊 Names remaining: ${availableNames.length}\n`),
  );
}

function animateSelection() {
  return new Promise((resolve) => {
    let counter = 0;
    const maxAnimations = 8;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      const randomName = availableNames[randomIndex];

      clearScreen();
      displayTitle();

      const emoji = getRandomEmoji(randomName);
      const nameText = figlet.textSync(randomName, {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
      });

      console.log(gradient.fruit.multiline(`${emoji} ${nameText} ${emoji}`));
      console.log(chalk.bold.magenta(`\n🎲 Spinning... ${emoji}\n`));

      counter++;
      if (counter >= maxAnimations) {
        clearInterval(interval);
        resolve();
      }
    }, 150);
  });
}

async function selectNextName() {
  if (isAnimating) return;

  if (availableNames.length === 0) {
    clearScreen();
    console.log(
      gradient.atlas(figlet.textSync("ALL DONE!", { font: "Standard" })),
    );
    console.log(chalk.bold.green("\n🎉 All names have been selected! 🎉\n"));
    console.log(chalk.bold.cyan("✨ Thanks for using Name Spinner! ✨\n"));
    process.exit();
  }

  isAnimating = true;

  await animateSelection();

  const randomIndex = Math.floor(Math.random() * availableNames.length);
  const selectedName = availableNames[randomIndex];

  availableNames.splice(randomIndex, 1);

  displayName(selectedName, true);

  setTimeout(() => {
    isAnimating = false;
  }, 2000);
}

function setupKeyListener() {
  readline.emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", async (str, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    }

    if (key.name === "q" || key.name === "Q") {
      clearScreen();
      console.log(
        gradient.atlas(figlet.textSync("GOODBYE!", { font: "Standard" })),
      );
      console.log(chalk.bold.cyan("\n✨ Thanks for using Name Spinner! ✨\n"));
      process.exit();
    }

    if (key.name === "space" || key.name === "return") {
      await selectNextName();
    }
  });
}

function init() {
  clearScreen();
  displayTitle();

  console.log(gradient.cristal("🎮 Welcome to the Name Spinner! 🎮\n"));
  console.log(
    chalk.bold.green("🚀 Get ready to spin through names with style!\n"),
  );

  setTimeout(() => {
    displayName("Ready to start!");
    setupKeyListener();
  }, 1500);
}

if (require.main === module) {
  init();
}
