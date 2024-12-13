import { querythisLLM } from "./openaiQuery.js";

async function testQuery() {
    const prompt = "Generate an example SMT-LIB constraint.";
    const result = await querythisLLM(prompt);
    console.log("LLM Response:\n", result);
    return result;
}

testQuery();
