# SmartHelp AI Presentation Builder Prompt

## Role

You are an expert presentation designer, UI engineer, 3D web developer, and
academic storytelling consultant. Build a polished presentation for the
SmartHelp AI project described below.

The presentation is for a DU AI academic project presentation. It must feel
professional, memorable, technically credible, and visually impressive. Avoid
generic AI visuals, excessive text, purple gradients, stock-photo layouts, and
unexplained technical jargon.

## Project

SmartHelp AI is an offline AI-powered IT Help Desk and Maintenance Management
System. A user describes a technical problem in Arabic, English, or mixed
language. The system classifies the problem, searches approved internal
knowledge, recommends a solution, and escalates unresolved problems to a human
technician. The system is designed for secure internal or military/enterprise
intranet environments where data must remain offline.

Current implemented MVP:

- React 19 + TypeScript + Vite frontend.
- ASP.NET Core 10 Web API backend.
- SQL Server database with Entity Framework Core.
- Python FastAPI AI service.
- Arabic and English interface with RTL support.
- JWT authentication and role-based authorization.
- User, Technician, and Admin roles.
- Ticket creation, assignment, status changes, comments, and deletion.
- Approved knowledge base with 40 articles.
- AI classification endpoint.
- Semantic retrieval endpoint returning the top 3 knowledge articles.
- Escalation when retrieval confidence is low.
- Assignment-gated ticket visibility.
- Internal technician comments hidden from normal users.

Measured AI results on the difficult held-out evaluation set:

- Classification accuracy: 66.2%.
- Top-1 retrieval accuracy: 47.5%.
- Top-3 retrieval accuracy: 70.0%.

Be honest about these results. Present them as measured baseline results and
explain that the evaluation set contains vague, misleading, and paraphrased
incidents. Do not invent improved percentages.

## Main Story

Tell this story clearly:

```text
Repeated technical problem
        ->
User describes the problem naturally
        ->
AI classifies and searches approved knowledge
        ->
Known problem is solved through self-service
        ->
Uncertain problem is escalated to a human technician
        ->
Admin assignment and technician resolution
        ->
The confirmed solution improves organizational knowledge
```

The central message is:

> AI does not replace the technician. It removes repetitive work, retrieves
> organizational knowledge, assists decisions, and escalates uncertain cases
> to a human expert.

## Required Deliverable

Create a complete interactive presentation in Replit.

Preferred implementation:

- React + TypeScript.
- Three.js or React Three Fiber for the 3D visual scene.
- Framer Motion or GSAP for transitions.
- Lucide icons for interface controls.
- A clean, accessible presentation layout.
- Keyboard navigation with Arrow Left, Arrow Right, Home, and End.
- Visible slide counter and progress indicator.
- Presenter mode or speaker notes if practical.
- Responsive behavior for projector, laptop, and mobile preview.
- No external AI API is required for the presentation itself.

Add controls for:

- Previous slide.
- Next slide.
- Fullscreen.
- Mute/unmute animation sound if sound is included.
- Restart presentation.
- Optional language switch between English and Arabic for the main visible
  text.

The final Replit project should run with one command and include a README with
the run command and deployment instructions.

## Visual Direction

Use a distinctive visual language inspired by a secure operations command
center, but keep it elegant and academic rather than militaristic.

Palette:

- Deep graphite or charcoal background.
- Warm white text.
- Electric cyan for data flow and AI activity.
- Amber for warnings and escalation.
- Fresh green for successful resolution.
- Restrained red only for errors or security warnings.

Use strong typography with a purposeful display font and a highly readable
body font. Do not use oversized paragraphs. Each slide should communicate one
idea at a time.

Use subtle grid lines, data traces, node connections, and system diagrams.
Do not use decorative glowing blobs, random floating spheres, or generic robot
illustrations.

## 3D Hero Animation

The opening slide must contain a meaningful 3D animated system visualization.

Create a central 3D network representing SmartHelp AI:

- A glowing central AI service node.
- Three connected service nodes: Frontend, Backend, and Knowledge Base.
- Small moving data packets traveling along the connections.
- A user problem entering the system on one side.
- A resolved answer and human technician path leaving on the other side.
- Slow ambient movement, gentle camera motion, and a clear focal point.

The animation must support the story and must not overpower the title. It must
remain readable and performant. Provide a reduced-motion fallback and a static
fallback if WebGL is unavailable.

## Slide Structure

Create 12 to 14 slides with the following content.

### Slide 1: Title

Title: `SmartHelp AI`

Subtitle: `Offline Intelligent IT Help Desk and Maintenance Management System`

Show the 3D system network. Include:

- DU AI Project Presentation.
- Team name placeholder.
- Academic year: 2026–2027.

### Slide 2: The Real Problem

Show the current support journey:

- Users repeat the same problems.
- Previous solutions are difficult to find.
- Technicians spend time on repetitive diagnosis.
- Users may visit the workshop without knowing availability.
- Cloud AI is unsuitable for sensitive internal information.

Use a short visual journey, not a wall of text.

### Slide 3: Our Solution

Show the improved journey:

```text
Describe -> Understand -> Retrieve -> Solve or Escalate
```

Emphasize offline operation, approved knowledge, and human oversight.

### Slide 4: End-to-End User Workflow

Animate one problem through the system:

1. User enters a problem in Arabic or English.
2. AI predicts a category.
3. Semantic search returns the top three articles.
4. The user follows an approved solution.
5. Low-confidence cases become tickets.
6. A technician resolves the issue.

### Slide 5: System Architecture

Show an animated architecture diagram:

```text
React Frontend
      |
      +--> ASP.NET Core Business API --> SQL Server
      |
      +--> Python AI Service --> Embeddings / FAISS / Classifier
                                      |
                              Approved Knowledge Base
```

Explain that the AI service is separate so the model can be replaced without
rewriting the business application.

### Slide 6: Roles and Security

Show three role paths:

- User: report and follow a problem.
- Technician: resolve assigned tickets and add technical comments.
- Admin: manage users, assign tickets, and govern access.

Show the separation of duties and assignment-gated visibility. Mention JWT,
server-side authorization, and hidden internal comments.

### Slide 7: AI Pipeline

Visualize:

```text
Problem Text
   -> Multilingual Embedding
   -> Classification
   -> Semantic Retrieval
   -> Confidence Decision
   -> Solution or Escalation
```

Explain classification, embeddings, semantic search, and confidence in simple
language.

### Slide 8: Knowledge Grounding

Show an approved knowledge article becoming useful evidence. Explain:

- AI searches approved internal material.
- The system does not treat every generated answer as trusted.
- Low confidence leads to escalation.
- Future RAG answers will cite supporting articles.

### Slide 9: Demonstrated MVP

Present the implemented features as a dashboard or animated checklist:

- Login and registration.
- Assistant analysis.
- Knowledge Base search.
- Ticket escalation.
- Admin reassignment.
- Technician status update.
- Public and internal comments.
- Arabic/English RTL interface.

Use screenshots from the actual application if available. Do not fabricate
screenshots. If screenshots are unavailable, use clean interface mockups
labeled `Conceptual UI`.

### Slide 10: Evaluation Results

Show the real metrics with honest labels:

| Metric | Result |
|---|---:|
| Classification accuracy | 66.2% |
| Top-1 retrieval accuracy | 47.5% |
| Top-3 retrieval accuracy | 70.0% |

Explain that the held-out evaluation set contains difficult vague,
misleading, and paraphrased incidents. Include a small note:

`These are baseline results, not invented production claims.`

### Slide 11: Testing and Security Evidence

Show the verified test lifecycle:

```text
User creates ticket
-> Unassigned technician cannot access it
-> Admin assigns it
-> Assigned technician can resolve it
-> Reporter sees public comments only
-> Admin can delete it
```

Mention API authorization tests, end-to-end browser tests, RTL checks, and
mobile/tablet/desktop overflow checks.

### Slide 12: Roadmap

Show the 12 phases as a timeline, highlighting the current MVP position:

- Current: Core Help Desk, initial Knowledge Base, classification, semantic
  retrieval, authentication, and end-to-end testing.
- Next: improve AI evaluation and add Knowledge Base approval workflow.
- Future: workshop, inventory, appointments, RAG, offline chatbot, smart
  triage, and full evaluation.

Make the distinction between `implemented now` and `future roadmap` visually
obvious.

### Slide 13: Responsible AI

Present these principles:

- Offline and on-premise operation.
- Approved knowledge only.
- Human-in-the-loop decisions.
- Confidence thresholds and escalation.
- No autonomous risky commands.
- Model and interaction logging.
- Traditional Help Desk fallback when AI is unavailable.

### Slide 14: Closing

Title: `From Repeated Problems to Organizational Intelligence`

Closing statement:

> SmartHelp AI turns recurring technical problems into searchable,
> measurable, and reusable organizational knowledge while keeping people in
> control.

End with a clean system-network animation and placeholders for questions,
team members, supervisor, and contact information.

## Animation Rules

- Use animation to reveal relationships and workflow, not as decoration.
- Keep transitions smooth and short.
- Use staggered reveals for architecture nodes and metrics.
- Animate data packets only where they explain data flow.
- Use amber to show escalation and green to show resolution.
- Pause or simplify animations when the user changes slides.
- Respect `prefers-reduced-motion`.
- Never make text move so much that it becomes difficult to read.

## Speaker Notes

Add concise speaker notes for every slide. Each note should explain:

- What the presenter should say.
- Why the slide matters.
- One technical detail that may be mentioned if asked.

Keep each note under 100 words.

## Quality Requirements

Before finishing, verify:

- Every slide has one clear message.
- No text is clipped or overlapping.
- The presentation works at 1280x720 and 1920x1080.
- Keyboard navigation works.
- Fullscreen works.
- WebGL failure does not create a blank screen.
- Reduced-motion mode works.
- The 3D scene is not blank.
- All metrics match the values in this prompt.
- The presentation clearly separates implemented features from future work.
- There are no unsupported claims that the chatbot, workshop, inventory, or
  appointments are already implemented.

## Final Output

Provide:

1. A working Replit presentation application.
2. A README with setup and run instructions.
3. Speaker notes for all slides.
4. A presentation mode suitable for a live academic demonstration.
5. A downloadable PDF or PPTX export if technically practical. If a native
   PPTX export is not reliable, provide a polished browser presentation and a
   print-to-PDF layout instead.