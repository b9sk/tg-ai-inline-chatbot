import worker from '../worker.js';
import { vi } from 'vitest';

// Mock global fetch for Vitest
const fetch = vi.fn();
vi.stubGlobal('fetch', fetch);

describe('Worker fetch handler', () => {
  const mockEnv = {
    BOT_TOKEN: 'test-bot-token',
    BACKEND_URL: 'http://localhost:8787/api/flowise',
  };

  let request;

  beforeEach(() => {
    request = {
      json: vi.fn(),
    };
    fetch.mockClear(); // Clear mocks before each test
  });

//   it('should handle inline_query and send answerInlineQuery', async () => {
//     const inlineQueryUpdate = {
//       inline_query: {
//         id: 'inline_id_123',
//         from: { id: 123 },
//         query: 'test query',
//       },
//     };
//     request.json.mockResolvedValueOnce(inlineQueryUpdate);

//     fetch.mockResolvedValueOnce({
//       json: () => Promise.resolve({ reply: 'Flowise inline reply' }),
//     });

//     const response = await worker.fetch(request, mockEnv);

//     expect(request.json).toHaveBeenCalled();
//     expect(fetch).toHaveBeenCalledTimes(2); // One for backend, one for Telegram

//     // Check backend call
//     expect(fetch).toHaveBeenCalledWith(
//       mockEnv.BACKEND_URL,
//       expect.objectContaining({
//         method: 'POST',
//         body: JSON.stringify(inlineQueryUpdate),
//       })
//     );

//     // Check Telegram answerInlineQuery call
//     expect(fetch).toHaveBeenCalledWith(
//       `https://api.telegram.org/bot${mockEnv.BOT_TOKEN}/answerInlineQuery`,
//       expect.objectContaining({
//         method: 'POST',
//         body: JSON.stringify({
//           inline_query_id: 'inline_id_123',
//           results: [
//             {
//               type: 'article',
//               id: '1',
//               title: 'Ответ:',
//               input_message_content: {
//                 message_text: 'Flowise inline reply',
//               },
//             },
//           ],
//         }),
//       })
//     );
//     expect(response.status).toBe(200);
//   });

//   it('should handle message with reply_to_message and send sendMessage', async () => {
//     const messageUpdate = {
//       message: {
//         chat: { id: 456 },
//         reply_to_message: { message_id: 789 },
//         from: { id: 123 },
//         text: 'test message',
//       },
//     };
//     request.json.mockResolvedValueOnce(messageUpdate);

//     fetch.mockResolvedValueOnce({
//       json: () => Promise.resolve({ reply: 'Flowise message reply' }),
//     });

//     const response = await worker.fetch(request, mockEnv);

//     expect(request.json).toHaveBeenCalled();
//     expect(fetch).toHaveBeenCalledTimes(2); // One for backend, one for Telegram

//     // Check backend call
//     expect(fetch).toHaveBeenCalledWith(
//       mockEnv.BACKEND_URL,
//       expect.objectContaining({
//         method: 'POST',
//         body: JSON.stringify(messageUpdate),
//       })
//     );

//     // Check Telegram sendMessage call
//     expect(fetch).toHaveBeenCalledWith(
//       `https://api.telegram.org/bot${mockEnv.BOT_TOKEN}/sendMessage`,
//       expect.objectContaining({
//         method: 'POST',
//         body: JSON.stringify({
//           chat_id: 456,
//           text: 'Flowise message reply',
//         }),
//       })
//     );
//     expect(response.status).toBe(200);
//   });

//   it('should return "⚠️ Нет ответа" for inline_query if backend provides no reply', async () => {
//     const inlineQueryUpdate = {
//       inline_query: {
//         id: 'inline_id_123',
//         from: { id: 123 },
//         query: 'test query',
//       },
//     };
//     request.json.mockResolvedValueOnce(inlineQueryUpdate);

//     fetch.mockResolvedValueOnce({
//       json: () => Promise.resolve({}), // No reply from backend
//     });

//     const response = await worker.fetch(request, mockEnv);

//     expect(fetch).toHaveBeenCalledWith(
//       `https://api.telegram.org/bot${mockEnv.BOT_TOKEN}/answerInlineQuery`,
//       expect.objectContaining({
//         body: expect.stringContaining('⚠️ Нет ответа'),
//       })
//     );
//     expect(response.status).toBe(200);
//   });

//   it('should return "⚠️ Нет ответа" for message if backend provides no reply', async () => {
//     const messageUpdate = {
//       message: {
//         chat: { id: 456 },
//         reply_to_message: { message_id: 789 },
//         from: { id: 123 },
//         text: 'test message',
//       },
//     };
//     request.json.mockResolvedValueOnce(messageUpdate);

//     fetch.mockResolvedValueOnce({
//       json: () => Promise.resolve({}), // No reply from backend
//     });

//     const response = await worker.fetch(request, mockEnv);

//     expect(fetch).toHaveBeenCalledWith(
//       `https://api.telegram.org/bot${mockEnv.BOT_TOKEN}/sendMessage`,
//       expect.objectContaining({
//         body: expect.stringContaining('⚠️ Нет ответа'),
//       })
//     );
//     expect(response.status).toBe(200);
//   });

//   it('should return OK for unsupported update types', async () => {
//     const unsupportedUpdate = {
//       // No inline_query or message with reply_to_message
//       edited_message: { chat: { id: 123 }, text: 'edited' },
//     };
//     request.json.mockResolvedValueOnce(unsupportedUpdate);

//     fetch.mockResolvedValueOnce({
//       json: () => Promise.resolve({ reply: 'Flowise reply' }),
//     });

//     const response = await worker.fetch(request, mockEnv);

//     expect(fetch).toHaveBeenCalledTimes(1); // Only backend call
//     expect(response.status).toBe(200);
//   });
});