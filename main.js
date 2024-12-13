import './style.css';
import { init } from 'z3-solver';
import OpenAI from 'openai';
import { extractFactsWithLLM } from './factExtractor'; // Import the fact extractor

const { Context } = await init();
const { Solver, Int, And, Or, Distinct } = new Context("main");

const openai = new OpenAI({
  apiKey: "none", // Replace with your OpenAI API key
  dangerouslyAllowBrowser: true
});

const SCALE = 2.0;
const my = { sprite: {}, Context: Context, openai: openai };

let config = {
  parent: 'app',
  type: Phaser.CANVAS,
  render: {
      pixelArt: true // Prevent pixel art from getting blurred when scaled
  },
  width: 960,
  height: 600,
  scene: {
    create: create,
  }
};

async function create() {
  // Initialize tilemap
  const tilemap = this.make.tilemap({ key: 'your-tilemap-key' });
  const tileset = tilemap.addTilesetImage('your-tileset-key');

  // Extract facts and get LLM feedback
  const { features, llmFeedback } = await extractFactsWithLLM(tilemap, tileset);

  // Display feedback on screen
  const feedbackText = this.add.text(10, 10, llmFeedback, {
    font: '16px Arial',
    fill: '#ffffff',
    wordWrap: { width: 780 },
  });

  console.log('Extracted Features:', features);
  console.log('LLM Feedback:', llmFeedback);
}

const game = new Phaser.Game(config);