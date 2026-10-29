// User-Agent substrings of AI chatbots fetching pages on behalf of a user (Matomo's minimum list).
// Matomo identifies the bot itself; this list only keeps human traffic from being sent.
const AI_CHATBOT_USER_AGENTS = [
  'ChatGPT-User',
  'MistralAI-User',
  'Gemini-Deep-Research',
  'Claude-User',
  'Perplexity-User',
  'GoogleAgent',
  'NovaAct',
];

const MATOMO_TRACKING_URL = 'https://matomo.corbado.com/matomo.php';
const MATOMO_SITE_ID = '6';

/**
 * Cloudflare Pages middleware: reports AI chatbot page requests to Matomo's AI Chatbots
 * reports. Chatbots don't run matomo.js, so they are only visible server-side.
 * recMode=1 records bot requests only.
 * See https://matomo.org/faq/how-to/set-up-ai-chatbot-tracking-with-the-http-tracking-api/
 */
export async function onRequest(context) {
  const { request } = context;
  const userAgent = request.headers.get('user-agent');
  if (userAgent && AI_CHATBOT_USER_AGENTS.some((bot) => userAgent.includes(bot))) {
    const params = new URLSearchParams({
      idsite: MATOMO_SITE_ID,
      rec: '1',
      recMode: '1',
      ua: userAgent,
      url: request.url,
    });
    context.waitUntil(
      fetch(`${MATOMO_TRACKING_URL}?${params}`).catch((error) => {
        console.error('Error tracking AI chatbot request', error);
      }),
    );
  }

  return context.next();
}
