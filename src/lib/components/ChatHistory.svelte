<script lang="ts">
  import { onMount } from 'svelte';

  import Chat from './Icons/Chat.svelte';
  import Pencil from './Icons/Pencil.svelte';
  import Plus from './Icons/Plus.svelte';
  import Trash from './Icons/Trash.svelte';

  import { chatMessages } from '$lib/stores/chat-messages';
  import {
    chatHistory,
    trashHistory,
    chatHistorySubscription,
    loadMessages
  } from '../stores/chat-history';

  export let actId = '';

  function switchHistory(key: string) {
    actId = key;
    loadMessages(key);
  }

  async function newChat() {
    const ct = await chatMessages.reset();
    actId = ct.chatId;
  }

  let chatHistoryKeys: any = [];

  onMount(async () => {
    chatHistorySubscription.set($chatHistory);
    chatHistorySubscription.subscribe((data: any) => {
      chatHistoryKeys = Object.entries(data).map(([k, ci], i) => {
        let { key, label } = ci;
        if (!key && ci.chatId) {
          key = ci.chatId;
        } else {
          key = k;
        }
        if (!label) {
          label = key;
        }
        return { key, label };
      });
    });

    if (!actId) {
      const keys = Object.keys($chatHistory);
      //   console.log('keys', keys);
      if (keys.length > 0 && !$chatMessages.chatId) {
        loadMessages(keys[0]);
        actId = keys[0];
        return;
      }

      await newChat();
    }
  });
</script>

<div
  class="h-[700px] w-[350px] bg-black bg-opacity-20 rounded-md py-4 px-2 overflow-y-auto flex flex-col gap-2"
>
  <button
    on:click={newChat}
    class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
  >
    <Plus /> New chat
  </button>

  {#if chatHistoryKeys.length > 0}
    {#each chatHistoryKeys as history (history)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => switchHistory(history.key)}
        class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-opacity-40 hover:bg-white/5  bg-black  group animate-flash text-sm"
      >
        <Chat />
        <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
          {history.label}
        </div>

        <div class="absolute flex right-1 z-10 text-gray-300 visible">
          <button on:click={() => switchHistory(history.key)} class="p-1 hover:text-white">
            <Pencil />
          </button>
          <button
            on:click|preventDefault={() => trashHistory(history.key)}
            class="p-1 hover:text-white"
          >
            <Trash />
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>
