import { supabase } from './supabase.js';
import { ChatBot } from './chatbot.js';

class ChatApp {
  constructor() {
    this.chatBot = new ChatBot();
    this.sessionId = this.getOrCreateSessionId();
    this.messageContainer = document.getElementById('messages');
    this.inputField = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');

    this.setupEventListeners();
    this.loadChatHistory();
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
  }

  setupEventListeners() {
    this.sendButton.addEventListener('click', () => this.handleSend());
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.inputField.value = chip.textContent;
        this.handleSend();
      });
    });
  }

  async handleSend() {
    const message = this.inputField.value.trim();
    if (!message) return;

    this.inputField.value = '';
    this.inputField.focus();

    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
      welcomeMsg.remove();
    }

    await this.addMessage(message, true);

    this.showTypingIndicator();

    setTimeout(async () => {
      const response = this.chatBot.generateResponse(message);
      this.removeTypingIndicator();
      await this.addMessage(response, false);
    }, 800 + Math.random() * 400);
  }

  async addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
      <div class="message-content">
        ${this.escapeHtml(text)}
        <span class="message-time">${timeString}</span>
      </div>
    `;

    this.messageContainer.appendChild(messageDiv);
    this.scrollToBottom();

    await this.saveMessage(text, isUser);
  }

  async saveMessage(message, isUser) {
    try {
      await supabase.from('chat_messages').insert({
        session_id: this.sessionId,
        message: message,
        is_user: isUser
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  async loadChatHistory() {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
          welcomeMsg.remove();
        }

        for (const msg of data) {
          const messageDiv = document.createElement('div');
          messageDiv.className = `message ${msg.is_user ? 'user' : 'bot'}`;

          const time = new Date(msg.created_at);
          const timeString = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          messageDiv.innerHTML = `
            <div class="message-content">
              ${this.escapeHtml(msg.message)}
              <span class="message-time">${timeString}</span>
            </div>
          `;

          this.messageContainer.appendChild(messageDiv);
        }

        this.scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    this.messageContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingMsg = document.querySelector('.typing-message');
    if (typingMsg) {
      typingMsg.remove();
    }
  }

  scrollToBottom() {
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ChatApp();
});
