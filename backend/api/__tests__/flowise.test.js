
import handler from '../flowise.js';
import { vi } from 'vitest';

// Mock node-fetch for Vitest
const fetch = vi.fn();
vi.stubGlobal('fetch', fetch);

describe('Flowise API Handler with Realistic Payloads', () => {
  const mockEnv = {
    FLOWISE_BASE_URL: 'http://localhost:3000',
    FLOWISE_FLOW_ID: 'test-flow-id',
  };

  beforeAll(() => {
    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    // Clean up environment variables after all tests are done
    for (const key in mockEnv) {
      delete process.env[key];
    }
  });

  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    fetch.mockClear(); // Clear mocks before each test
  });

  it('should call Flowise API with question and sessionId, ignoring other fields (message)', async () => {
    req.body = {
      message: {
        from: { id: 456 },
        text: 'What is the capital of France?',
      },
      history: [
        { role: 'userMessage', content: 'Hi' },
        { role: 'apiMessage', content: 'Hello! How can I help you?' },
      ],
      uploads: [
        { type: 'file', name: 'document.pdf', data: 'base64encodedpdf' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ text: 'Paris' }),
    });

    await handler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      `${mockEnv.FLOWISE_BASE_URL}/api/v1/prediction/${mockEnv.FLOWISE_FLOW_ID}`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          question: 'What is the capital of France?',
          overrideConfig: { sessionId: expect.stringContaining('456_') },
        }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      reply: 'Paris',
      data: { text: 'Paris' },
    });
  });

  it('should call Flowise API with question and sessionId, ignoring other fields (inline_query)', async () => {
    req.body = {
      inline_query: {
        from: { id: 789 },
        query: 'Tell me a joke',
      },
      history: [
        { role: 'userMessage', content: 'How are you?' },
        { role: 'apiMessage', content: 'I am a bot, I do not have feelings.' },
      ],
      uploads: [
        { type: 'image', name: 'cat.jpg', data: 'base64encodedcatimage' },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ text: 'Why did the scarecrow win an award? Because he was outstanding in his field!' }),
    });

    await handler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      `${mockEnv.FLOWISE_BASE_URL}/api/v1/prediction/${mockEnv.FLOWISE_FLOW_ID}`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          question: 'Tell me a joke',
          overrideConfig: { sessionId: expect.stringContaining('789_') },
        }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      reply: 'Why did the scarecrow win an award? Because he was outstanding in his field!',
      data: { text: 'Why did the scarecrow win an award? Because he was outstanding in his field!' },
    });
  });
});
