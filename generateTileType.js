import { readFileSync, writeFileSync } from "fs";

// Load the TMJ file
const mapData = JSON.parse(fs.readFileSync("./assets/three-farmhouses.tmj", "utf8"));

// Extract the tileset data
const tileset = mapData.tilesets[0]; // Assuming one tileset
const firstGid = tileset.firstgid; // The global ID offset for tiles

// Placeholder for tile types
const tileTypes = {};

// Iterate over tiles in the tileset
tileset.tiles.forEach(tile => {
    const tileId = tile.id + firstGid; // Calculate the global tile ID
    const properties = tile.properties || [];

    // Find the property set to `true`
    const type = properties.find(prop => prop.value === true)?.name || "undefined";

    // Map the tile ID to its type
    tileTypes[tileId] = type;
});

// Save the tile types as a JSON file
fs.writeFileSync("tileTypes.json", JSON.stringify(tileTypes, null, 2));
console.log("Tile types generated and saved to tileTypes.json");
