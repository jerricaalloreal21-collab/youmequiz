# Our Story Game

Build a polished mobile-first MVP web app for a personalized social mini-game. Working product name: The Us Game. Do not over-invest in permanent branding yet. Core promise: 'Your relationship. Your memories. Your game.' The app should feel fun, warm, modern, slightly cheeky, and highly shareable, not childish.

V1 flow: Home -> Create a Game -> choose relationship type (Couple, Best Friends, Siblings, Family, Birthday) -> enter creator and recipient names -> answer 5 quick personalization prompts (something they're obsessed with, something they always do, an inside joke, a shared memory, and one custom fact) -> optionally provide up to 3 photo placeholders for future support -> generate a playable personalized game -> produce a shareable game route/link -> recipient plays without account -> personalized score/result -> secret ending message -> CTA 'Make one about them'.

For this first prototype, do NOT require external AI APIs, payment processing, login, or a database. Use deterministic templates/rules and browser state/local persistence so the complete experience can be tested immediately. Seed a demo game so the app is playable on first load. Make the architecture easy to connect to Supabase, AI generation, and Stripe later.

Game structure: 3 short rounds totaling about 10 questions: 'Do You Know Me?', 'The Receipts', and 'Predict Me'. Use the creator's five answers to personalize questions, plausible wrong answers, playful transitions, and result copy. Include a final personalized secret message. Scoring should yield funny result tiers while still feeling affectionate.

Free/paid product concept should be visible only where useful, not actually charged yet: Free = short 5-question game; $1.99 Full Game = 10 personalized questions; $3.99 Memory Edition = photos, memories, extra personalization and secret ending. Clearly mark paid choices as 'coming soon' or demo so nobody thinks a real purchase occurred.

Optimize for phones, fast creation in about 60 seconds, one-tap copy/share behavior where browser APIs permit, accessibility, and minimal friction. No account needed to create or play in V1. Build all needed screens and interactions, not just a landing page. Use tasteful animations and strong CTA hierarchy. At the end, ensure the seeded demo can be completed end-to-end.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://youmequiz.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a8825179-f241-4244-bdd7-4dec3aa02592).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
