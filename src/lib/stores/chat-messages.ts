import type { ChatCompletionRequestMessage } from 'openai';
import { SSE } from 'sse.js';
import { get, writable } from 'svelte/store';
import * as api from '$lib/api';

export interface ChatTranscript {
  chatId: string;
  label: string;
  messages: ChatCompletionRequestMessage[];
  chatState: 'idle' | 'loading' | 'error' | 'message';
}

const { subscribe, update, ...store } = writable<ChatTranscript>({
  chatId: '',
  label: '',
  messages: [],
  chatState: 'idle'
});

const set = async (query: string, csid?: string) => {
  updateMessages(query, 'user', 'loading');
  const stream = true;
  const eventSource = new SSE('/api/chat', {
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({ csid, prompt: query, stream })
  });

  eventSource.addEventListener('error', handleError);
  eventSource.addEventListener('message', streamMessage);
  eventSource.stream();
};

const replace = (ct: ChatTranscript) => {
  store.set(ct);
};

const reset = async (): Promise<ChatTranscript> => {
  const res = await api.welcome();
  const { id, content } = res;
  const ct = <ChatTranscript>{
    chatId: id,
    messages: [{ role: 'assistant', content: content }],
    chatState: 'idle'
  };
  store.set(ct);
  return ct;
};

const updateMessages = (content: any, role: any, state: any) => {
  chatMessages.update((ct: ChatTranscript) => {
    ct.messages.push({ role: role, content: content });
    ct.chatState = state;
    return ct;
  });
};

const handleError = <T>(err: T) => {
  updateMessages(err, 'system', 'error');
  console.error(err);
};

const streamMessage = (e: MessageEvent) => {
  try {
    if (e.data.length === 0) {
      return;
    }
    if (e.data === '[DONE]') {
      updateMessages(get(answer), 'assistant', 'idle');
      return answer.set('');
    }

    if (get(answer) === '...') answer.set('');

    const cr = JSON.parse(e.data);
    if (cr.choices && cr.choices.length > 0) {
      cr.delta = cr.choices[0].delta.content;
    }

    if (cr.id) {
      update((ct) => {
        ct.chatId = cr.id;
        return ct;
      });
    }

    if (cr.delta) {
      answer.update((_a) => _a + cr.delta);
    }
  } catch (err) {
    console.log('message error', err);
    handleError(err);
  }
};

export const chatMessages = { subscribe, set, update, reset, replace };
export const answer = writable<string>('');
