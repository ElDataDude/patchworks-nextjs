# Install and use

This ZIP is self-contained. It includes the Patchworks logos, brand fonts, font licences, design tokens, layouts, renderer, examples, and two finished sample PDFs. No files from Bryan's computer or the Patchworks website are required.

## Claude.ai or Claude Desktop

Upload the ZIP as a custom Skill from **Settings > Features** (some clients label this area **Skills**). Code execution must be enabled. The archive contains one top-level folder named `patchworks-publications`, with `SKILL.md` directly inside it.

Start a new conversation and ask Claude to use the `patchworks-publications` skill. For example: “Use the Patchworks Publications skill to turn this brief into a four-page white paper.”

## Claude Code

Unzip the archive and copy the complete folder to either:

- `~/.claude/skills/patchworks-publications/` for your personal installation; or
- `.claude/skills/patchworks-publications/` inside one project.

Restart or open a new session if the skill is not discovered immediately.

## ChatGPT and Codex

If your ChatGPT workspace exposes custom Skills, import the unzipped `patchworks-publications` folder there and invoke it by name. Exact workspace controls depend on the ChatGPT plan and administrator settings.

For the Codex desktop app, unzip the archive and copy the complete folder to:

```text
~/.agents/skills/patchworks-publications/
```

Open a new task, then select it from Skills or type `$patchworks-publications`. If the existing app session does not discover it, quit and reopen the app once.

An arbitrary ZIP upload in the ordinary ChatGPT attachment box is not a skill installation. It can still be attached as reference material, but repeatable automatic discovery requires the workspace Skills control or the Codex folder above.

## Deterministic renderer

The skill can guide any PDF-capable agent using the bundled design assets. Its reference renderer additionally needs Node.js 18+ and Playwright:

```bash
cd patchworks-publications
npm test
npm install
npx playwright install chromium
node scripts/render-publication.cjs examples/white-paper.json white-paper.pdf
```

`npm test` is dependency-free and checks the package, brand assets, examples, and generated HTML. The renderer performs additional browser, font, image, A4, and overflow checks, then writes a `.qa.json` report beside each PDF.

## What to share with the agent

Provide the brief, source material, intended audience, desired document type, and any approved client logo or imagery. The agent should return both the source JSON and final PDF unless asked for PDF only.

Review `USAGE-LICENCE.md` before sharing the package beyond the intended business partner.
