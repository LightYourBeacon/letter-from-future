// pages/api/generate-letter.js
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { businessIdea, whyImportant, clientOutcome } = req.body;

  try {
    const prompt = `
Imagine you are the future self of someone who never started the business they dreamed of.

They wanted to start this business:
${businessIdea}

It mattered to them because:
${whyImportant}

This business would have helped others in the following way:
${clientOutcome}

Now, they are old. The window has closed. They never felt confident enough. Other people’s needs always came first. Time ran out.

Write a heartfelt letter from this future version of themselves to their current self. Include regret, missed opportunity, and the emotional weight of having never tried. Highlight the loss to the world.
`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a compassionate and emotional letter writer.' },
        { role: 'user', content: prompt },
      ],
    });

    const letter = completion.data.choices[0].message.content;

    res.status(200).json({ letter });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong generating the letter.' });
  }
}
