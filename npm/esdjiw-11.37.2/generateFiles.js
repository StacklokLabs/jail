const fs = require('fs');
const path = require('path');

// Directory to save the files
const outputDir = path.join(__dirname, 'uioeur');

// Create the directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// List of short, meaningful words or syllables
const syllables = [
    "flare", "spark", "glimmer", "shine", "glow", "dawn", "dusk", "shadow", "shade", "gloom",
    "pebble", "granite", "slate", "shale", "basalt", "marble", "quartz", "jade", "onyx", "cobble",
    "brook", "stream", "torrent", "eddy", "whirlpool", "ripple", "spray", "wave", "surge", "spritz",
    "summit", "crest", "cliff", "ridge", "crag", "bluff", "knoll", "spine", "ridge", "plateau",
    "gust", "zephyr", "squall", "tempest", "monsoon", "breeze", "whiff", "draft", "waft", "puff",
    "gleam", "shimmer", "glint", "twinkle", "luster", "shine", "halo", "glow", "radiance", "sparkle",
    "ember", "cinder", "blaze", "flare", "inferno", "glow", "kindle", "spark", "torch", "flame",
    "snowflake", "hailstone", "drift", "frost", "rime", "sleet", "glaze", "avalanche", "blizzard", "flurry",
    "kelp", "algae", "anemone", "barnacle", "mollusk", "urchin", "plankton", "seaweed", "coral", "oyster",
    "sprite", "pixie", "imp", "goblin", "troll", "sylph", "faerie", "nymph", "pooka", "wisp",
    "wraith", "phantom", "shade", "spirit", "specter", "ghoul", "shadow", "revenant", "poltergeist", "apparition",
    "gryphon", "hydra", "phoenix", "kraken", "manticore", "wyvern", "basilisk", "dragon", "sphinx", "chimera",
    "talon", "claw", "fang", "horn", "spine", "quill", "tusk", "beak", "antler", "plume",
    "glacier", "iceberg", "floe", "crevasse", "serac", "permafrost", "snowdrift", "firn", "blizzard", "frost",
    "meadow", "glade", "grove", "orchard", "thicket", "copse", "woodland", "clearing", "bramble", "shrub",
    "vortex", "maelstrom", "whirlpool", "riptide", "surge", "swirl", "current", "wave", "tidal", "breaker",
    "galaxy", "nebula", "quasar", "cosmos", "meteor", "comet", "orbit", "asteroid", "starfield", "universe",
    "volcano", "caldera", "eruption", "lava", "magma", "pyroclast", "obsidian", "tephra", "ashfall", "geode",
    "ruby", "emerald", "sapphire", "topaz", "garnet", "jade", "diamond", "amethyst", "beryl", "onyx",
    "jaguar", "ocelot", "panther", "cougar", "lynx", "tiger", "leopard", "cheetah", "caracal", "puma",
    "cavern", "grotto", "chasm", "abyss", "sinkhole", "fissure", "rift", "tunnel", "crevasse", "gorge",
    "djinn", "faun", "nymph", "siren", "sprite", "banshee", "goblin", "pooka", "pixie", "sylph",
    "rune", "glyph", "sigil", "charm", "hex", "spell", "ward", "incantation", "ritual", "enchant"
];




// Function to generate a random file name with up to 7 characters
function generateFileName() {
    let fileName = '';
    while (fileName.length < 5 || fileName.length > 8) {
        const part1 = syllables[Math.floor(Math.random() * syllables.length)];
        const part2 = syllables[Math.floor(Math.random() * syllables.length)];
        fileName = part1 + part2;
        if (fileName.length > 8) {
            fileName = fileName.substring(0, 8);  // Ensure the file name does not exceed 7 characters
        }
    }
    return fileName;
}

// Generate 15 unique JS file names
for (let i = 1; i <= 30; i++) {
    const fileName = generateFileName();
    const filePath = path.join(outputDir, `${fileName}.js`);
    fs.writeFileSync(filePath, '// JavaScript file\n');
    console.log(`Generated: ${fileName}.js`);
}
