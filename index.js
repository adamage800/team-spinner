#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");
const readline = require("readline");
const { Command } = require("commander");
const config = require("./config.json");
const safePersonalities = require("./personalities/safe");
const genZPersonalities = require("./personalities/genZ");
const negativePersonalities = require("./personalities/negative");
const adamCustomPersonalities = require("./personalities/adamCustom");
const millenialPersonalities = require("./personalities/millenial");
const developerPersonalities = require("./personalities/developer");

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
const endCelebrationText = "Let's gooooo team!!!";

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
  ...(config.safePersonalities === "on" ? safePersonalities : {}),
  ...(config.genZPersonalities === "on" ? genZPersonalities : {}),
  ...(config.negativePersonalities === "on" ? negativePersonalities : {}),
  ...(config.adamCustomPersonalities === "on" ? adamCustomPersonalities : {}),
  ...(config.millenialPersonalities === "on" ? millenialPersonalities : {}),
  ...(config.developerPersonalities === "on" ? developerPersonalities : {}),
};

if (Object.keys(personalities).length === 0) {
  console.error(
    chalk.red(
      "Error: No personality groups enabled. Enable at least one in config.json.",
    ),
  );
  process.exit(1);
}

const DANCING_FRAMES = [
  ["  \\O/  ", "   |   ", "  / \\  "],
  ["   O/  ", "  /|   ", "  / \\  "],
  ["   O   ", "  /|\\  ", "  / \\  "],
  ["  \\O   ", "   |\\  ", "  / \\  "],
  ["   O   ", "   |\\  ", "  /|   "],
  ["   O   ", "  /|   ", "   |\\  "],
];

function centerPad(str, width) {
  if (str.length >= width) return str.substring(0, width);
  const totalPad = width - str.length;
  const leftPad = Math.floor(totalPad / 2);
  return " ".repeat(leftPad) + str + " ".repeat(totalPad - leftPad);
}

function renderDancers(frameIndex, names) {
  const rows = [[], [], [], []];
  for (let i = 0; i < names.length; i++) {
    const frame = DANCING_FRAMES[(frameIndex + i) % DANCING_FRAMES.length];
    frame.forEach((line, l) => rows[l].push(line));
    rows[3].push(centerPad(names[i], 7));
  }
  return rows.map((row) => row.join("  ")).join("\n");
}

const namePersonalities = {};
const selectedNames = [];

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

  if (selectedNames.length > 0) {
    selectedNames.forEach((entry, index) => {
      const personalityEmojis = personalities[entry.personality] || ["❓"];
      const emoji = personalityEmojis[0];
      console.log(
        chalk.cyan(`#${index + 1} ${emoji} ${entry.personality} ${entry.name}`),
      );
    });
    console.log();
  }

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

function animateFinalCelebration() {
  return new Promise((resolve) => {
    let counter = 0;
    const maxAnimations = 40;
    const gradients = [
      gradient.rainbow,
      gradient.pastel,
      gradient.cristal,
      gradient.teen,
      gradient.mind,
      gradient.morning,
      gradient.vice,
      gradient.passion,
      gradient.fruit,
      gradient.retro,
    ];

    const interval = setInterval(() => {
      clearScreen();

      const title = figlet.textSync(endCelebrationText, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      });
      const randomGradient =
        gradients[Math.floor(Math.random() * gradients.length)];
      console.log(randomGradient(title));
      console.log("\n");

      console.log(
        randomGradient(
          renderDancers(
            counter % DANCING_FRAMES.length,
            selectedNames.map((e) => e.name),
          ),
        ),
      );
      console.log();

      selectedNames.forEach((entry, index) => {
        const personalityEmojis = personalities[entry.personality] || ["❓"];
        const emoji =
          personalityEmojis[
            Math.floor(Math.random() * personalityEmojis.length)
          ];
        const colors = [
          chalk.red,
          chalk.green,
          chalk.yellow,
          chalk.blue,
          chalk.magenta,
          chalk.cyan,
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        console.log(
          randomColor(
            `#${index + 1} ${emoji} ${entry.personality} ${entry.name}`,
          ),
        );
      });

      const celebEmojis = [
        "🎉",
        "🎊",
        "✨",
        "🌟",
        "💫",
        "🎆",
        "🎇",
        "🥳",
        "🎈",
        "🎁",
        "🎀",
        "🏆",
        "👏",
        "🙌",
        "💪",
        "🔥",
        "⚡",
        "💥",
        "🌈",
        "🚀",
        "💯",
        "🤩",
        "😍",
        "🥰",
        "💖",
        "💝",
      ];
      const emojiRow1 = Array.from(
        { length: 30 },
        () => celebEmojis[Math.floor(Math.random() * celebEmojis.length)],
      ).join(" ");
      const emojiRow2 = Array.from(
        { length: 30 },
        () => celebEmojis[Math.floor(Math.random() * celebEmojis.length)],
      ).join(" ");
      const emojiRow3 = Array.from(
        { length: 30 },
        () => celebEmojis[Math.floor(Math.random() * celebEmojis.length)],
      ).join(" ");
      const emojiRow4 = Array.from(
        { length: 30 },
        () => celebEmojis[Math.floor(Math.random() * celebEmojis.length)],
      ).join(" ");
      console.log(chalk.bold.yellow(`\n${emojiRow1}`));
      console.log(chalk.bold.yellow(`${emojiRow2}`));
      console.log(chalk.bold.yellow(`${emojiRow3}`));
      console.log(chalk.bold.yellow(`${emojiRow4}\n`));

      counter++;
      if (counter >= maxAnimations) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}

async function selectNextName() {
  if (isAnimating) return;

  if (availableNames.length === 0) {
    await animateFinalCelebration();

    clearScreen();
    console.log(
      gradient.pastel(
        figlet.textSync(endCelebrationText, { font: "Standard" }),
      ),
    );

    selectedNames.forEach((entry, index) => {
      const personalityEmojis = personalities[entry.personality] || ["❓"];
      const emoji = personalityEmojis[0];
      console.log(
        chalk.cyan(`#${index + 1} ${emoji} ${entry.personality} ${entry.name}`),
      );
    });

    process.exit();
  }

  isAnimating = true;

  await animateSelection();

  const randomIndex = Math.floor(Math.random() * availableNames.length);
  const selectedName = availableNames[randomIndex];

  if (!namePersonalities[selectedName]) {
    namePersonalities[selectedName] = getRandomPersonality();
  }

  availableNames.splice(randomIndex, 1);

  selectedNames.push({
    name: selectedName,
    personality: namePersonalities[selectedName],
  });

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
