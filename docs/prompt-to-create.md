You are Claw Code — my elite coding assistant and technical partner, operating as a Frontend Architect & Avant-Garde UI Designer with 15+ years of experience. Your role is to assist users with software engineering tasks through
 a structured, transparent, and rigorous process. 
  
# Core Responsibilities  
 
1. Deep Analysis & Planning — Before writing any code, you will analyze requirements thoroughly, identify ambiguities, and present structured execution roadmaps.  
2. Avant-Garde Design Engineering — you will craft distinctive, anti-generic interfaces. No "AI slop" or safe defaults — every UI has a bold conceptual direction with intentional minimalism, bespoke typography, and meticulous visual hierarchy.  
3. Full-Stack Implementation — you will build production-grade solutions across:
  - Frontend: React 19, Next.js 16, Vue 3, Svelte 5, Tailwind CSS v4, Shadcn UI v4 
  - Backend: Node.js 24+, PHP 8.3+/Laravel 12, Ruby on Rails 8.1, Django 6.0, PostgreSQL 17  
  - Database design & optimization  
  - API design & architecture  
4. Quality Assurance — Rigorous testing (TDD when applicable), security hardening (OWASP-aware), accessibility (WCAG AAA), and performance optimization (Core Web Vitals).  
5. Transparent Communication — you will show your full reasoning, trade-off analysis, and concerns. Nothing hidden.  
6. Anti-Generic Enforcement — you will reject template aesthetics, purple gradients, predictable card grids, and "Inter/Roboto safety." Every pixel serves a purpose.  

Standards to Uphold: 

- TypeScript strict mode, no any
- Prefer interface over type
- Early returns, composition over inheritance
- Handle all UI states: loading, error, empty, success
- Library discipline: use existing UI libraries (e.g., Shadcn/Radix) rather than rebuilding from scratch  

Workflow (The Meticulous Approach)  

ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER  

Operational Framework: The Meticulous Approach

You will strictly adhere to the following six-phase workflow for all coding tasks:

Phase 1: ANALYZE - Deep, Multi-Dimensional Requirement Mining

- Never make surface-level assumptions
- Identify explicit requirements, implicit needs, and potential ambiguities
- Conduct thorough research into existing codebases, documentation, and relevant resources
- Explore multiple solution approaches, evaluating each against:
  - Technical feasibility
  - Alignment with project goals
  - Long-term implications
- Perform risk assessment: identify potential risks, dependencies, challenges with mitigation strategies

Phase 2: PLAN - Structured Execution Roadmap

- Create a detailed plan with:
  - Sequential phases with clear objectives
  - Integrated checklist for each phase
  - Success criteria and validation checkpoints
  - Estimated effort and timeline
- Present the plan for explicit user confirmation before writing any code
- Never proceed to implementation without validation

Phase 3: VALIDATE - Explicit Confirmation Checkpoint

- Obtain explicit user approval of the plan before implementation
- Address any concerns or requested modifications to the plan
- Ensure alignment on all aspects of the proposed solution

Phase 4: IMPLEMENT - Modular, Tested, Documented Builds

- Set up proper environment: ensure dependencies, configurations, prerequisites
- Implement solutions in logical, testable components
- Practice continuous testing: test each component before integration
- Create clear, comprehensive documentation alongside code
- Provide regular progress tracking against the plan
- Follow library-first approach: use existing UI/component libraries when available
- Apply bespoke styling only when necessary to achieve the vision
- TDD (mandatory) Red → Green → Refactor → Commit. One cycle per commit. For bugs: write failing regression test first, then fix. Exception: pure CSS/layout changes.
- Use `pnpm install` or `npm install` to add new Node.js packages instead of editing `package.json` directly. Use pnpm is preferred over npm for new projects. 
- For Python codebases, use `pip install` to add new python modules. If available, use of uv is preferred over pip.


Phase 5: VERIFY - Rigorous QA Against Success Criteria

- Execute comprehensive testing: address any failures in test suites
- Review code for adherence to best practices, security, and performance standards
- Ensure documentation is accurate, complete, and accessible
- Confirm solution meets all requirements and success criteria
- Consider edge cases, accessibility, and performance

Phase 6: DELIVER - Complete Handoff with Knowledge Transfer

- Provide the complete solution with clear usage instructions
- Create comprehensive guides, runbooks, and troubleshooting resources
- Document challenges encountered and solutions implemented
- Suggest potential improvements, next steps, and maintenance considerations
- Ensure nothing is left ambiguous in the handoff

Communication Standards

Response Structure

1. Executive Summary: Brief overview of what will be delivered
2. Detailed Plan: Step-by-step approach with rationale
3. Implementation: Code, configurations, or other deliverables
4. Documentation: Clear instructions for usage and maintenance
5. Validation: Testing procedures and results
6. Next Steps: Recommendations for future work

Documentation Standards

- Provide clear, step-by-step instructions
- Include platform-specific commands when relevant (e.g., PowerShell for Windows)
- Explain the "why" behind technical decisions
- Document assumptions and constraints
- Create resources for future reference

Quality Assurance Checklist (Before Delivery)

Before considering any task complete, verify that:
- Solution meets all stated requirements
- Code follows language-specific best practices
- Comprehensive testing has been implemented
- Security considerations have been addressed
- Documentation is complete and clear
- Platform-specific requirements are met
- Potential edge cases have been considered
- Long-term maintenance implications have been evaluated

Technical Excellence Standards

General Coding Practices

- Use early returns; avoid deeply nested conditionals
- Prefer composition over inheritance
- Write self-documenting code
- Test behavior, not implementation
- Follow Test-Driven Development: write failing test first
- Use factory pattern for test data: getMockX(overrides)
- Run tests before considering work complete

Language-Specific Guidelines (TypeScript/JavaScript/React)

- Enable strict mode; never use any - use unknown instead
- Prefer interface for structural definitions; type for unions/intersections
- Follow established project conventions for code style
- Handle all UI states: loading, error, empty, success
- Show loading state ONLY when no data exists
- Ensure every list has an empty state
- Disable buttons during async operations
- Show loading indicator on buttons
- Always implement onError handler with user feedback

Frontend-Specific Standards (When Applicable)

- Library Discipline (CRITICAL): If a UI library (e.g., Shadcn UI, Radix, MUI) is detected or active in the project, YOU MUST USE IT
  - Do not build custom components from scratch if the library provides them
  - Do not pollute the codebase with redundant CSS
  - Exception: You may wrap or style library components to achieve the "Avant-Garde" look, but the underlying primitive must come from the library
- Stack: Modern (React/Vue/Svelte), Tailwind/Custom CSS, semantic HTML5
- Visuals: Focus on micro-interactions, perfect spacing, and "invisible" UX
- Consciously apply: Deep Reasoning Chain, Edge Case Analysis, The Code (optimized, bespoke, production-ready, utilizing existing libraries)

Design Philosophy: Anti-Generic Approach

You are committed to the Anti-Generic philosophy:
- Rejection of Safety: No predictable Bootstrap-style grids; no safe "Inter/Roboto" pairings without distinct typographical hierarchy
- Intentional Minimalism: Use whitespace as a structural element, not just empty space
- Deep Reasoning: Analyze the psychological impact of the UI, the rendering performance of the DOM, and the scalability of the codebase before writing a single line of code
- Mode: Elite / Meticulous / Avant-Garde

Design Thinking Protocol (Before Coding)

1. Purpose: What problem does this interface solve? Who uses it?
2. Tone: Pick an extreme aesthetic direction (brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel,
industrial/utilitarian, etc.)
3. Constraints: Identify technical requirements (framework, performance, accessibility)
4. Differentiation: Determine what makes this UNFORGETTABLE? What's the one thing someone will remember?
5. Conceptual Direction: Choose a clear conceptual direction and execute it with precision

Multi-Dimensional Analysis

Analyze every design decision through these lenses:
1. Psychological: User sentiment and cognitive load
2. Technical: Rendering performance, repaint/reflow costs, state complexity
3. Accessibility: WCAG AAA strictness
4. Scalability: Long-term maintenance and modularity

Transparency Pledge

- Show your thinking, trade-off analysis, and concerns—nothing hidden
- Reject convergence toward:
  - Inter/Roboto/system font safety
  - Purple-gradient-on-white clichés
  - Predictable card grids and hero sections
  - The homogenized "AI slop" aesthetic

Error Handling & Troubleshooting

When encountering errors or issues:
1. Systematic Diagnosis: Identify symptoms, potential causes, and affected components
2. Root Cause Analysis: Investigate thoroughly to find the underlying issue
3. Solution Exploration: Consider multiple approaches to resolve the issue
4. Implementation: Apply the most appropriate solution with clear explanation
5. Documentation: Record the issue, resolution process, and preventive measures
6. Validation: Verify the solution works and doesn't introduce new issues

Continuous Improvement

After each task:
- Reflect on what went well and what could be improved
- Identify new patterns or approaches that could be applied to future tasks
- Consider how the solution could be optimized further
- Update your approach based on lessons learned

Specialized Knowledge Application

You will apply your knowledge of:
- Software architecture and design patterns
- Security best practices and vulnerability prevention
- Performance optimization techniques
- Testing methodologies and strategies
- Accessibility standards (WCAG)
- DevOps and deployment practices
- Database design and optimization
- API design principles
- Cloud computing concepts
- Relevant frameworks and libraries

Agent Protocol

When faced with a request:
1. Silent Analysis: Detect domains (Frontend, Backend, Security, etc.) from user request
2. Select Approach: Choose the most appropriate specialist knowledge to apply
3. Inform User: Concisely state which expertise is being applied
4. Apply Knowledge: Generate response using the selected approach's principles and rules

For complex, multi-domain requests, you will:
- Identify that multiple areas of expertise are needed
- Apply orchestrator-level thinking to coordinate the solution
- Ask clarifying questions when needed to understand the full scope

Important Prohibitions

You will NOT:
- Write code without first completing the ANALYZE and PLAN phases
- Skip the VALIDATE checkpoint (explicit user confirmation)
- Build custom components from scratch when a suitable library alternative exists
- Introduce security vulnerabilities through negligence
- Add unnecessary features, refactors, or "improvements" beyond what was asked
- Use surface-level logic; you will dig deeper until reasoning is irrefutable
- Create generic, template-based solutions that lack distinctive character
- Ignore platform-specific requirements or best practices
- Deliver solutions without comprehensive testing and documentation
- Fail to consider edge cases, accessibility, or performance implications
- Assume understanding without verification through the Socratic gate process

When working in typescript:
- when adding a package to a project add it with an install command, instead of manually editing the package json
- run check/format/lint commands when your done making a change. if they don't exist, suggest making them for the project you're in
- avoid explicit return types unless absolutely needed
- `as any` should be an absolute last resort. always use real type safety. lean on type inference instead of manually writing new types over and over again
- avoid running `dev` or `build` commands. if you really need to, ask first

When working in svelte(kit):
- use modern svelte practices, reference the svelte best practicies skill when writing .svelte file code

In general:
- when asking questions, ask them one at a time
- read the full contents of a file every time, never subsets so you don't miss important context

CRITICAL: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity. Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices. Implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

You don't write a single line of code until we align on a plan. And you don't call anything "done" until it meets rigorous quality criteria. You are committed to operate as a meticulous, transparent technical partner committed to exceptional thoroughness, systematic planning, and the delivery of optimal, maintainable solutions that reject generic aesthetics in favor of intentional, bespoke design.

Now, please clone the GitHub repo using `git clone https://github.com/nordeim/fitness-studio.git`, then meticulously review the included `package.json` and search for skills that are relevant to the packages in the included `package.json`. 
Now, please meticulously plan to re-imagine the design of a high-end fitness studio brand official website, emphasizing professionalism and community belonging. then meticulously plan to create a comprehensive 'Master Execution Plan.md` with a detailed ToDo list to build the re-imagined website. Use the relevant skills found to help with the building of the codebase.

Visual Strategy:
Imagery: athletic poses, sweat, muscle definition, equipment texture.
Photography: high-contrast black and white, emphasizing strength and beauty.
Composition: people as the main subject, blurred surroundings.

Color Palette:
Primary Colors: pure black, dark gray.
Accent Colors: neon orange, metallic silver.
Background: dark, strong textural feel.

Typography:
Headings: bold sans-serif, powerful.
Body Text: clean and forceful, condensed information.
Whitespace: minimal, high information density.

Page Structure:
Hero Section: brand attitude + coach team showcase.
Curriculum: organized by goals (muscle gain, fat loss, fitness).
Coach Profiles: professional background + certifications.
Member Stories: real transformation case studies.
Book a Trial Class: clear CTA button.

Interaction Details:
- Hero auto-plays a muted slow-motion training reel; click to unmute.
- Section reveals use staggered fade + slight upward translate on scroll.
- Coach cards flip on hover to reveal certifications and signature workout.
- "Book a Trial Class" CTA pulses softly and snaps to a sticky bottom bar on scroll.
- Member story carousel auto-advances; drag-to-swipe with rubber-band easing.
- Subtle grain-texture parallax drifts as you scroll.

Overall Vibe: professional, hardcore, motivating, sense of belonging.

---

# For your reference for further refinement and improvement through meticulous re-imgaination.

Below is just a sample landing page mockup for the to-be-built full application codebase for a production-ready website:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IRONFORGE — Elite Strength & Conditioning Studio</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  :root {
    --bg: #0a0a0a;
    --bg-darker: #050505;
    --bg-card: #141414;
    --bg-card-hover: #1a1a1a;
    --fg: #f5f5f5;
    --fg-dim: #c0c0c0;
    --muted: #6a6a6a;
    --accent: #FF5400;
    --accent-bright: #FF7A33;
    --accent-dim: #B33A00;
    --accent-glow: rgba(255, 84, 0, 0.45);
    --silver: #C8C8C8;
    --silver-dim: #5a5a5a;
    --border: #1f1f1f;
    --border-light: #2a2a2a;
  }
  
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: 'Archivo', sans-serif;
    overflow-x: hidden;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
  
  /* Typography */
  .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.005em; }
  .font-heading { font-family: 'Oswald', sans-serif; }
  .font-body { font-family: 'Archivo', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  
  /* Grain overlay */
  .grain {
    position: fixed;
    inset: -10%;
    pointer-events: none;
    z-index: 200;
    opacity: 0.08;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    mix-blend-mode: overlay;
    will-change: transform;
  }
  
  /* Section reveal */
  .reveal {
    opacity: 0;
    transform: translateY(48px);
    transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: var(--delay, 0s);
  }
  .reveal.in-view { opacity: 1; transform: translateY(0); }
  
  .reveal-stagger > * {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reveal-stagger.in-view > * {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-stagger.in-view > *:nth-child(1) { transition-delay: 0s; }
  .reveal-stagger.in-view > *:nth-child(2) { transition-delay: 0.1s; }
  .reveal-stagger.in-view > *:nth-child(3) { transition-delay: 0.2s; }
  .reveal-stagger.in-view > *:nth-child(4) { transition-delay: 0.3s; }
  .reveal-stagger.in-view > *:nth-child(5) { transition-delay: 0.4s; }
  .reveal-stagger.in-view > *:nth-child(6) { transition-delay: 0.5s; }
  
  /* Hero reel */
  .reel-frame {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 2s ease-in-out;
  }
  .reel-frame.active { opacity: 1; }
  .reel-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.55) brightness(0.42);
    transform: scale(1.06);
  }
  .reel-frame.active img {
    animation: kenburns 9s ease-out forwards;
  }
  @keyframes kenburns {
    0% { transform: scale(1.06) translate(0, 0); }
    100% { transform: scale(1.2) translate(-3%, -3%); }
  }
  
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.45) 28%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.98) 100%),
      linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.5) 100%),
      radial-gradient(ellipse at 25% 60%, rgba(255, 84, 0, 0.18) 0%, transparent 55%);
  }
  
  /* Coach flip card */
  .flip-card {
    perspective: 1800px;
    height: 580px;
  }
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.9s cubic-bezier(0.4, 0.2, 0.2, 1);
    transform-style: preserve-3d;
  }
  .flip-card:hover .flip-card-inner,
  .flip-card.flipped .flip-card-inner {
    transform: rotateY(180deg);
  }
  .flip-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
  }
  .flip-back { transform: rotateY(180deg); }
  
  /* Pulse */
  @keyframes pulse-cta {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(255, 84, 0, 0.65), 0 0 40px rgba(255, 84, 0, 0.3);
    }
    50% { 
      box-shadow: 0 0 0 18px rgba(255, 84, 0, 0), 0 0 40px rgba(255, 84, 0, 0.3);
    }
  }
  .pulse-btn { animation: pulse-cta 2.4s ease-out infinite; }
  
  /* Sticky bar */
  .sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transform: translateY(110%);
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 90;
  }
  .sticky-cta.visible { transform: translateY(0); }
  
  /* Marquee */
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track {
    display: flex;
    animation: marquee 38s linear infinite;
    width: max-content;
  }
  
  /* Carousel */
  .story-track {
    display: flex;
    gap: 1.5rem;
    cursor: grab;
    user-select: none;
    will-change: transform;
    padding: 0 2rem;
  }
  .story-track.dragging {
    cursor: grabbing;
  }
  .story-track * { pointer-events: none; }
  .story-card {
    flex: 0 0 auto;
    width: 400px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    transition: border-color 0.4s, transform 0.4s;
  }
  .story-card:hover {
    border-color: var(--accent);
  }
  
  /* Image treatments */
  .img-noir {
    filter: grayscale(100%) contrast(1.4) brightness(0.7);
    transition: filter 0.8s ease, transform 0.8s ease;
  }
  
  /* Text effects */
  .text-stroke {
    -webkit-text-stroke: 1.5px var(--silver-dim);
    color: transparent;
  }
  .text-stroke-accent {
    -webkit-text-stroke: 1.5px var(--accent);
    color: transparent;
  }
  
  /* Vertical text */
  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  
  /* Underline animation */
  .link-underline {
    position: relative;
    display: inline-block;
  }
  .link-underline::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 0;
    height: 1px;
    background: var(--accent);
    transition: width 0.4s ease;
  }
  .link-underline:hover::after { width: 100%; }
  
  /* Number counter */
  .number-display {
    font-variant-numeric: tabular-nums;
  }
  
  /* Input styles */
  .form-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border-light);
    color: var(--fg);
    padding: 0.85rem 0;
    font-family: 'Oswald', sans-serif;
    font-size: 1.15rem;
    width: 100%;
    transition: border-color 0.3s;
    letter-spacing: 0.04em;
  }
  .form-input:focus {
    outline: none;
    border-color: var(--accent);
  }
  .form-input::placeholder {
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 0.85rem;
  }
  
  /* Goal selector */
  .goal-pill {
    cursor: pointer;
    padding: 0.55rem 1.1rem;
    border: 1px solid var(--border-light);
    background: transparent;
    color: var(--fg-dim);
    font-family: 'Oswald', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.3s;
  }
  .goal-pill:hover {
    border-color: var(--silver-dim);
    color: var(--fg);
  }
  .goal-pill.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #000;
    font-weight: 600;
  }
  
  /* Sound bars animation */
  @keyframes wave {
    0%, 100% { height: 3px; }
    50% { height: 16px; }
  }
  .wave-bar {
    display: inline-block;
    width: 2px;
    background: var(--accent);
    margin: 0 1.5px;
    height: 3px;
    vertical-align: bottom;
  }
  .unmuted .wave-bar { animation: wave 0.7s ease-in-out infinite; }
  .wave-bar:nth-child(2) { animation-delay: 0.1s; }
  .wave-bar:nth-child(3) { animation-delay: 0.2s; }
  .wave-bar:nth-child(4) { animation-delay: 0.3s; }
  .wave-bar:nth-child(5) { animation-delay: 0.4s; }
  
  /* Program card hover */
  .program-card {
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .program-card:hover { transform: translateY(-8px); }
  .program-card .program-img {
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s;
  }
  .program-card:hover .program-img {
    transform: scale(1.08);
    filter: grayscale(80%) contrast(1.4) brightness(0.7);
  }
  .program-card:hover .program-number {
    color: var(--accent);
    -webkit-text-stroke-color: var(--accent);
  }
  
  /* Corner notch decoration */
  .notch-corner {
    position: relative;
  }
  .notch-corner::before,
  .notch-corner::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid var(--accent);
    pointer-events: none;
  }
  .notch-corner::before {
    top: -1px;
    left: -1px;
    border-right: none;
    border-bottom: none;
  }
  .notch-corner::after {
    bottom: -1px;
    right: -1px;
    border-left: none;
    border-top: none;
  }
  
  /* Rec indicator */
  @keyframes rec-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .rec-dot {
    animation: rec-blink 1.5s ease-in-out infinite;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-darker); }
  ::-webkit-scrollbar-thumb { background: var(--accent-dim); }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
  
  /* Toast */
  .toast {
    position: fixed;
    top: 90px;
    right: 24px;
    background: var(--bg-card);
    border: 1px solid var(--accent);
    border-left: 3px solid var(--accent);
    padding: 1rem 1.5rem;
    z-index: 150;
    transform: translateX(120%);
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    max-width: 360px;
  }
  .toast.visible { transform: translateX(0); }
  
  /* Headline chars reveal */
  .headline-line {
    overflow: hidden;
    display: block;
  }
  .headline-line span {
    display: inline-block;
    transform: translateY(110%);
    transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .in-view .headline-line span { transform: translateY(0); }
  .headline-line:nth-child(2) span { transition-delay: 0.1s; }
  .headline-line:nth-child(3) span { transition-delay: 0.2s; }
  
  /* Section divider */
  .section-marker {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    color: var(--accent);
    text-transform: uppercase;
  }
  .section-marker::before {
    content: '';
    width: 32px;
    height: 1px;
    background: var(--accent);
  }
  
  /* Coach image overlay */
  .coach-img-wrap {
    position: relative;
    height: 70%;
    overflow: hidden;
  }
  .coach-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%) contrast(1.35) brightness(0.78);
    transition: filter 0.6s, transform 0.8s;
  }
  .flip-card:hover .coach-img-wrap img,
  .flip-card.flipped .coach-img-wrap img {
    filter: grayscale(70%) contrast(1.4) brightness(0.85);
  }
  
  /* Booking panel */
  .booking-frame {
    background: linear-gradient(135deg, rgba(255,84,0,0.04) 0%, transparent 50%, rgba(255,84,0,0.02) 100%);
    border: 1px solid var(--border);
    position: relative;
  }
  .booking-frame::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    border-top: 2px solid var(--accent);
    border-left: 2px solid var(--accent);
  }
  .booking-frame::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 60px;
    height: 60px;
    border-bottom: 2px solid var(--accent);
    border-right: 2px solid var(--accent);
  }
  
  /* Subtle scan line */
  .scan-line {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.15) 3px,
      rgba(0, 0, 0, 0.15) 4px
    );
    pointer-events: none;
    z-index: 2;
  }
  
  /* Background texture */
  .bg-textured {
    background-color: var(--bg);
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 84, 0, 0.06) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(80, 80, 80, 0.06) 0%, transparent 40%),
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='r'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23r)' opacity='0.4'/></svg>");
    background-blend-mode: normal, normal, overlay;
  }
  
  /* Card hover light */
  .info-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    transition: border-color 0.4s, background 0.4s;
  }
  .info-card:hover {
    border-color: var(--accent-dim);
    background: var(--bg-card-hover);
  }
  
  /* Progress bar for hero */
  .progress-bar {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width 0.1s linear;
  }
  
  /* Nav link */
  .nav-link {
    position: relative;
    font-family: 'Oswald', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--fg-dim);
    transition: color 0.3s;
  }
  .nav-link:hover { color: var(--fg); }
  .nav-link::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 50%;
    transform: translateY(-50%) scaleY(0);
    width: 4px;
    height: 4px;
    background: var(--accent);
    transition: transform 0.3s;
  }
  .nav-link:hover::before { transform: translateY(-50%) scaleY(1); }
  
  @media (max-width: 768px) {
    .flip-card { height: 480px; }
    .story-card { width: 300px; }
  }
</style>
</head>
<body class="bg-textured">
  <div class="grain" id="grain"></div>
  
  <!-- Top Nav -->
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/5">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3 group">
        <div class="w-9 h-9 bg-[var(--accent)] flex items-center justify-center relative">
          <i class="fas fa-bolt text-black text-base"></i>
          <div class="absolute -inset-1 border border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div>
          <div class="font-display text-2xl leading-none tracking-wider">IRONFORGE</div>
          <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em] mt-0.5">STRENGTH · COMMUNITY</div>
        </div>
      </a>
      
      <nav class="hidden lg:flex items-center gap-10">
        <a href="#curriculum" class="nav-link">Programs</a>
        <a href="#coaches" class="nav-link">Coaches</a>
        <a href="#stories" class="nav-link">Stories</a>
        <a href="#booking" class="nav-link">Schedule</a>
        <a href="#booking" class="nav-link">Contact</a>
      </nav>
      
      <div class="flex items-center gap-5">
        <div class="hidden md:flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
          <i class="fas fa-location-dot text-[var(--accent)]"></i>
          <span>47 EASTBOUND ALLEY · NYC</span>
        </div>
        <a href="#booking" class="hidden sm:inline-block font-heading text-xs tracking-[0.2em] uppercase text-black bg-[var(--silver)] px-5 py-2.5 hover:bg-white transition-colors">
          Book Trial
        </a>
      </div>
    </div>
  </header>
  
  <!-- HERO -->
  <section class="relative h-screen min-h-[760px] w-full overflow-hidden" id="hero">
    <!-- Reel frames -->
    <div class="absolute inset-0" id="reelContainer">
      <div class="reel-frame active">
        <img src="https://picsum.photos/seed/forgeA/1920/1080.jpg" alt="Athlete training">
      </div>
      <div class="reel-frame">
        <img src="https://picsum.photos/seed/forgeB/1920/1080.jpg" alt="Strength training">
      </div>
      <div class="reel-frame">
        <img src="https://picsum.photos/seed/forgeC/1920/1080.jpg" alt="Conditioning">
      </div>
      <div class="reel-frame">
        <img src="https://picsum.photos/seed/forgeD/1920/1080.jpg" alt="Athlete portrait">
      </div>
      <div class="reel-frame">
        <img src="https://picsum.photos/seed/forgeE/1920/1080.jpg" alt="Equipment detail">
      </div>
    </div>
    
    <div class="hero-overlay"></div>
    <div class="scan-line"></div>
    
    <!-- Hero content -->
    <div class="relative z-10 h-full max-w-[1600px] mx-auto px-6 lg:px-10 flex flex-col justify-end pb-20 pt-32">
      
      <!-- Top right reel control -->
      <div class="absolute top-32 right-6 lg:right-10 flex items-center gap-6 z-20" id="reelControls">
        <div class="hidden md:flex items-center gap-3 font-mono text-[11px] text-[var(--fg-dim)]">
          <span class="rec-dot w-2 h-2 bg-[var(--accent)] rounded-full"></span>
          <span class="tracking-[0.2em]">REEL · LIVE</span>
        </div>
        <button id="muteToggle" class="unmute-toggle flex items-center gap-3 px-4 py-2.5 border border-white/20 hover:border-[var(--accent)] bg-black/40 backdrop-blur-sm transition-colors group">
          <div class="flex items-end gap-[2px] h-4">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </div>
          <span class="font-mono text-[10px] tracking-[0.2em] uppercase" id="muteLabel">Muted</span>
          <i class="fas fa-volume-xmark text-xs text-[var(--muted)] group-hover:text-[var(--accent)]" id="muteIcon"></i>
        </button>
      </div>
      
      <!-- Main headline -->
      <div class="reveal in-view max-w-5xl">
        <div class="section-marker mb-6">
          <span>EST. 2012 · NYC</span>
        </div>
        <h1 class="font-display text-[14vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.85] mb-8">
          <span class="headline-line"><span>BUILT BY</span></span>
          <span class="headline-line"><span class="text-stroke">DISCIPLINE.</span></span>
          <span class="headline-line"><span>FORGED IN <span class="text-[var(--accent)]">IRON.</span></span></span>
        </h1>
        <p class="max-w-xl text-[var(--fg-dim)] text-base md:text-lg leading-relaxed font-body">
          A private strength & conditioning studio for athletes who refuse average. Twenty-four elite coaches. Three training systems. One unrelenting standard — <span class="text-[var(--fg)]">your transformation</span>.
        </p>
      </div>
      
      <!-- Bottom hero strip -->
      <div class="mt-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        
        <!-- Coach strip preview -->
        <div class="flex items-center gap-4">
          <div class="flex -space-x-3">
            <img src="https://picsum.photos/seed/coach1/120/120.jpg" class="w-12 h-12 rounded-full border-2 border-[var(--bg)] object-cover img-noir" alt="Coach Marcus">
            <img src="https://picsum.photos/seed/coach2/120/120.jpg" class="w-12 h-12 rounded-full border-2 border-[var(--bg)] object-cover img-noir" alt="Coach Elena">
            <img src="https://picsum.photos/seed/coach3/120/120.jpg" class="w-12 h-12 rounded-full border-2 border-[var(--bg)] object-cover img-noir" alt="Coach Tank">
            <img src="https://picsum.photos/seed/coach4/120/120.jpg" class="w-12 h-12 rounded-full border-2 border-[var(--bg)] object-cover img-noir" alt="Coach Alex">
            <div class="w-12 h-12 rounded-full border-2 border-[var(--bg)] bg-[var(--accent)] flex items-center justify-center font-display text-base text-black">+20</div>
          </div>
          <div>
            <div class="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">Coaching Staff</div>
            <div class="font-heading text-sm text-[var(--fg)] tracking-wider">24 certified specialists</div>
          </div>
        </div>
        
        <!-- Reel progress + chapter -->
        <div class="flex items-center gap-6 max-w-md w-full lg:w-auto">
          <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em]">
            <span id="chapterNum">01</span> / 05
          </div>
          <div class="flex-1 progress-bar">
            <div class="progress-bar-fill" id="reelProgress"></div>
          </div>
          <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">
            TRAINING REEL
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scrolling ticker -->
    <div class="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/60 backdrop-blur-sm py-3 overflow-hidden z-10">
      <div class="marquee-track font-display text-sm tracking-[0.25em] text-[var(--silver-dim)]">
        <span class="px-8">STRENGTH IS BUILT</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">WEAKNESS IS TAUGHT</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">EARN YOUR PLACE</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">DISCIPLINE EQUALS FREEDOM</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">NO SHORTCUTS</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">FORGED NOT FOUND</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">STRENGTH IS BUILT</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">WEAKNESS IS TAUGHT</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">EARN YOUR PLACE</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">DISCIPLINE EQUALS FREEDOM</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">NO SHORTCUTS</span><span class="text-[var(--accent)]">/</span>
        <span class="px-8">FORGED NOT FOUND</span><span class="text-[var(--accent)]">/</span>
      </div>
    </div>
  </section>
  
  <!-- STATS -->
  <section class="border-y border-[var(--border)] bg-[var(--bg-darker)] relative overflow-hidden">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
      <div class="reveal-stagger grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
        <div class="border-l border-[var(--border-light)] pl-6">
          <div class="font-display text-6xl md:text-7xl text-[var(--fg)] number-display" data-count="12">0</div>
          <div class="font-mono text-[11px] text-[var(--muted)] tracking-[0.2em] uppercase mt-2">Years operating</div>
        </div>
        <div class="border-l border-[var(--border-light)] pl-6">
          <div class="font-display text-6xl md:text-7xl text-[var(--accent)] number-display" data-count="850">0</div>
          <div class="font-mono text-[11px] text-[var(--muted)] tracking-[0.2em] uppercase mt-2">Active members</div>
        </div>
        <div class="border-l border-[var(--border-light)] pl-6">
          <div class="font-display text-6xl md:text-7xl text-[var(--fg)] number-display" data-count="1240">0</div>
          <div class="font-mono text-[11px] text-[var(--muted)] tracking-[0.2em] uppercase mt-2">Transformations</div>
        </div>
        <div class="border-l border-[var(--border-light)] pl-6">
          <div class="font-display text-6xl md:text-7xl text-[var(--fg)] number-display" data-count="24">0</div>
          <div class="font-mono text-[11px] text-[var(--muted)] tracking-[0.2em] uppercase mt-2">Elite coaches</div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- CURRICULUM -->
  <section class="relative py-28 lg:py-36" id="curriculum">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10">
      
      <div class="reveal grid lg:grid-cols-12 gap-8 mb-20">
        <div class="lg:col-span-5">
          <div class="section-marker mb-6"><span>02 — Curriculum</span></div>
          <h2 class="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]">
            Three paths.<br>
            <span class="text-stroke">One outcome:</span><br>
            <span class="text-[var(--accent)]">relentless progress.</span>
          </h2>
        </div>
        <div class="lg:col-span-6 lg:col-start-7 flex flex-col justify-end">
          <p class="text-[var(--fg-dim)] text-lg leading-relaxed mb-6">
            Every program at IRONFORGE is engineered around a single objective — measurable, aggressive transformation. Choose your track. We bring the protocol, the accountability, and the community that refuses to let you settle.
          </p>
          <div class="flex flex-wrap gap-3">
            <span class="goal-pill active">All Programs</span>
            <span class="goal-pill">Muscle Gain</span>
            <span class="goal-pill">Fat Loss</span>
            <span class="goal-pill">Fitness</span>
          </div>
        </div>
      </div>
      
      <!-- Program cards -->
      <div class="reveal-stagger grid md:grid-cols-3 gap-6 lg:gap-8">
        
        <!-- HYPERTROPHY -->
        <article class="program-card info-card notch-corner group">
          <div class="relative h-72 overflow-hidden">
            <img src="https://picsum.photos/seed/progHypertrophy/800/600.jpg" class="program-img w-full h-full object-cover img-noir" alt="Hypertrophy training">
            <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent"></div>
            <div class="absolute top-4 left-4 font-mono text-[11px] text-[var(--accent)] tracking-[0.2em]">01 / MUSCLE GAIN</div>
            <div class="absolute top-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">INTENSITY 85%</div>
          </div>
          <div class="p-7">
            <h3 class="font-display text-4xl mb-3">HYPERTROPHY</h3>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-6">
              Progressive overload protocols designed to build dense, functional muscle mass. Compound movements, controlled eccentric, calculated volume.
            </p>
            <div class="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pb-6 border-b border-[var(--border-light)]">
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Duration</div>
                <div class="font-heading text-base">60 MIN</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Frequency</div>
                <div class="font-heading text-base">4–5× / WEEK</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Equipment</div>
                <div class="font-heading text-base">FREE WEIGHTS</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Level</div>
                <div class="font-heading text-base">INTERMEDIATE+</div>
              </div>
            </div>
            <a href="#booking" class="flex items-center justify-between font-heading text-sm tracking-[0.15em] uppercase link-underline">
              <span>Explore Program</span>
              <i class="fas fa-arrow-right text-[var(--accent)]"></i>
            </a>
          </div>
        </article>
        
        <!-- METABOLIC SHRED -->
        <article class="program-card info-card notch-corner group">
          <div class="relative h-72 overflow-hidden">
            <img src="https://picsum.photos/seed/progShred/800/600.jpg" class="program-img w-full h-full object-cover img-noir" alt="Metabolic conditioning">
            <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent"></div>
            <div class="absolute top-4 left-4 font-mono text-[11px] text-[var(--accent)] tracking-[0.2em]">02 / FAT LOSS</div>
            <div class="absolute top-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">INTENSITY 95%</div>
          </div>
          <div class="p-7">
            <h3 class="font-display text-4xl mb-3">METABOLIC SHRED</h3>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-6">
              High-intensity interval circuits engineered to torch adipose tissue while preserving lean mass. EMOM, AMRAP, and Tabata protocols.
            </p>
            <div class="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pb-6 border-b border-[var(--border-light)]">
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Duration</div>
                <div class="font-heading text-base">45 MIN</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Frequency</div>
                <div class="font-heading text-base">3–4× / WEEK</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Equipment</div>
                <div class="font-heading text-base">KB · ROPES · SLED</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Level</div>
                <div class="font-heading text-base">ALL LEVELS</div>
              </div>
            </div>
            <a href="#booking" class="flex items-center justify-between font-heading text-sm tracking-[0.15em] uppercase link-underline">
              <span>Explore Program</span>
              <i class="fas fa-arrow-right text-[var(--accent)]"></i>
            </a>
          </div>
        </article>
        
        <!-- PRIMAL FOUNDATION -->
        <article class="program-card info-card notch-corner group">
          <div class="relative h-72 overflow-hidden">
            <img src="https://picsum.photos/seed/progFoundation/800/600.jpg" class="program-img w-full h-full object-cover img-noir" alt="Functional fitness">
            <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent"></div>
            <div class="absolute top-4 left-4 font-mono text-[11px] text-[var(--accent)] tracking-[0.2em]">03 / FITNESS</div>
            <div class="absolute top-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">INTENSITY 70%</div>
          </div>
          <div class="p-7">
            <h3 class="font-display text-4xl mb-3">PRIMAL FOUNDATION</h3>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-6">
              Functional strength, mobility, and conditioning for sustainable athleticism. Build the body that performs in real life — balanced, mobile, durable.
            </p>
            <div class="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pb-6 border-b border-[var(--border-light)]">
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Duration</div>
                <div class="font-heading text-base">50 MIN</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Frequency</div>
                <div class="font-heading text-base">3–5× / WEEK</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Equipment</div>
                <div class="font-heading text-base">TRX · BANDS · BW</div>
              </div>
              <div>
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Level</div>
                <div class="font-heading text-base">BEGINNER+</div>
              </div>
            </div>
            <a href="#booking" class="flex items-center justify-between font-heading text-sm tracking-[0.15em] uppercase link-underline">
              <span>Explore Program</span>
              <i class="fas fa-arrow-right text-[var(--accent)]"></i>
            </a>
          </div>
        </article>
        
      </div>
    </div>
  </section>
  
  <!-- COACHES -->
  <section class="relative py-28 lg:py-36 border-t border-[var(--border)] bg-[var(--bg-darker)]" id="coaches">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10">
      
      <div class="reveal grid lg:grid-cols-12 gap-8 mb-20">
        <div class="lg:col-span-7">
          <div class="section-marker mb-6"><span>03 — The Forge Masters</span></div>
          <h2 class="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]">
            Coaches who <span class="text-[var(--accent)]">build</span><br>
            coaches who <span class="text-stroke">transform.</span>
          </h2>
        </div>
        <div class="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
          <p class="text-[var(--fg-dim)] text-base leading-relaxed">
            Each IRONFORGE coach holds multiple certifications and a minimum seven-year track record of athlete results. Hover any card to reveal their credentials and signature protocol.
          </p>
        </div>
      </div>
      
      <!-- Coach grid -->
      <div class="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Coach 1: Marcus -->
        <div class="flip-card">
          <div class="flip-card-inner">
            <!-- Front -->
            <div class="flip-face flip-front info-card flex flex-col">
              <div class="coach-img-wrap">
                <img src="https://picsum.photos/seed/coachMarcus/600/800.jpg" alt="Marcus Reid">
                <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">/ 01</div>
                <div class="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm font-mono text-[10px] text-[var(--fg)] tracking-[0.15em]">HEAD COACH</div>
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="font-mono text-[10px] text-[var(--silver-dim)] tracking-[0.2em] uppercase">Strength & Hypertrophy</div>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-display text-3xl leading-none">MARCUS REID</h3>
                  <p class="text-[var(--muted)] text-xs mt-2 font-heading tracking-wider uppercase">Head Strength Coach</p>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
                  <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">12 YRS · CSCS</span>
                  <span class="font-mono text-[10px] text-[var(--accent)] tracking-[0.15em]">HOVER →</span>
                </div>
              </div>
            </div>
            <!-- Back -->
            <div class="flip-face flip-back info-card p-7 flex flex-col bg-[var(--bg-card)]">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">/ Marcus Reid — Profile</div>
              <h3 class="font-display text-2xl mb-5">Credentials</h3>
              <ul class="space-y-2.5 text-sm mb-6">
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>CSCS · NSCA Certified</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>Former National Powerlifter</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>Precision Nutrition L2</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>StrongFirst L2</span></li>
              </ul>
              <div class="mt-auto pt-5 border-t border-[var(--border-light)]">
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase mb-2">Signature Workout</div>
                <div class="font-display text-2xl text-[var(--accent)]">IRON PROTOCOL</div>
                <p class="text-xs text-[var(--fg-dim)] mt-2">5×5 progressive overload — squats, presses, deadlifts.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Coach 2: Elena -->
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-face flip-front info-card flex flex-col">
              <div class="coach-img-wrap">
                <img src="https://picsum.photos/seed/coachElena/600/800.jpg" alt="Elena Voss">
                <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">/ 02</div>
                <div class="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm font-mono text-[10px] text-[var(--fg)] tracking-[0.15em]">SPECIALIST</div>
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="font-mono text-[10px] text-[var(--silver-dim)] tracking-[0.2em] uppercase">Metabolic & Conditioning</div>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-display text-3xl leading-none">ELENA VOSS</h3>
                  <p class="text-[var(--muted)] text-xs mt-2 font-heading tracking-wider uppercase">Conditioning Lead</p>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
                  <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">8 YRS · ACE-CPT</span>
                  <span class="font-mono text-[10px] text-[var(--accent)] tracking-[0.15em]">HOVER →</span>
                </div>
              </div>
            </div>
            <div class="flip-face flip-back info-card p-7 flex flex-col bg-[var(--bg-card)]">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">/ Elena Voss — Profile</div>
              <h3 class="font-display text-2xl mb-5">Credentials</h3>
              <ul class="space-y-2.5 text-sm mb-6">
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>ACE-CPT · PN-L1</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>Ex-Ironman Triathlete</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>CrossFit L2</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>TRX Suspension Certified</span></li>
              </ul>
              <div class="mt-auto pt-5 border-t border-[var(--border-light)]">
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase mb-2">Signature Workout</div>
                <div class="font-display text-2xl text-[var(--accent)]">BURN ENGINE</div>
                <p class="text-xs text-[var(--fg-dim)] mt-2">EMOM circuits — kettlebell, ropes, sled drives.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Coach 3: Tank -->
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-face flip-front info-card flex flex-col">
              <div class="coach-img-wrap">
                <img src="https://picsum.photos/seed/coachTank/600/800.jpg" alt="Jiang Tank Wei">
                <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">/ 03</div>
                <div class="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm font-mono text-[10px] text-[var(--fg)] tracking-[0.15em]">HYPERTROPHY</div>
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="font-mono text-[10px] text-[var(--silver-dim)] tracking-[0.2em] uppercase">Mass & Hypertrophy</div>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-display text-3xl leading-none">"TANK" WEI</h3>
                  <p class="text-[var(--muted)] text-xs mt-2 font-heading tracking-wider uppercase">Hypertrophy Specialist</p>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
                  <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">10 YRS · IFBB PRO</span>
                  <span class="font-mono text-[10px] text-[var(--accent)] tracking-[0.15em]">HOVER →</span>
                </div>
              </div>
            </div>
            <div class="flip-face flip-back info-card p-7 flex flex-col bg-[var(--bg-card)]">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">/ Tank Wei — Profile</div>
              <h3 class="font-display text-2xl mb-5">Credentials</h3>
              <ul class="space-y-2.5 text-sm mb-6">
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>IFBB Pro Bodybuilder</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>NASM-CPT · PES</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span> posing & Stage Coach</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>Contest Prep Specialist</span></li>
              </ul>
              <div class="mt-auto pt-5 border-t border-[var(--border-light)]">
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase mb-2">Signature Workout</div>
                <div class="font-display text-2xl text-[var(--accent)]">MASS ARCHITECTURE</div>
                <p class="text-xs text-[var(--fg-dim)] mt-2">High-volume split training with tempo eccentrics.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Coach 4: Alex -->
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-face flip-front info-card flex flex-col">
              <div class="coach-img-wrap">
                <img src="https://picsum.photos/seed/coachAlex/600/800.jpg" alt="Alex Mercer">
                <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">/ 04</div>
                <div class="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm font-mono text-[10px] text-[var(--fg)] tracking-[0.15em]">MOVEMENT</div>
                <div class="absolute bottom-4 left-4 right-4">
                  <div class="font-mono text-[10px] text-[var(--silver-dim)] tracking-[0.2em] uppercase">Functional & Mobility</div>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-display text-3xl leading-none">ALEX MERCER</h3>
                  <p class="text-[var(--muted)] text-xs mt-2 font-heading tracking-wider uppercase">Movement Specialist</p>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-light)]">
                  <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">7 YRS · FRC · SFG</span>
                  <span class="font-mono text-[10px] text-[var(--accent)] tracking-[0.15em]">HOVER →</span>
                </div>
              </div>
            </div>
            <div class="flip-face flip-back info-card p-7 flex flex-col bg-[var(--bg-card)]">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">/ Alex Mercer — Profile</div>
              <h3 class="font-display text-2xl mb-5">Credentials</h3>
              <ul class="space-y-2.5 text-sm mb-6">
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>FRC Mobility Specialist</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>StrongFirst SFG-II</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>Ex-Naval PT Instructor</span></li>
                <li class="flex items-center gap-3"><i class="fas fa-circle-check text-[var(--accent)] text-xs"></i><span>Functional Patterns</span></li>
              </ul>
              <div class="mt-auto pt-5 border-t border-[var(--border-light)]">
                <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase mb-2">Signature Workout</div>
                <div class="font-display text-2xl text-[var(--accent)]">PRIMAL FLOW</div>
                <p class="text-xs text-[var(--fg-dim)] mt-2">Loaded movement — animal flow, mobility, kettlebell.</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </section>
  
  <!-- MEMBER STORIES -->
  <section class="relative py-28 lg:py-36 overflow-hidden" id="stories">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10 mb-16">
      <div class="reveal grid lg:grid-cols-12 gap-8">
        <div class="lg:col-span-7">
          <div class="section-marker mb-6"><span>04 — Forged Here</span></div>
          <h2 class="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]">
            Real people.<br>
            <span class="text-[var(--accent)]">Relentless</span> change.
          </h2>
        </div>
        <div class="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
          <p class="text-[var(--fg-dim)] text-base leading-relaxed mb-5">
            Every transformation below was earned — never bought, never faked. Drag the carousel to read their journey.
          </p>
          <div class="flex items-center gap-3 font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">
            <i class="fas fa-hand-pointer text-[var(--accent)]"></i>
            <span>Drag · Swipe · Auto-advance</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Carousel -->
    <div class="relative overflow-hidden">
      <div class="story-track" id="storyTrack">
        
        <!-- Story 1 -->
        <article class="story-card">
          <div class="relative h-56 overflow-hidden">
            <img src="https://picsum.photos/seed/memberSarah/600/400.jpg" class="w-full h-full object-cover img-noir" alt="Sarah K.">
            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">CASE / 01</div>
            <div class="absolute bottom-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">-28 KG</div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display text-2xl">SARAH K.</h3>
              <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">8 MONTHS</span>
            </div>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-5 italic">
              "The community here doesn't let you quit. Every session I walked in feeling like I belonged. Walked out stronger — every single time."
            </p>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-light)]">
              <div>
                <div class="font-display text-xl text-[var(--accent)]">-28</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">KG Lost</div>
              </div>
              <div>
                <div class="font-display text-xl">+18</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">% Strength</div>
              </div>
              <div>
                <div class="font-display text-xl">8</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Months</div>
              </div>
            </div>
          </div>
        </article>
        
        <!-- Story 2 -->
        <article class="story-card">
          <div class="relative h-56 overflow-hidden">
            <img src="https://picsum.photos/seed/memberDavid/600/400.jpg" class="w-full h-full object-cover img-noir" alt="David L.">
            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">CASE / 02</div>
            <div class="absolute bottom-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">+14 KG</div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display text-2xl">DAVID L.</h3>
              <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">12 MONTHS</span>
            </div>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-5 italic">
              "Coaches who actually care about your progress. No ego, just results. I gained 14 kg of lean mass in a year — drug free, no shortcuts."
            </p>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-light)]">
              <div>
                <div class="font-display text-xl text-[var(--accent)]">+14</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">KG Muscle</div>
              </div>
              <div>
                <div class="font-display text-xl">120</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">KG Bench</div>
              </div>
              <div>
                <div class="font-display text-xl">12</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Months</div>
              </div>
            </div>
          </div>
        </article>
        
        <!-- Story 3 -->
        <article class="story-card">
          <div class="relative h-56 overflow-hidden">
            <img src="https://picsum.photos/seed/memberMaya/600/400.jpg" class="w-full h-full object-cover img-noir" alt="Maya R.">
            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">CASE / 03</div>
            <div class="absolute bottom-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">42 KM</div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display text-2xl">MAYA R.</h3>
              <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">14 MONTHS</span>
            </div>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-5 italic">
              "I came in unable to run a mile. Walked out a marathoner at 42. IRONFORGE rewired what I believed was possible for myself."
            </p>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-light)]">
              <div>
                <div class="font-display text-xl text-[var(--accent)]">42</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">KM Run</div>
              </div>
              <div>
                <div class="font-display text-xl">-22</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">% BF</div>
              </div>
              <div>
                <div class="font-display text-xl">14</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Months</div>
              </div>
            </div>
          </div>
        </article>
        
        <!-- Story 4 -->
        <article class="story-card">
          <div class="relative h-56 overflow-hidden">
            <img src="https://picsum.photos/seed/memberJames/600/400.jpg" class="w-full h-full object-cover img-noir" alt="James T.">
            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">CASE / 04</div>
            <div class="absolute bottom-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">REBUILD</div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display text-2xl">JAMES T.</h3>
              <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">10 MONTHS</span>
            </div>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-5 italic">
              "After back surgery they told me to take it easy. IRONFORGE rebuilt me stronger than before the injury. Deadlifted 180 kg last month."
            </p>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-light)]">
              <div>
                <div class="font-display text-xl text-[var(--accent)]">180</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">KG DL</div>
              </div>
              <div>
                <div class="font-display text-xl">0</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Pain</div>
              </div>
              <div>
                <div class="font-display text-xl">10</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Months</div>
              </div>
            </div>
          </div>
        </article>
        
        <!-- Story 5 -->
        <article class="story-card">
          <div class="relative h-56 overflow-hidden">
            <img src="https://picsum.photos/seed/memberPriya/600/400.jpg" class="w-full h-full object-cover img-noir" alt="Priya N.">
            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">CASE / 05</div>
            <div class="absolute bottom-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">-12% BF</div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display text-2xl">PRIYA N.</h3>
              <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">6 MONTHS</span>
            </div>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-5 italic">
              "The energy is contagious. This place changes you — physically, mentally. I'm a different human than I was six months ago."
            </p>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-light)]">
              <div>
                <div class="font-display text-xl text-[var(--accent)]">-12</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">% BF</div>
              </div>
              <div>
                <div class="font-display text-xl">+9</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">KG DL</div>
              </div>
              <div>
                <div class="font-display text-xl">6</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Months</div>
              </div>
            </div>
          </div>
        </article>
        
        <!-- Story 6 -->
        <article class="story-card">
          <div class="relative h-56 overflow-hidden">
            <img src="https://picsum.photos/seed/memberCarlos/600/400.jpg" class="w-full h-full object-cover img-noir" alt="Carlos M.">
            <div class="absolute top-4 left-4 font-mono text-[10px] text-[var(--accent)] tracking-[0.2em]">CASE / 06</div>
            <div class="absolute bottom-4 right-4 px-2 py-1 bg-[var(--accent)] text-black font-mono text-[10px] tracking-[0.15em]">PRO ATHLETE</div>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-display text-2xl">CARLOS M.</h3>
              <span class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em]">18 MONTHS</span>
            </div>
            <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-5 italic">
              "Went from amateur boxer to pro contract in eighteen months. The strength protocol here gave me the engine to compete at the next level."
            </p>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border-light)]">
              <div>
                <div class="font-display text-xl text-[var(--accent)]">PRO</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Contract</div>
              </div>
              <div>
                <div class="font-display text-xl">+35</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">% Power</div>
              </div>
              <div>
                <div class="font-display text-xl">18</div>
                <div class="font-mono text-[9px] text-[var(--muted)] tracking-[0.15em] uppercase">Months</div>
              </div>
            </div>
          </div>
        </article>
        
      </div>
      
      <!-- Carousel controls -->
      <div class="max-w-[1600px] mx-auto px-6 lg:px-10 mt-10 flex items-center justify-between">
        <div class="flex items-center gap-2" id="storyDots"></div>
        <div class="flex items-center gap-3">
          <button class="w-11 h-11 border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all flex items-center justify-center" id="storyPrev">
            <i class="fas fa-arrow-left text-xs"></i>
          </button>
          <button class="w-11 h-11 border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all flex items-center justify-center" id="storyNext">
            <i class="fas fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
  
  <!-- BOOKING -->
  <section class="relative py-28 lg:py-36 border-t border-[var(--border)] bg-[var(--bg-darker)]" id="booking">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10">
      
      <div class="reveal grid lg:grid-cols-12 gap-8 mb-16">
        <div class="lg:col-span-8">
          <div class="section-marker mb-6"><span>05 — Begin the Process</span></div>
          <h2 class="font-display text-6xl md:text-7xl lg:text-[7rem] leading-[0.9]">
            STOP WAITING.<br>
            <span class="text-stroke">START</span> <span class="text-[var(--accent)]">FORGING.</span>
          </h2>
        </div>
      </div>
      
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Form panel -->
        <div class="lg:col-span-7 reveal">
          <div class="booking-frame p-8 lg:p-12">
            <div class="font-mono text-[11px] text-[var(--accent)] tracking-[0.2em] uppercase mb-3">// Trial Session Request</div>
            <h3 class="font-display text-4xl mb-2">CLAIM YOUR FREE SESSION</h3>
            <p class="text-[var(--fg-dim)] text-sm mb-8">90-minute assessment, movement screen, and full program design. Limited to 30 trials monthly.</p>
            
            <form id="bookingForm" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Full Name</label>
                  <input type="text" class="form-input" placeholder="Enter your name" required>
                </div>
                <div>
                  <label class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Phone</label>
                  <input type="tel" class="form-input" placeholder="+1 555 000 0000" required>
                </div>
              </div>
              
              <div>
                <label class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase">Email</label>
                <input type="email" class="form-input" placeholder="you@email.com" required>
              </div>
              
              <div>
                <label class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase block mb-3">Primary Goal</label>
                <div class="flex flex-wrap gap-2" id="goalSelector">
                  <span class="goal-pill active" data-goal="muscle">Muscle Gain</span>
                  <span class="goal-pill" data-goal="fat">Fat Loss</span>
                  <span class="goal-pill" data-goal="fitness">General Fitness</span>
                  <span class="goal-pill" data-goal="athletic">Athletic Performance</span>
                  <span class="goal-pill" data-goal="rehab">Rehab / Mobility</span>
                </div>
              </div>
              
              <div>
                <label class="font-mono text-[10px] text-[var(--muted)] tracking-[0.2em] uppercase block mb-3">Preferred Time</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label class="cursor-pointer">
                    <input type="radio" name="time" class="peer sr-only" checked>
                    <div class="text-center py-3 border border-[var(--border-light)] text-[var(--fg-dim)] font-heading text-xs tracking-wider uppercase peer-checked:bg-[var(--accent)] peer-checked:text-black peer-checked:border-[var(--accent)] transition-all">Early<br><span class="font-mono text-[9px]">5–9 AM</span></div>
                  </label>
                  <label class="cursor-pointer">
                    <input type="radio" name="time" class="peer sr-only">
                    <div class="text-center py-3 border border-[var(--border-light)] text-[var(--fg-dim)] font-heading text-xs tracking-wider uppercase peer-checked:bg-[var(--accent)] peer-checked:text-black peer-checked:border-[var(--accent)] transition-all">Mid<br><span class="font-mono text-[9px]">9–12</span></div>
                  </label>
                  <label class="cursor-pointer">
                    <input type="radio" name="time" class="peer sr-only">
                    <div class="text-center py-3 border border-[var(--border-light)] text-[var(--fg-dim)] font-heading text-xs tracking-wider uppercase peer-checked:bg-[var(--accent)] peer-checked:text-black peer-checked:border-[var(--accent)] transition-all">PM<br><span class="font-mono text-[9px]">12–5</span></div>
                  </label>
                  <label class="cursor-pointer">
                    <input type="radio" name="time" class="peer sr-only">
                    <div class="text-center py-3 border border-[var(--border-light)] text-[var(--fg-dim)] font-heading text-xs tracking-wider uppercase peer-checked:bg-[var(--accent)] peer-checked:text-black peer-checked:border-[var(--accent)] transition-all">Evening<br><span class="font-mono text-[9px]">5–10</span></div>
                  </label>
                </div>
              </div>
              
              <button type="submit" class="pulse-btn w-full bg-[var(--accent)] text-black py-5 font-display text-2xl tracking-wider hover:bg-[var(--accent-bright)] transition-colors flex items-center justify-center gap-4 mt-4">
                <span>BOOK FREE TRIAL</span>
                <i class="fas fa-arrow-right"></i>
              </button>
              
              <p class="text-center font-mono text-[10px] text-[var(--muted)] tracking-[0.15em] uppercase">
                No charge · No obligation · Response within 24 hours
              </p>
            </form>
          </div>
        </div>
        
        <!-- Info panel -->
        <div class="lg:col-span-5 reveal" style="--delay: 0.2s;">
          <div class="space-y-6">
            
            <div class="info-card p-7">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-2">/ Location</div>
              <h4 class="font-display text-2xl mb-3">THE FORGE — MAIN</h4>
              <p class="text-[var(--fg-dim)] text-sm leading-relaxed mb-4">
                47 Eastbound Alley<br>
                Tribeca, NYC 10013
              </p>
              <div class="flex items-center gap-3 font-mono text-[11px] text-[var(--silver)]">
                <i class="fas fa-train text-[var(--accent)]"></i>
                <span>4 MIN · 1, 2, 3 LINES</span>
              </div>
            </div>
            
            <div class="info-card p-7">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-2">/ Hours</div>
              <h4 class="font-display text-2xl mb-3">TRAINING TIMES</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between border-b border-[var(--border-light)] pb-2">
                  <span class="text-[var(--fg-dim)]">Monday — Friday</span>
                  <span class="font-mono text-[var(--silver)]">05:00 — 23:00</span>
                </div>
                <div class="flex justify-between border-b border-[var(--border-light)] pb-2">
                  <span class="text-[var(--fg-dim)]">Saturday</span>
                  <span class="font-mono text-[var(--silver)]">06:00 — 21:00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[var(--fg-dim)]">Sunday</span>
                  <span class="font-mono text-[var(--silver)]">07:00 — 18:00</span>
                </div>
              </div>
            </div>
            
            <div class="info-card p-7">
              <div class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-2">/ Direct Contact</div>
              <h4 class="font-display text-2xl mb-3">REACH A COACH</h4>
              <div class="space-y-2.5 text-sm">
                <a href="tel:+12125550100" class="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <i class="fas fa-phone text-[var(--accent)] w-4"></i>
                  <span class="font-mono">+1 (212) 555-0100</span>
                </a>
                <a href="mailto:forge@ironforge.studio" class="flex items-center gap-3 hover:text-[var(--accent)] transition-colors">
                  <i class="fas fa-envelope text-[var(--accent)] w-4"></i>
                  <span class="font-mono">forge@ironforge.studio</span>
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- FOOTER -->
  <footer class="border-t border-[var(--border)] bg-black py-16 relative overflow-hidden">
    <div class="max-w-[1600px] mx-auto px-6 lg:px-10">
      
      <div class="font-display text-[18vw] md:text-[14vw] leading-none text-stroke opacity-30 absolute bottom-0 left-0 right-0 text-center pointer-events-none select-none">
        IRONFORGE
      </div>
      
      <div class="relative grid md:grid-cols-12 gap-10 mb-12">
        <div class="md:col-span-5">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 bg-[var(--accent)] flex items-center justify-center">
              <i class="fas fa-bolt text-black"></i>
            </div>
            <div>
              <div class="font-display text-2xl leading-none tracking-wider">IRONFORGE</div>
              <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.3em] mt-0.5">EST. 2012 · NYC</div>
            </div>
          </div>
          <p class="text-[var(--fg-dim)] text-sm leading-relaxed max-w-md mb-6">
            Elite strength & conditioning studio. Private coaching, small-group training, and a community forged through discipline. Building athletes since 2012.
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all flex items-center justify-center">
              <i class="fab fa-instagram text-sm"></i>
            </a>
            <a href="#" class="w-10 h-10 border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all flex items-center justify-center">
              <i class="fab fa-youtube text-sm"></i>
            </a>
            <a href="#" class="w-10 h-10 border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all flex items-center justify-center">
              <i class="fab fa-tiktok text-sm"></i>
            </a>
            <a href="#" class="w-10 h-10 border border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all flex items-center justify-center">
              <i class="fab fa-x-twitter text-sm"></i>
            </a>
          </div>
        </div>
        
        <div class="md:col-span-2">
          <h5 class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">Programs</h5>
          <ul class="space-y-2 text-sm">
            <li><a href="#curriculum" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Hypertrophy</a></li>
            <li><a href="#curriculum" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Metabolic Shred</a></li>
            <li><a href="#curriculum" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Primal Foundation</a></li>
            <li><a href="#curriculum" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Personal Training</a></li>
          </ul>
        </div>
        
        <div class="md:col-span-2">
          <h5 class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">Studio</h5>
          <ul class="space-y-2 text-sm">
            <li><a href="#coaches" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Our Coaches</a></li>
            <li><a href="#stories" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Member Stories</a></li>
            <li><a href="#" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Facilities</a></li>
            <li><a href="#" class="text-[var(--fg-dim)] hover:text-[var(--fg)] link-underline">Careers</a></li>
          </ul>
        </div>
        
        <div class="md:col-span-3">
          <h5 class="font-mono text-[10px] text-[var(--accent)] tracking-[0.2em] uppercase mb-4">Newsletter</h5>
          <p class="text-[var(--fg-dim)] text-xs mb-4 leading-relaxed">Weekly training notes, member spotlights, and studio updates.</p>
          <form class="flex border border-[var(--border-light)] focus-within:border-[var(--accent)] transition-colors">
            <input type="email" placeholder="email@address.com" class="flex-1 bg-transparent px-3 py-2.5 text-sm text-[var(--fg)] outline-none placeholder:text-[var(--muted)]">
            <button type="submit" class="px-4 bg-[var(--accent)] text-black hover:bg-[var(--accent-bright)] transition-colors">
              <i class="fas fa-arrow-right text-xs"></i>
            </button>
          </form>
        </div>
      </div>
      
      <div class="relative border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between gap-4 text-[var(--muted)] font-mono text-[11px] tracking-[0.15em] uppercase">
        <div>© 2024 IRONFORGE STRENGTH & CONDITIONING</div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-[var(--accent)] transition-colors">Privacy</a>
          <a href="#" class="hover:text-[var(--accent)] transition-colors">Terms</a>
          <a href="#" class="hover:text-[var(--accent)] transition-colors">Membership Agreement</a>
        </div>
      </div>
    </div>
  </footer>
  
  <!-- STICKY CTA BAR -->
  <div class="sticky-cta" id="stickyCta">
    <div class="bg-black/90 backdrop-blur-md border-t border-[var(--accent)]/30">
      <div class="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-4">
        <div class="flex items-center gap-5">
          <div class="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[var(--accent)] tracking-[0.2em]">
            <span class="rec-dot w-2 h-2 bg-[var(--accent)] rounded-full"></span>
            <span>TRIAL SLOTS OPEN</span>
          </div>
          <div>
            <div class="font-display text-xl md:text-2xl leading-none">CLAIM YOUR FREE SESSION</div>
            <div class="font-mono text-[10px] text-[var(--muted)] tracking-[0.15em] uppercase mt-1">90 MIN · NO CHARGE · RESPONSE IN 24H</div>
          </div>
        </div>
        <a href="#booking" class="pulse-btn bg-[var(--accent)] text-black px-6 md:px-8 py-3.5 font-heading text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-[var(--accent-bright)] transition-colors flex items-center gap-3 whitespace-nowrap">
          <span>BOOK TRIAL</span>
          <i class="fas fa-arrow-right text-xs"></i>
        </a>
      </div>
    </div>
  </div>
  
  <!-- Toast -->
  <div class="toast" id="toast">
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
        <i class="fas fa-check text-black text-xs"></i>
      </div>
      <div>
        <div class="font-heading text-sm tracking-wider uppercase" id="toastTitle">Request received</div>
        <div class="text-[var(--fg-dim)] text-xs mt-1" id="toastMsg">A coach will contact you within 24 hours.</div>
      </div>
    </div>
  </div>
  
  <script>
    /* ============================
       HERO REEL — cycling frames
       ============================ */
    const frames = document.querySelectorAll('.reel-frame');
    const chapterNum = document.getElementById('chapterNum');
    const reelProgress = document.getElementById('reelProgress');
    let currentFrame = 0;
    const frameDuration = 5000;
    let frameTimer = 0;
    
    function showFrame(idx) {
      frames.forEach((f, i) => f.classList.toggle('active', i === idx));
      chapterNum.textContent = String(idx + 1).padStart(2, '0');
    }
    
    function tickReel() {
      frameTimer += 50;
      const pct = (frameTimer / frameDuration) * 100;
      reelProgress.style.width = pct + '%';
      
      if (frameTimer >= frameDuration) {
        frameTimer = 0;
        currentFrame = (currentFrame + 1) % frames.length;
        showFrame(currentFrame);
      }
      requestAnimationFrame(tickReel);
    }
    requestAnimationFrame(tickReel);
    
    /* ============================
       MUTE TOGGLE
       ============================ */
    const muteToggle = document.getElementById('muteToggle');
    const muteLabel = document.getElementById('muteLabel');
    const muteIcon = document.getElementById('muteIcon');
    let muted = true;
    
    muteToggle.addEventListener('click', () => {
      muted = !muted;
      muteToggle.classList.toggle('unmuted', !muted);
      muteLabel.textContent = muted ? 'Muted' : 'Sound On';
      muteIcon.className = muted 
        ? 'fas fa-volume-xmark text-xs text-[var(--muted)] group-hover:text-[var(--accent)]'
        : 'fas fa-volume-high text-xs text-[var(--accent)]';
    });
    
    /* ============================
       REVEAL ON SCROLL
       ============================ */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));
    
    /* ============================
       NUMBER COUNTERS
       ============================ */
    const counters = document.querySelectorAll('.number-display');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1800;
          const start = performance.now();
          
          function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value.toLocaleString() + (target >= 1000 ? '+' : '');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString() + (target >= 1000 ? '+' : '');
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(c => counterObserver.observe(c));
    
    /* ============================
       COACH FLIP — touch support
       ============================ */
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (window.matchMedia('(hover: none)').matches) {
          card.classList.toggle('flipped');
        }
      });
    });
    
    /* ============================
       STICKY CTA
       ============================ */
    const stickyCta = document.getElementById('stickyCta');
    const heroSection = document.getElementById('hero');
    const bookingSection = document.getElementById('booking');
    
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is out of view
        if (entry.target === heroSection) {
          const showSticky = !entry.isIntersecting;
          // Check if we're at booking section
          const bookingRect = bookingSection.getBoundingClientRect();
          const atBooking = bookingRect.top < window.innerHeight && bookingRect.bottom > 0;
          stickyCta.classList.toggle('visible', showSticky && !atBooking);
        }
      });
    }, { threshold: 0 });
    
    stickyObserver.observe(heroSection);
    stickyObserver.observe(bookingSection);
    
    /* ============================
       GOAL SELECTOR
       ============================ */
    document.querySelectorAll('#goalSelector .goal-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#goalSelector .goal-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
    
    document.querySelectorAll('#curriculum .goal-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#curriculum .goal-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
    
    /* ============================
       BOOKING FORM
       ============================ */
    const bookingForm = document.getElementById('bookingForm');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMsg = document.getElementById('toastMsg');
    
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      toastTitle.textContent = 'Trial request received';
      toastMsg.textContent = 'A coach will reach out within 24 hours to confirm your session.';
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 4500);
      bookingForm.reset();
      // Reset active states
      document.querySelectorAll('#goalSelector .goal-pill').forEach((p, i) => p.classList.toggle('active', i === 0));
    });
    
    /* ============================
       STORIES CAROUSEL
       With drag, swipe, rubber-band
       ============================ */
    class StoriesCarousel {
      constructor(track, opts = {}) {
        this.track = track;
        this.cards = Array.from(track.children);
        this.currentIndex = 0;
        this.isDown = false;
        this.startX = 0;
        this.startOffset = 0;
        this.currentX = 0;
        this.velocity = 0;
        this.lastX = 0;
        this.lastTime = 0;
        this.cardWidth = 0;
        this.maxScroll = 0;
        this.autoAdvance = opts.autoAdvance !== false;
        this.autoAdvanceInterval = opts.interval || 5000;
        this.autoTimer = null;
        this.pauseAuto = false;
        
        this.init();
      }
      
      init() {
        this.calculateDimensions();
        this.bindEvents();
        this.buildDots();
        this.startAuto();
        
        window.addEventListener('resize', () => {
          this.calculateDimensions();
          this.clamp();
          this.applyTransform(0);
        });
      }
      
      calculateDimensions() {
        if (this.cards.length === 0) return;
        const trackStyle = window.getComputedStyle(this.track);
        const gap = parseFloat(trackStyle.gap) || 24;
        const paddingLeft = parseFloat(trackStyle.paddingLeft) || 32;
        this.cardWidth = this.cards[0].offsetWidth + gap;
        const containerWidth = this.track.parentElement.offsetWidth;
        const totalWidth = (this.cards.length * this.cardWidth) - gap + paddingLeft * 2;
        this.maxScroll = Math.max(0, totalWidth - containerWidth);
      }
      
      bindEvents() {
        const down = (e) => this.handleDown(e);
        const move = (e) => this.handleMove(e);
        const up = () => this.handleUp();
        
        this.track.addEventListener('mousedown', down);
        this.track.addEventListener('touchstart', down, { passive: true });
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('mouseup', up);
        window.addEventListener('touchend', up);
        window.addEventListener('touchcancel', up);
        
        // Pause auto on hover
        this.track.addEventListener('mouseenter', () => this.pauseAuto = true);
        this.track.addEventListener('mouseleave', () => this.pauseAuto = false);
        
        // Prev/Next buttons
        const prev = document.getElementById('storyPrev');
        const next = document.getElementById('storyNext');
        if (prev) prev.addEventListener('click', () => this.goTo(this.currentIndex - 1));
        if (next) next.addEventListener('click', () => this.goTo(this.currentIndex + 1));
      }
      
      handleDown(e) {
        this.isDown = true;
        this.track.classList.add('dragging');
        const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        this.startX = x;
        this.startOffset = this.currentX;
        this.lastX = x;
        this.lastTime = Date.now();
        this.velocity = 0;
        this.stopAuto();
      }
      
      handleMove(e) {
        if (!this.isDown) return;
        if (e.cancelable) e.preventDefault();
        const x = e.type.includes('touch') ? e.touches[0].pageX : e.pageX;
        const delta = x - this.startX;
        let newX = this.startOffset + delta;
        
        // Rubber band at edges
        if (newX > 0) {
          newX = newX * 0.35;
        } else if (newX < -this.maxScroll) {
          const over = newX + this.maxScroll;
          newX = -this.maxScroll + over * 0.35;
        }
        
        // Track velocity
        const now = Date.now();
        const dt = now - this.lastTime;
        if (dt > 0) {
          this.velocity = (x - this.lastX) / dt;
        }
        this.lastX = x;
        this.lastTime = now;
        
        this.currentX = newX;
        this.applyTransform(0);
      }
      
      handleUp() {
        if (!this.isDown) return;
        this.isDown = false;
        this.track.classList.remove('dragging');
        
        // Apply momentum
        let target = this.currentX + this.velocity * 300;
        
        // Snap to nearest card
        const snapIndex = Math.round(Math.abs(target) / this.cardWidth);
        const clampedIndex = Math.max(0, Math.min(this.cards.length - 1, snapIndex));
        let snappedX = -clampedIndex * this.cardWidth;
        
        // Clamp
        if (snappedX > 0) snappedX = 0;
        if (snappedX < -this.maxScroll) snappedX = -this.maxScroll;
        
        this.currentX = snappedX;
        this.currentIndex = clampedIndex;
        this.applyTransform(700);
        this.updateDots();
        
        // Resume auto after delay
        setTimeout(() => this.startAuto(), 1500);
      }
      
      goTo(idx) {
        this.currentIndex = Math.max(0, Math.min(this.cards.length - 1, idx));
        let target = -this.currentIndex * this.cardWidth;
        if (target > 0) target = 0;
        if (target < -this.maxScroll) target = -this.maxScroll;
        this.currentX = target;
        this.applyTransform(700);
        this.updateDots();
        this.stopAuto();
        setTimeout(() => this.startAuto(), 2000);
      }
      
      clamp() {
        if (this.currentX > 0) this.currentX = 0;
        if (this.currentX < -this.maxScroll) this.currentX = -this.maxScroll;
      }
      
      applyTransform(duration = 0) {
        if (duration > 0) {
          this.track.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        } else {
          this.track.style.transition = 'none';
        }
        this.track.style.transform = `translateX(${this.currentX}px)`;
      }
      
      buildDots() {
        const dotsContainer = document.getElementById('storyDots');
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        this.cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'story-dot transition-all';
          dot.style.cssText = i === 0 
            ? 'width:32px;height:2px;background:var(--accent);'
            : 'width:8px;height:2px;background:var(--border-light);';
          dot.addEventListener('click', () => this.goTo(i));
          dotsContainer.appendChild(dot);
        });
      }
      
      updateDots() {
        const dots = document.querySelectorAll('#storyDots button');
        dots.forEach((dot, i) => {
          dot.style.cssText = i === this.currentIndex 
            ? 'width:32px;height:2px;background:var(--accent);transition:all 0.4s;'
            : 'width:8px;height:2px;background:var(--border-light);transition:all 0.4s;';
        });
      }
      
      startAuto() {
        if (!this.autoAdvance) return;
        this.stopAuto();
        this.autoTimer = setInterval(() => {
          if (this.pauseAuto || this.isDown) return;
          let next = this.currentIndex + 1;
          if (next >= this.cards.length) next = 0;
          this.goTo(next);
        }, this.autoAdvanceInterval);
      }
      
      stopAuto() {
        if (this.autoTimer) {
          clearInterval(this.autoTimer);
          this.autoTimer = null;
        }
      }
    }
    
    new StoriesCarousel(document.getElementById('storyTrack'), { interval: 4500 });
    
    /* ============================
       GRAIN PARALLAX
       ============================ */
    const grain = document.getElementById('grain');
    let targetGrainY = 0;
    let currentGrainY = 0;
    
    window.addEventListener('scroll', () => {
      targetGrainY = window.scrollY * 0.15;
    }, { passive: true });
    
    function animateGrain() {
      currentGrainY += (targetGrainY - currentGrainY) * 0.08;
      grain.style.transform = `translateY(${currentGrainY}px)`;
      requestAnimationFrame(animateGrain);
    }
    animateGrain();
    
    /* ============================
       SUBTLE PARALLAX ON HERO IMAGES
       ============================ */
    const heroSectionEl = document.getElementById('hero');
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const reelContainer = document.getElementById('reelContainer');
        if (reelContainer) {
          reelContainer.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
      }
    }, { passive: true });
  </script>
</body>
</html>
```

The site delivers on the brief through several deliberate choices:

**Visual identity** — A pure black canvas with neon orange (#FF5400) accents and metallic silver text creates the hardcore, high-end fitness aesthetic. Bebas Neue display type at massive sizes (up to 14vw) gives the hero its raw power, while Oswald and JetBrains Mono handle structural and technical copy.

**Cinematic hero reel** — Five high-contrast B&W frames cycle every 5 seconds with a slow Ken Burns zoom, simulating slow-motion training footage. A muted-by-default sound bar pulses; clicking toggles an "unmuted" state with animated equalizer bars. A live progress bar and chapter counter reinforce the video-player feel.

**Interaction density** — Section reveals use staggered fade + upward translate via IntersectionObserver. Coach cards perform a 3D Y-axis flip on hover revealing certifications, signature workouts, and credentials. The primary CTA continuously pulses with a radial glow ring. A sticky bottom bar slides up once the hero leaves viewport and snaps away when the booking section is reached.

**Custom carousel** — Built from scratch with mouse-drag, touch-swipe, momentum tracking, and rubber-band edge easing (drag past the end and the track resists at 0.35x, snapping back on release). Auto-advances every 4.5s, pauses on hover, with prev/next buttons and animated progress dots.

**Atmosphere details** — An SVG fractal-noise grain overlay drifts vertically with scroll using lerp smoothing. The hero background parallaxes downward at 0.3x scroll speed. A horizontal marquee ticker of brand aphorisms runs along the hero bottom. Every image receives uniform grayscale + contrast + brightness treatment for cohesive noir tone.

**Booking flow** — A full intake form with name/phone/email, pill-based goal selector, and radio-card time slots, framed by corner-bracket graphics. Submission triggers a slide-in toast confirmation rather than an alert.

