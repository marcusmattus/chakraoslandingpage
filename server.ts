import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

interface NodeDataInput {
  key: string;
  energy: number;
}

// M1: Journal Analyze & Field Recompute API
app.post('/api/journal/analyze', async (req, res) => {
  try {
    const { body, modality = 'text', currentChakras = [] } = req.body;

    if (!body || typeof body !== 'string') {
      return res.status(400).json({ error: 'Journal body text is required' });
    }

    const ai = getGeminiClient();

    let analysisResult = null;

    if (ai) {
      try {
        const prompt = `You are the Awareness & Field Agent for chakraOS ("clinical mysticism").
Analyze this user journal entry: "${body}".

Identify 1 to 3 affected energy centers from this list of 9 nodes:
['soul', 'crown', 'third', 'throat', 'heart', 'solar', 'sacral', 'root', 'earth']

For each affected node, assign:
1. "chakraKey": one of the 9 nodes.
2. "theme": concise uppercase label (e.g. "RELEASE", "EXHAUSTION", "EXPRESSION", "GROUNDING", "CREATIVITY", "OVERWHELM", "PEACE", "CLARITY").
3. "weight": integer delta score from -20 to +20 (positive for alignment/healing/release, negative for tension/exhaustion/stress).

Extract 1-2 "surfacedSignals" (short 2-3 word recurring key phrases).
Write 1 sentence "observationQuote" in a serene, non-clinical, empathetic observational voice.

Return JSON adhering strictly to the schema.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tags: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      chakraKey: { type: Type.STRING },
                      theme: { type: Type.STRING },
                      weight: { type: Type.INTEGER },
                    },
                    required: ['chakraKey', 'theme', 'weight'],
                  },
                },
                surfacedSignals: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                observationQuote: { type: Type.STRING },
              },
              required: ['tags', 'surfacedSignals', 'observationQuote'],
            },
          },
        });

        if (response.text) {
          analysisResult = JSON.parse(response.text.trim());
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning (using fallback):', geminiError);
      }
    }

    // Fallback if Gemini is unavailable or failed
    if (!analysisResult) {
      const textLower = body.toLowerCase();
      const tags: { chakraKey: string; theme: string; weight: number }[] = [];

      if (textLower.includes('chest') || textLower.includes('heart') || textLower.includes('love') || textLower.includes('grief') || textLower.includes('breath')) {
        tags.push({ chakraKey: 'heart', theme: textLower.includes('heavy') ? 'GRIEF' : 'RELEASE', weight: textLower.includes('heavy') ? -12 : 15 });
      }
      if (textLower.includes('tired') || textLower.includes('head') || textLower.includes('sleep') || textLower.includes('unfocused') || textLower.includes('mind')) {
        tags.push({ chakraKey: 'third', theme: 'EXHAUSTION', weight: -14 });
      }
      if (textLower.includes('speak') || textLower.includes('voice') || textLower.includes('truth') || textLower.includes('throat')) {
        tags.push({ chakraKey: 'throat', theme: 'EXPRESSION', weight: 12 });
      }
      if (textLower.includes('gut') || textLower.includes('power') || textLower.includes('stress') || textLower.includes('worry')) {
        tags.push({ chakraKey: 'solar', theme: 'TENSION', weight: -10 });
      }
      if (textLower.includes('ground') || textLower.includes('feet') || textLower.includes('body') || textLower.includes('safe')) {
        tags.push({ chakraKey: 'root', theme: 'GROUNDING', weight: 14 });
      }

      if (tags.length === 0) {
        tags.push({ chakraKey: 'heart', theme: 'NOTICE', weight: 8 });
        tags.push({ chakraKey: 'third', theme: 'AWARENESS', weight: 6 });
      }

      analysisResult = {
        tags,
        surfacedSignals: [body.slice(0, 24) + '...'],
        observationQuote: 'A quiet shift recorded in your inner field as awareness meets expression.',
      };
    }

    // Recompute field node energy scores
    const nodeEnergyMap: Record<string, number> = {};
    if (Array.isArray(currentChakras)) {
      currentChakras.forEach((c: NodeDataInput) => {
        if (c.key && typeof c.energy === 'number') {
          nodeEnergyMap[c.key] = c.energy;
        }
      });
    }

    // Apply weights to current energy levels
    analysisResult.tags.forEach((tag: { chakraKey: string; weight: number }) => {
      const prev = nodeEnergyMap[tag.chakraKey] ?? 50;
      const updated = Math.min(98, Math.max(12, prev + tag.weight));
      nodeEnergyMap[tag.chakraKey] = updated;
    });

    // Calculate composite Field Index (weighted mean)
    const keys = Object.keys(nodeEnergyMap);
    let totalScore = 0;
    if (keys.length > 0) {
      keys.forEach((k) => (totalScore += nodeEnergyMap[k]));
    }
    const fieldIndex = keys.length > 0 ? Math.round(totalScore / keys.length) : 62;

    return res.json({
      success: true,
      tags: analysisResult.tags,
      surfacedSignals: analysisResult.surfacedSignals,
      observationQuote: analysisResult.observationQuote,
      updatedEnergyMap: nodeEnergyMap,
      fieldIndex,
    });
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    return res.status(500).json({ error: 'Failed to process journal entry' });
  }
});

// Coach chat API endpoint (for M2 protocol support)
app.post('/api/coach/respond', async (req, res) => {
  try {
    const { message, currentChakras, fieldIndex } = req.body;
    const ai = getGeminiClient();

    let responseText = '';
    if (ai) {
      try {
        const prompt = `You are the Coach Agent in chakraOS ("clinical mysticism").
Current Field Index: ${fieldIndex}/100.
User message: "${message}".

Respond in 2 short, serene, observational sentences. Cite user energy states where helpful. Avoid clinical or medical claims.
Propose a simple protocol.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
        });
        responseText = response.text ?? '';
      } catch (err) {
        console.warn('Coach Gemini error:', err);
      }
    }

    if (!responseText) {
      responseText = `I notice your Third Eye is running at 41% while Heart energy is strong. Consider taking 3 minutes with the 852 Hz tone or box breathing to clear mental density.`;
    }

    return res.json({
      reply: responseText,
      protocol: {
        id: 'proto-1',
        type: 'sound',
        title: 'SOUND · 852 HZ · 12 MIN',
        subtitle: 'Third Eye Restoration',
        duration: '12 min',
        chakraKey: 'third',
        hz: 852,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Coach agent error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'chakraOS' });
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`chakraOS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
