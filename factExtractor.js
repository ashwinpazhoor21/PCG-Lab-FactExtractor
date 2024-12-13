import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI key here
    })
);

export async function extractFactsWithLLM(tilemap, tileset) {
    const features = [];

    // Extract features from the tilemap
    tilemap.layers.forEach((layer) => {
        const { data, name } = layer;

        data.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                if (tile.index > 0) {
                    const tileId = tile.index;
                    const tileProps = tileset.getTileProperties(tileId);

                    if (tileProps) {
                        features.push({
                            type: tileProps.type || 'generic',
                            location: { x: colIndex, y: rowIndex },
                            description: `Found a ${tileProps.type || 'tile'} at (${colIndex}, ${rowIndex})`,
                        });
                    }
                }
            });
        });
    });

    // Convert the extracted facts into a summary for LLM
    const factDescriptions = features.map((f) => f.description).join('\n');
    const llmFeedback = await getLLMFeedback(factDescriptions);

    return { features, llmFeedback };
}

async function getLLMFeedback(facts) {
    const prompt = `
You are a procedural content generation assistant for a game. Here is the data extracted from the tilemap:

${facts}

Provide suggestions for improving this tilemap, generating creative or gameplay-enhancing ideas. Be concise and specific.
`;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 150,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating LLM feedback:', error);
        return 'Unable to generate feedback at this time.';
    }
}