import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user' };
    setChatLog((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const data = await response.json();
      const aiMessage = { text: data.response, sender: 'ai' };
      setChatLog((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setChatLog((prev) => [...prev, { text: "Sorry, I couldn't process that.", sender: 'ai' }]);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>AI Chat</h1>
        <div className={styles.chatLog}>
          {chatLog.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? styles.userMessage : styles.aiMessage}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Send</button>
        </form>
      </main>
    </div>
  );
}
