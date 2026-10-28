import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = process.env.PORT || 3001;
const app = express();

// Simple CORS setup for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Initialize Gemini safely
let genAI = null;
if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    console.log("Google Generative AI client initialized.");
  } catch (err) {
    console.warn("Could not initialize GoogleGenerativeAI:", err.message);
  }
} else {
  console.log("Running chatbot in smart local recommendation mode (no GOOGLE_API_KEY set).");
}

// Comprehensive catalog database for literary recommendations
const books = [
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    tags: ['mystery', 'psychological', 'dark', 'crime', 'suspense'],
    mood: 'intense',
    price: 399,
    description: 'A psychological thriller about a woman who shoots her husband and then stops speaking.'
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    tags: ['space', 'science', 'adventure', 'survival', 'aliens'],
    mood: 'exciting',
    price: 499,
    description: 'A lone astronaut must save humanity from extinction in this science-driven space adventure.'
  },
  {
    title: 'God Emperor of Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    tags: ['dune', 'sci-fi', 'epic', 'space', 'classic'],
    mood: 'epic',
    price: 704,
    description: 'Frank Herbert’s sweeping masterpiece of politics, prophecy, and evolution on the desert planet Arrakis.'
  },
  {
    title: 'The Paris Detective',
    author: 'James Patterson',
    genre: 'Mystery',
    tags: ['detective', 'paris', 'crime', 'murder', 'investigation'],
    mood: 'intriguing',
    price: 350,
    description: 'A detective solves thrilling crimes in the heart of Paris.'
  },
  {
    title: 'Rafa: My Story',
    author: 'Rafael Nadal & John Carlin',
    genre: 'Biography',
    tags: ['sports', 'tennis', 'biography', 'inspirational', 'champion'],
    mood: 'inspirational',
    price: 1126,
    description: 'The candid autobiography of tennis legend Rafael Nadal detailing grit, triumph, and perseverance.'
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    genre: 'Finance',
    tags: ['money', 'finance', 'investing', 'self-help', 'wealth'],
    mood: 'enlightening',
    price: 299,
    description: 'Timeless lessons on wealth, greed, and happiness doing well with money is about how you behave.'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    tags: ['habits', 'productivity', 'growth', 'motivation', 'mindset'],
    mood: 'motivational',
    price: 420,
    description: 'An easy and proven way to build good habits and break bad ones through tiny incremental changes.'
  },
  {
    title: 'Waves of Love',
    author: 'Priya Mehta',
    genre: 'Romance',
    tags: ['romance', 'love', 'monsoon', 'relationship', 'heartfelt'],
    mood: 'romantic',
    price: 199,
    description: 'A romantic tale of two strangers discovering heartfelt connection during a Mumbai monsoon.'
  },
  {
    title: 'Science Simplified',
    author: 'Dr. Neha Joshi',
    genre: 'Kids & Science',
    tags: ['kids', 'science', 'children', 'learning', 'fun'],
    mood: 'curious',
    price: 150,
    description: 'A beautifully illustrated exploration of science concepts designed for curious young readers.'
  }
];

// Smart fallback response generator when Gemini API is unavailable or returns an error
function generateSmartFallback(query) {
  const q = query.toLowerCase();
  
  // Find matching books by genre, tag, title, or author
  const matched = books.filter(b => 
    q.includes(b.genre.toLowerCase()) ||
    q.includes(b.title.toLowerCase()) ||
    q.includes(b.author.toLowerCase()) ||
    b.tags.some(t => q.includes(t)) ||
    (b.mood && q.includes(b.mood))
  );

  const selected = matched.length > 0 ? matched.slice(0, 3) : books.slice(0, 3);

  let reply = `Hello! Based on what you're looking for, here are hand-picked recommendations from BookNook:\n\n`;
  selected.forEach(b => {
    reply += `📖 **${b.title}** by ${b.author} (₹${b.price})\n`;
    reply += `• *Genre*: ${b.genre} | *Mood*: ${b.mood}\n`;
    reply += `• *Synopsis*: ${b.description}\n\n`;
  });
  reply += `💡 *Tip*: You can search any of these titles in our catalog or add them straight to your wishlist and cart!`;

  return reply;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BookNook Chatbot Server', port: PORT });
});

// Chatbot route with Gemini AI and seamless smart fallback
app.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "Please enter a message." });
    }

    console.log("Received chatbot query:", message);

    // 1. Attempt generation via Google Gemini AI if configured
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.8,
          }
        });

        const prompt = `You are "BookNook Assistant", a warm, knowledgeable literary assistant for the BookNook online bookstore. Respond helpfully to this book reader query: "${message}". Recommend great titles and mention genres or reading tips.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text && text.trim()) {
          return res.json({ reply: text });
        }
      } catch (geminiError) {
        console.warn("Gemini AI API notice:", geminiError.message, "— serving smart catalog recommendation.");
      }
    }

    // 2. Intelligent catalog recommendation fallback
    const fallbackReply = generateSmartFallback(message);
    res.json({ reply: fallbackReply });
  } catch (error) {
    console.error("Chatbot router error:", error);
    const fallbackReply = generateSmartFallback(req.body?.message || "popular books");
    res.json({ reply: fallbackReply });
  }
});

app.listen(PORT, () => {
  console.log(`BookNook Chatbot Server running on http://localhost:${PORT}`);
});