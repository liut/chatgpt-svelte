import { derived, get, writable } from 'svelte/store';
import { chatMessages, type ChatTranscript } from './chat-messages';
import { browser } from '$app/environment';

export const chatHistorySubscription = writable();

const setLocalHistory = <T>(history: T) =>
  localStorage.setItem('chatHistory', JSON.stringify(history));

const getLocalHistory = () => JSON.parse(localStorage.getItem('chatHistory') || '{}');

export const chatHistory = derived(chatMessages, ($chatMessages) => {
  if (!browser) return null;

  let history = localStorage.getItem('chatHistory');

  if (!history && $chatMessages.messages.length === 1) return null;

  if (history && $chatMessages.messages.length === 1) return JSON.parse(history);

  const chatHistory = getLocalHistory();

  if (!$chatMessages.chatId) {
    return chatHistory;
  }

  const key = $chatMessages.chatId;
  const value = $chatMessages;
  const obj = { [key]: value };

  if (!history) setLocalHistory(obj);

  if (chatHistory) {
    chatHistory[key] = value;
    setLocalHistory(chatHistory);
    chatHistorySubscription.set(chatHistory);
    return chatHistory;
  }

  return null;
});

export const trashHistory = (key: string) => {
  const history = getLocalHistory();
  delete history[key];
  setLocalHistory(history);
  chatHistorySubscription.set(history);
};

const getHistory = (key: string) => getLocalHistory()[key]; //Returns the history for a given key

export const loadMessages = (key: string) => {
  if (get(chatMessages).chatState !== 'idle') return; //Prevents switching between messages while loading
  if (!key) return;

  const newMessages = getHistory(key);
  newMessages.chatState = 'idle';
  chatMessages.replace(newMessages);
};
