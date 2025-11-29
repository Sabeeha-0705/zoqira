/**
 * generateBotReply(messages, scenario, options)
 * messages: [{role: 'user'|'assistant'|'system', content: string}]
 */
async function generateBotReply(
  messages = [],
  scenario = "casual",
  options = {}
) {
  // Recommended system prompts
  const systemPrompts = {
    interview:
      "You are a polite interview practice assistant. Provide concise, professional answers and feedback geared to help improve interview performance.",
    casual:
      "You are a friendly conversational partner. Keep answers natural and helpful for language practice.",
    pronunciation:
      "You are a pronunciation coach. Focus on reading text back clearly and give specific pronunciation tips.",
  };

  const systemPrompt = systemPrompts[scenario] || systemPrompts.casual;

  // TODO: Call OpenAI or other LLM provider. This is a placeholder.
  // For OpenAI: use fetch/axios to call completions/chat completions with messages + systemPrompt
  // Example response skeleton:
  const replyText =
    `(${scenario} response) ` +
    (messages.length ? messages[messages.length - 1].content : "Hello");
  const metadata = { provider: "stub", scenario, tokens: 0 };
  return { text: replyText, metadata };
}

module.exports = { generateBotReply };
