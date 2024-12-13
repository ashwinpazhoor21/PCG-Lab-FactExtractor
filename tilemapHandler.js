import Phaser from 'phaser';
import { extractFactsWithLLM } from './factExtractor';

export async function processTilemap(scene) {
    const tilemap = scene.make.tilemap({ key: 'your-tilemap-key' });
    const tileset = tilemap.addTilesetImage('your-tileset-key');

    const { features, llmFeedback } = await extractFactsWithLLM(tilemap, tileset);

    console.log('Extracted Features:', features);
    console.log('LLM Feedback:', llmFeedback);

    return { features, llmFeedback };
}