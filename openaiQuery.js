import OpenAI from "openai";

// Add your OpenAI API key here

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
});
 
const completion = await openai.chat.completions.create({
  model: "o1-preview",
  messages: [
    {
      role: "user", 
      content: "Write a bash script that takes a matrix represented as a string with format '[1,2],[3,4],[5,6]' and prints the transpose in the same format."
    }
  ]
});

console.log(completion.choices[0].message.content);