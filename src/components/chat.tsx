'use client';

import { useState } from 'react';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('📤 Sending message to /api/chat:', input);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful AI movie expert.' },
            ...messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: input },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('❌ Error from /api/chat:', data);
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Error: API failed.' }]);
      } else if (!data.choices || !data.choices[0]?.message?.content) {
        console.warn('⚠️ No valid response from OpenRouter:', data);
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I couldn’t respond.' }]);
      } else {
        const botText = data.choices[0].message.content;
        console.log('✅ Bot reply received:', botText);
        setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
      }
    } catch (err) {
      console.error('❌ Exception during fetch:', err);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error: Failed to contact AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded shadow max-w-xl mx-auto">
      <div className="h-60 overflow-y-auto mb-3 border p-3 rounded space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm px-3 py-1 rounded-md max-w-[80%] ${
              msg.sender === 'user'
                ? 'bg-black self-end ml-auto text-right text-white'
                : 'bg-gray-700 text-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm px-3 py-1 rounded-md bg-gray-700 text-gray-200">Typing...</div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question"
        />
        <button
          onClick={sendMessage}
          className="bg-yellow-400 text-black px-3 py-1 rounded"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
