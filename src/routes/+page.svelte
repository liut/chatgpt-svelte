<script lang="ts">
  import ChatHistory from '$lib/components/ChatHistory.svelte';
  import ChatMessage from '$lib/components/ChatMessage.svelte';
  import Input from '$lib/components/Input.svelte';
  import { chatMessages, answer } from '$lib/stores/chat-messages';
  import * as api from '$lib/api';

  let actId = '';
  let query = '';

  const handleSubmit = async () => {
    answer.set('...');
    await chatMessages.set(query, actId);
    query = '';
  };

  let getMe = () => {
    return api.me();
  };
</script>

<section class="flex max-w-6xl w-full pt-4 justify-center">
  <div class="flex flex-col gap-2">
    <ChatHistory bind:actId={actId} />
    <div class="p-4">
      {#await getMe()}
        <!-- TODO: user is pending -->
      {:then user}
        <!-- TODO: user was fulfilled -->
        {user.name}
      {/await}
    </div>
  </div>

  <div class="flex flex-col w-full px-8 items-center gap-2">
    <div
      class="h-[700px] w-full bg-black bg-opacity-20 rounded-md p-4 overflow-y-auto flex flex-col gap-4"
    >
      <div class="flex flex-col gap-2">
        {#each $chatMessages.messages as message}
          <ChatMessage type={message.role} message={message.content} />
        {/each}

        {#if $answer}
          <ChatMessage type="assistant" message={$answer} />
        {/if}
      </div>
    </div>
    <form
      class="flex w-full rounded-md gap-4 bg-black bg-opacity-20 p-2"
      on:submit|preventDefault={handleSubmit}
    >
      <Input type="text" bind:value={query} class="w-full" />
      <button
        type="submit"
        class="bg-black bg-opacity-40 hover:bg-white/5 px-8 py-1.5 border border-black/40 ml-[-0.5rem] rounded-md text-teal-300"
      >
        Send
      </button>
    </form>
  </div>
</section>
