const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const { message } = req.body;

      // For text-only input, use the gemini-pro model
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      res.status(200).json({ response: text });
    } catch (error) {
      console.error('Error in handler:', error);
      res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
