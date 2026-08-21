# SmartHelp AI
### AI-Powered Smart IT Help Desk & Maintenance Management System

**Full Project Analysis · Offline Architecture · 12-Month Implementation Roadmap**

> **Project Context** — A secure, offline-first AI solution designed for an internal military/enterprise intranet environment. All operational AI, databases, knowledge, and packages remain inside the organization.

| | |
|---|---|
| **Prepared for** | DU AI Project Presentation |
| **Prepared by** | ______________________ |
| **Academic Year** | 2026–2027 |

---

## Table of Contents

1. [Problem Analysis and Project Vision](#1-problem-analysis-and-project-vision)
2. [Users, Roles and Functional Modules](#2-users-roles-and-functional-modules)
3. [Final System Architecture](#3-final-system-architecture)
4. [Detailed 12-Phase Implementation Roadmap](#4-detailed-12-phase-implementation-roadmap)
5. [AI Design Explained Simply](#5-ai-design-explained-simply)
6. [Offline Deployment and Hardware Strategy](#6-offline-deployment-and-hardware-strategy)
7. [Security, Governance and Human Oversight](#7-security-governance-and-human-oversight)
8. [Data Strategy and Knowledge Feedback Loop](#8-data-strategy-and-knowledge-feedback-loop)
9. [Evaluation Plan and Success Metrics](#9-evaluation-plan-and-success-metrics)
10. [Academic Framing for DU AI](#10-academic-framing-for-du-ai)
11. [How to Present the Project to the DU AI Doctors](#11-how-to-present-the-project-to-the-du-ai-doctors)
12. [Final Project Summary](#12-final-project-summary)
13. [Appendix A — Phase Completion Checklist](#appendix-a--phase-completion-checklist)

---

## Executive Summary

SmartHelp AI is an offline AI-powered IT support, maintenance, inventory, and appointment management platform designed to operate completely inside an internal network. The project starts as a normal Help Desk system and progressively adds AI capabilities only where they provide measurable value.

The main operational problem is that users frequently contact or physically visit technical support for recurring software and hardware issues. Many cases have already been solved before, but previous knowledge is difficult to retrieve, users may arrive when no technician or spare part is available, and technicians spend time repeating the same diagnostic steps.

> **Core Idea** — The system first tries to solve the problem using approved internal knowledge. If that fails, an offline AI assistant performs guided troubleshooting. If the issue still requires human intervention, the case is escalated to Help Desk or the workshop, where stock and appointment availability can be checked before the user travels.

### Project Objectives

- Reduce unnecessary physical visits to the Help Desk and maintenance workshop.
- Reuse previous incident solutions and technician knowledge through semantic search and RAG.
- Provide safe self-service troubleshooting using only approved internal knowledge.
- Classify and route incidents automatically to the correct support path.
- Assist hardware pre-diagnosis without replacing the final decision of a technician.
- Connect maintenance cases to spare-parts availability and appointment scheduling.
- Operate fully offline/on-premise for security and data-control requirements.
- Measure AI quality and business impact using objective evaluation metrics.

### The Project in One Sentence

> **Definition** — An offline intelligent Help Desk platform that understands technical problems, retrieves approved organizational knowledge, recommends solutions, escalates unresolved incidents, and coordinates maintenance resources without depending on the public Internet.

### Document at a Glance

| Section | What it explains |
|---|---|
| 1. Problem & Vision | Why the project is needed and what business problem it solves. |
| 2. Users & Modules | Who uses the system and the major functional areas. |
| 3. Final Architecture | How React, ASP.NET Core, SQL Server, Python AI, local models and vector search work together. |
| 4. 12-Phase Roadmap | What is built each month, including architecture, deliverables and testing. |
| 5. AI Design | Classification, embeddings, semantic search, RAG, chatbot and smart triage. |
| 6. Security & Governance | Offline operation, approved knowledge, package controls and human oversight. |
| 7. Evaluation | Technical AI metrics and operational KPIs. |
| 8. Presentation Guide | Simple explanation and likely questions from DU AI doctors. |

### Three Major Stages

| Stage | Months | Main Goal | Output |
|---|---|---|---|
| **Stage 1 — Build the IT Platform** | 1–6 | Digitize the support workflow | Help Desk + Workshop + Inventory + Appointments + Knowledge Base |
| **Stage 2 — Add AI Intelligence** | 7–9 | Understand and retrieve knowledge | Classification + Embeddings + Similar Tickets + RAG |
| **Stage 3 — Intelligent Assistant** | 10–12 | Conversational support and intelligent routing | Offline Chatbot + Smart Triage + Full Evaluation |

---

## 1. Problem Analysis and Project Vision

### 1.1 Current Operational Problems

The current support process contains several recurring inefficiencies. Some users visit technicians for problems that could have been solved remotely, while hardware users may arrive when the workshop is busy or when the required spare part is unavailable. At the same time, valuable technical knowledge is distributed across technicians, old tickets and documents rather than being available as one intelligent, searchable knowledge source.

- Repetitive software incidents consume technician time.
- Users do not always know whether a problem is software, hardware, network or authentication related.
- Previously solved cases are difficult to find when the wording is different.
- Packages or dependencies may be missing and users may not know which approved package is required.
- Hardware cases may arrive without a planned workshop slot.
- Spare-part availability may be discovered only after the device reaches the workshop.
- Technician knowledge may be lost or remain isolated when not documented consistently.
- A cloud chatbot is unsuitable when sensitive internal information must remain on-premise.

### 1.2 Proposed Operating Model

The system deliberately uses multiple levels of support. Simple and known cases should be solved by deterministic rules or approved knowledge retrieval. AI is introduced only when natural-language understanding, semantic similarity, conversational troubleshooting or probabilistic triage is useful. Human technicians remain responsible for critical diagnosis and repair decisions.

### 1.3 Key Design Principles

| Principle | Meaning in This Project |
|---|---|
| **Offline First** | Production operation does not depend on public Internet or cloud AI APIs. |
| **Human-in-the-Loop** | AI recommends and prioritizes; technicians approve critical actions. |
| **Knowledge Grounding** | Chatbot answers should be based on approved internal content through RAG. |
| **AI Where Needed** | CRUD, permissions, stock and booking remain deterministic software. |
| **Replaceable AI Models** | The application calls an AI service, not a hard-coded model. |
| **Progressive Delivery** | Every monthly phase produces a testable result before the next phase begins. |

---

## 2. Users, Roles and Functional Modules

### 2.1 User Roles

| Role | Responsibilities |
|---|---|
| **Normal User** | Report problems, use self-service knowledge, chat with AI, follow ticket status, download approved packages, request maintenance appointments. |
| **Help Desk Technician** | Review incidents, inspect AI recommendations, resolve software cases, communicate with users, escalate hardware incidents, propose knowledge articles. |
| **Workshop Technician** | Perform physical diagnosis and repair, view device history, record actual causes and parts used, update repair status. |
| **Inventory Operator** | Manage spare parts and approved software package metadata, stock movements and availability. |
| **System Administrator** | Manage users, roles, permissions, system configuration, AI settings, audit logs and knowledge approval. |

### 2.2 Main Functional Modules

| Module | Purpose |
|---|---|
| Authentication & Authorization | Control who can access each system function. |
| Ticket Management | Create, assign, track, resolve and close incidents. |
| Workshop Management | Manage hardware inspection, repair and device history. |
| Inventory | Track spare parts and approved packages. |
| Appointments | Reserve workshop time based on availability. |
| Knowledge Base | Store approved problems, causes, solutions and procedures. |
| AI Classification | Understand and categorize free-text incidents. |
| Semantic Search | Retrieve meaningfully similar previous incidents. |
| RAG Assistant | Generate answers grounded in approved internal knowledge. |
| Offline Chatbot | Provide conversational troubleshooting without Internet. |
| Smart Triage | Recommend routing, next action and possible hardware causes. |
| Reporting & Audit | Measure service quality, AI quality and security-relevant actions. |

---

## 3. Final System Architecture

### 3.1 Architecture Responsibilities

| Layer | Technology / Component | Responsibility |
|---|---|---|
| Presentation | React + TypeScript | Web interface for users, Help Desk, workshop and administration. |
| Business API | ASP.NET Core Web API | Business rules, authentication, authorization, tickets, stock, appointments and integration. |
| Relational Data | SQL Server | Structured business data: users, tickets, inventory, repairs, schedules and audit history. |
| AI API | Python Service | Classification, embeddings, semantic search, RAG, chatbot and triage functions. |
| Embedding Model | Small local NLP model | Convert problems and knowledge into semantic vectors. |
| Vector Search | Local vector database / index | Find similar problems and relevant knowledge by meaning. |
| Local LLM | Quantized local language model | Generate explanations and hold troubleshooting conversations. |
| Knowledge Repository | Approved internal articles and metadata | Provide trusted context for self-service and RAG responses. |

### 3.2 Why the AI Service Is Separate

The ASP.NET Core application should not be tightly coupled to a specific AI model. Instead, it calls a Python AI service through clearly defined endpoints. This separation allows the team to replace a lightweight CPU model with a stronger GPU-hosted model later without redesigning the frontend, the business API, or the database.

> **Recommended API Boundary** — Examples: `POST /ai/classify`, `POST /ai/search`, `POST /ai/chat`, `POST /ai/triage`. The internal model behind these endpoints can change over time.

---

## 4. Detailed 12-Phase Implementation Roadmap

The project is intentionally divided into twelve monthly phases. The first half creates a reliable IT service platform and quality data. The second half introduces AI in increasing levels of complexity. This avoids the common mistake of starting with a chatbot before the business workflow and data are ready.

| Phase | Month | Main Outcome | AI Level |
|---|---|---|---|
| 1. Requirements & Design | 1 | Requirements, workflows, ERD, security baseline | None |
| 2. Core Help Desk | 2 | Working ticket lifecycle | None |
| 3. Workshop | 3 | Hardware repair workflow + device history | None |
| 4. Inventory & Packages | 4 | Spare parts + approved software repository | None |
| 5. Appointments | 5 | Workshop scheduling connected to availability | Rule-Based |
| 6. Knowledge Base | 6 | Approved technical knowledge foundation | AI Foundation |
| 7. Ticket Classification | 7 | Automatic category/subcategory prediction | ML / NLP |
| 8. Semantic Search | 8 | Similar ticket and knowledge retrieval | Embeddings |
| 9. RAG | 9 | Grounded AI answers | Generative AI |
| 10. Offline Chatbot | 10 | Conversational troubleshooting | Local LLM |
| 11. Smart Triage | 11 | Routing + pre-diagnosis + resource-aware recommendations | Advanced AI |
| 12. Integration & Evaluation | 12 | End-to-end tested system + measurable results | Complete |

> **Monthly Rule** — Every phase finishes with **Build → Test → Evaluate → Improve**. The next phase begins only after the previous core workflow is stable.

---

### PHASE 1 — Requirements Analysis & System Design
**Month 1 · Core Platform**

**Objective:** Understand the real support workflow before building software or AI.

**Phase Architecture:** `Requirements → Business Rules → Database Design → System Architecture`

**What We Build**
- Identify user roles and permissions.
- Document ticket lifecycle from report to closure.
- Define software, hardware, network and authentication categories.
- Document workshop and inventory processes.
- Define security and offline requirements.
- Design initial database ERD and integration boundaries.

**AI Role:** No AI is required. This phase ensures later AI solves the correct operational problem.

**Deliverables:** Requirements document · Use-case diagrams / scenarios · Ticket lifecycle · Initial ERD · Security requirements · Phase backlog

**Testing & Validation**
- Walk through at least 10 representative incidents end-to-end.
- Confirm every case has an owner, status and closure condition.
- Review requirements with Help Desk/workshop stakeholders.

> **Gate to Next Phase** — The team can explain exactly what happens from the moment a problem is reported until the incident is closed.

---

### PHASE 2 — Core Help Desk Ticket System
**Month 2 · Core Platform**

**Objective:** Build the minimum usable support application and begin collecting structured data.

**Phase Architecture:** `React → ASP.NET Core → SQL Server`

**What We Build**
- Implement login and role-based access.
- Create, view, assign and update tickets.
- Add comments and technician notes.
- Implement ticket statuses and history.
- Add basic filtering and search.
- Store fields that will later become AI training/evaluation data.

**AI Role:** No AI yet. The priority is reliable data and a stable ticket lifecycle.

**Deliverables:** Working Help Desk web application · User/role management · Ticket CRUD and status history · Initial reporting · Seed test data

**Testing & Validation**
- Create representative software and hardware tickets.
- Test assignment, status transitions and closure.
- Verify authorization prevents unauthorized access.

> **Gate to Next Phase** — User → Ticket → Technician → Resolution → Closed works without manual database intervention.

---

### PHASE 3 — Workshop & Hardware Maintenance
**Month 3 · Core Platform**

**Objective:** Support physical hardware incidents and preserve device repair history.

**Phase Architecture:** `Help Desk Ticket → Workshop Queue → Inspection → Repair → Closure`

**What We Build**
- Escalate hardware tickets to workshop.
- Register devices and identifiers.
- Store reported problem, initial diagnosis and actual diagnosis.
- Record technician, repair times and parts used.
- Display historical repairs for the same device.

**AI Role:** AI is still optional. The historical repair data created here will later support hardware pre-diagnosis.

**Deliverables:** Workshop queue · Repair records · Device history · Escalation workflow · Repair status tracking

**Testing & Validation**
- Test RAM, SSD, power and unknown hardware scenarios.
- Verify ticket ownership changes correctly.
- Verify final diagnosis and repair result are stored.

> **Gate to Next Phase** — A hardware case can move from Help Desk to workshop and return with a documented final diagnosis and repair outcome.

---

### PHASE 4 — Inventory & Approved Software Packages
**Month 4 · Core Platform**

**Objective:** Connect incidents with the resources required to solve them.

**Phase Architecture:** `Inventory → Hardware Parts / Approved Packages → Help Desk & Workshop`

**What We Build**
- Track RAM, SSD, HDD, power supplies and other spare parts.
- Record stock-in, stock-out and part usage.
- Create an approved software package catalog.
- Store package version, file name, approval status and cryptographic hash.
- Link parts/packages to repairs and knowledge articles.

**AI Role:** AI may later recommend a Package ID or part, but it must never invent or directly fetch unapproved software.

**Deliverables:** Inventory module · Stock transactions · Approved package repository metadata · Part-to-repair linkage · Package approval workflow

**Testing & Validation**
- Test stock increase/decrease.
- Prevent negative stock where appropriate.
- Verify repair records consume the correct item.
- Verify only approved packages are exposed to end users.

> **Gate to Next Phase** — Technicians can know whether the required part/package is available before committing to a repair action.

---

### PHASE 5 — Appointment & Workshop Scheduling
**Month 5 · Rule-Based**

**Objective:** Reduce wasted visits and waiting time by coordinating technician, workshop and part availability.

**Phase Architecture:** `Hardware Ticket → Required Repair → Technician + Part + Slot Check → Appointment`

**What We Build**
- Create technician calendars / availability.
- Define repair duration estimates by case type.
- Prevent double booking.
- Allow cancellation and rescheduling.
- Check relevant spare-part availability before proposing a slot.
- Record appointment outcome and no-show status.

**AI Role:** Use deterministic scheduling first. AI optimization can be added later after real duration data exists.

**Deliverables:** Appointment module · Technician availability · Rule-based slot engine · Stock-aware booking check · Appointment history

**Testing & Validation**
- Try overlapping appointments.
- Test unavailable part scenarios.
- Test cancellation/rescheduling.
- Compare planned versus actual repair duration.

> **Gate to Next Phase** — The system offers only valid slots and prevents obvious conflicts or appointments that cannot be served.

---

### PHASE 6 — Approved Knowledge Base
**Month 6 · AI Foundation**

**Objective:** Create the trusted organizational memory that will power search, RAG and the chatbot.

**Phase Architecture:** `Solved Ticket → Proposed Article → Technical Review → Approved Knowledge Base`

**What We Build**
- Define knowledge article structure: problem, error, cause, solution, category, package, escalation.
- Allow technicians to propose articles.
- Require technical review/approval before publishing.
- Link articles to solved tickets and packages.
- Add tags, versions and review dates.
- Populate an initial representative knowledge set.

**AI Role:** This is the critical AI foundation. High-quality knowledge is more important than a large model.

**Deliverables:** Knowledge Base UI · Approval workflow · Initial 50–100 representative articles · Article versioning · Links to tickets/packages

**Testing & Validation**
- Search articles manually.
- Verify unapproved articles are not shown as official solutions.
- Review duplicates and conflicting procedures.

> **Gate to Next Phase** — The organization has a trusted, curated set of solutions that can safely be retrieved by later AI modules.

---

### PHASE 7 — AI Ticket Classification
**Month 7 · Machine Learning / NLP**

**Objective:** Automatically understand a free-text incident and predict its category, subcategory and destination.

**Phase Architecture:** `Problem Text → Preprocessing → Classification Model → Category / Confidence → Ticket`

**What We Build**
- Prepare labeled historical/sample tickets.
- Clean and normalize text.
- Build a baseline classifier.
- Return predicted category/subcategory and confidence.
- Integrate prediction into ticket creation.
- Keep technician override and record corrections.

**AI Role:** A lightweight classifier or compact NLP model is enough. A large LLM is not required.

**Deliverables:** Training/evaluation dataset · Classification endpoint · Prediction display · Confidence score · Override logging

**Testing & Validation**
- Hold out a test set not used for training.
- Measure accuracy, precision, recall and F1.
- Inspect confusion matrix and common mistakes.

> **Gate to Next Phase** — The classifier reaches an acceptable measured accuracy and technicians can safely override incorrect predictions.

---

### PHASE 8 — Semantic Search & Similar Ticket Retrieval
**Month 8 · Embeddings**

**Objective:** Find previous incidents and knowledge by meaning rather than exact words.

**Phase Architecture:** `Resolved Tickets / Knowledge → Embeddings → Vector DB ← New Problem Embedding → Top Similar Results`

**What We Build**
- Choose a lightweight local embedding model.
- Convert approved knowledge and resolved tickets to vectors.
- Store vectors in a local vector index/database.
- Embed new user problems.
- Return Top-K similar cases with similarity scores.
- Display previous actual solutions to technicians.

**AI Role:** This provides real AI value even before the chatbot: technicians can instantly reuse previous solutions.

**Deliverables:** Embedding pipeline · Vector database/index · Similar-ticket endpoint · Top-K result UI · Re-indexing procedure

**Testing & Validation**
- Prepare known test queries with expected relevant cases.
- Measure Top-1 and Top-3 retrieval success.
- Test paraphrases with different wording.

> **Gate to Next Phase** — Relevant previous solutions consistently appear among the top retrieved results for representative problems.

---

### PHASE 9 — RAG (Retrieval-Augmented Generation)
**Month 9 · Generative AI**

**Objective:** Generate useful answers while grounding the model in approved internal knowledge.

**Phase Architecture:** `Question → Embedding → Vector Search → Relevant Context → Local LLM → Grounded Answer`

**What We Build**
- Retrieve relevant approved articles using semantic search.
- Build a prompt that includes only selected context.
- Run a small local LLM.
- Require answers to stay within available evidence.
- Return references to the supporting internal articles.
- Escalate when evidence or confidence is insufficient.

**AI Role:** RAG reduces the need for the model to rely on general memory and helps control hallucination.

**Deliverables:** RAG endpoint · Prompt template · Context retrieval rules · Source/reference display · Fallback/escalation behavior

**Testing & Validation**
- Create 50–100 representative questions.
- Score correctness and relevance.
- Measure unsupported/hallucinated statements.
- Compare RAG answers with a standalone local LLM baseline.

> **Gate to Next Phase** — The model answers primarily from approved internal evidence and refuses/escalates when supporting knowledge is missing.

---

### PHASE 10 — Offline AI Chatbot
**Month 10 · Local LLM**

**Objective:** Provide multi-turn troubleshooting after direct knowledge/self-service steps are insufficient.

**Phase Architecture:** `React Chat → ASP.NET API → Python AI Service → RAG → Local LLM`

**What We Build**
- Build chat interface.
- Maintain limited conversation context.
- Connect every answer to RAG retrieval.
- Ask diagnostic follow-up questions.
- Allow the user to mark whether a step worked.
- Escalate unresolved conversations to a human ticket with transcript/context.

**AI Role:** The chatbot is an escalation layer, not the first layer. This reduces latency, compute usage and uncontrolled answers.

**Deliverables:** Chat UI · Conversation session model · RAG-connected chatbot · Escalation-to-ticket action · Conversation logging

**Testing & Validation**
- Measure response time on development hardware.
- Test known problems, unknown problems and misleading wording.
- Verify the chatbot does not recommend unapproved packages or automatic risky commands.

> **Gate to Next Phase** — The chatbot can guide common troubleshooting conversations offline and safely escalate when it cannot resolve a case.

---

### PHASE 11 — Smart AI Triage & Hardware Pre-Diagnosis
**Month 11 · Advanced AI**

**Objective:** Combine classification, similarity, knowledge, resources and human oversight into an intelligent next-action recommendation.

**Phase Architecture:** `Classification + Similar Cases + RAG + Resource Checks → Recommended Route / Pre-Diagnosis`

**What We Build**
- Combine category prediction with similar cases.
- Estimate probable hardware causes with confidence values.
- Recommend remote self-service vs Help Desk vs workshop.
- Check relevant part availability.
- If physical intervention is required, connect to appointment availability.
- Show reasoning evidence to technicians without presenting probability as certainty.

**AI Role:** AI assists prioritization and diagnosis. The technician remains responsible for final hardware confirmation and repair.

**Deliverables:** Triage service · Routing recommendation · Pre-diagnosis display · Confidence/evidence panel · Stock/appointment integration

**Testing & Validation**
- Compare AI route with technician decisions.
- Measure false escalations and missed escalations.
- Review low-confidence cases.
- Test stock-aware appointment recommendations.

> **Gate to Next Phase** — The system makes useful next-step recommendations while preserving human approval for critical maintenance decisions.

---

### PHASE 12 — Full Integration, Security Testing & Evaluation
**Month 12 · Complete System**

**Objective:** Integrate all modules, validate security and measure whether the project actually improves support operations.

**Phase Architecture:** `Users → Web/API → SQL + AI Service → Knowledge / Model / Vector Search → Human Support`

**What We Build**
- Run end-to-end flows from self-service to workshop closure.
- Test failure of AI service while keeping core Help Desk available.
- Review authentication, authorization and audit logs.
- Benchmark local AI latency.
- Measure AI quality metrics.
- Compare operational KPIs before/after or baseline/controlled test.
- Prepare final demonstration and project report.

**AI Role:** This phase proves that AI is an enhancement rather than a single point of failure.

**Deliverables:** Integrated release · Test report · AI evaluation report · Security checklist · Performance benchmark · Final DU AI demonstration

**Testing & Validation**
- End-to-end acceptance testing.
- Role/permission testing.
- AI outage fallback test.
- RAG hallucination review.
- Load/latency benchmark.
- User acceptance test with realistic scenarios.

> **Gate to Next Phase** — The complete system operates offline, core workflows remain available without AI, and technical/business results are measurable.

---

## 5. AI Design Explained Simply

### 5.1 Where AI Is Used — and Where It Is Not

| Use Traditional Software | Use AI |
|---|---|
| Login, roles and permissions | Understand free-text incident descriptions |
| Ticket CRUD and status rules | Classify category and subcategory |
| Stock quantities and transactions | Find semantically similar incidents |
| Appointment conflict rules | Retrieve relevant knowledge from natural language |
| Package approval and hashes | Generate grounded explanations through RAG |
| Audit logging | Conversational troubleshooting and probabilistic triage |

This hybrid architecture improves reliability because deterministic rules remain deterministic. AI is reserved for interpretation, similarity, language generation and probabilistic recommendations.

### 5.2 AI Components

| Component | Simple Explanation | Project Use |
|---|---|---|
| NLP / Text Classification | Turns user text into predicted labels. | Ticket category, subcategory and routing. |
| Embeddings | Represent text meaning as numerical vectors. | Compare problems even when words are different. |
| Semantic Search | Retrieves content by meaning. | Find similar tickets and knowledge articles. |
| RAG | Retrieves trusted context before the LLM answers. | Ground chatbot answers in approved internal knowledge. |
| Local LLM | Language model running inside the network. | Explanations, follow-up questions and conversation. |
| Confidence / Triage | Expresses uncertainty and recommends next action. | Decide self-service, Help Desk or workshop path. |
| Future Forecasting | Learns patterns over time. | Optional spare-parts demand prediction later. |

### 5.3 Why We Do Not Train a Large Language Model From Scratch

Training a foundation model from scratch would require very large datasets, specialized GPUs, long training time and significant cost. It is not necessary for this project. The intelligent behavior comes from combining an existing local model with the organization's own knowledge, vector retrieval, workflow data and careful evaluation.

> **Recommended Strategy** — Existing local model + organization Knowledge Base + RAG + optional small task-specific fine-tuning later.

---

## 6. Offline Deployment and Hardware Strategy

### 6.1 Development on a Modest Laptop

The project is intentionally structured so that the first six months do not require a powerful GPU. The development machine can build the web platform, database, knowledge workflow and rule-based scheduling. Lightweight embeddings and small/quantized models can then be introduced gradually for proof-of-concept AI features.

| Project Stage | Typical Local Workload | Hardware Strategy |
|---|---|---|
| Months 1–6 | React, ASP.NET Core, SQL Server, Python utilities | Current development laptop is sufficient for normal development. |
| Months 7–9 | Classification, embeddings, vector search, small RAG tests | Use lightweight CPU-friendly models and small datasets. |
| Months 10–12 | Local chatbot, integrated RAG, triage benchmarks | Use small quantized models for development; benchmark limitations honestly. |
| Production | Multiple concurrent intranet users | Move the local LLM to a dedicated AI workstation/server with suitable RAM/GPU/NVMe. |

### 6.2 Production Scaling Principle

> **Important** — Users do not need powerful GPUs. One dedicated internal AI server can serve many web users through the AI service API.

Exact production hardware should be selected near deployment time based on the final model size, number of concurrent users, response-time target and available budget. The architecture deliberately makes this a server-side replacement rather than a full application redesign.

### 6.3 Offline Model and Dependency Transfer

- Download model files, Python wheels, NuGet packages and frontend dependencies through an approved staging process.
- Verify file hashes and versions before transfer into the internal environment.
- Maintain an internal repository/cache for approved dependencies where feasible.
- Keep model versions documented and reproducible.
- Do not allow the production AI service to silently download models from the Internet.

---

## 7. Security, Governance and Human Oversight

### 7.1 Offline Does Not Automatically Mean Secure

Running without Internet reduces exposure but does not replace normal security controls. The application still requires strong identity, access control, auditability, trusted package handling, backups and clear approval boundaries.

| Control | Project Requirement |
|---|---|
| Authentication | Only authorized internal users can access the system. |
| Role-Based Authorization | Normal users, technicians, workshop staff, inventory and administrators receive different permissions. |
| Audit Logging | Record important creates, updates, approvals, stock movements and AI-assisted decisions. |
| Knowledge Approval | Only reviewed content becomes official RAG knowledge. |
| Package Whitelisting | The AI recommends only approved Package IDs from the local repository. |
| Hash Verification | Approved packages should have stored cryptographic hashes for integrity checking. |
| Model Version Control | Record which model/version generated or assisted a result during testing and deployment. |
| No Autonomous Risky Execution | AI should not automatically execute arbitrary generated commands or scripts. |
| Fallback | If AI is unavailable, the traditional Help Desk workflow must continue. |
| Backups | Database, knowledge and configuration require an internal backup strategy. |

### 7.2 Human-in-the-Loop

| AI Can | Human Must |
|---|---|
| Suggest a category | Approve/override important classification when needed |
| Retrieve similar tickets | Judge whether a previous solution is applicable |
| Recommend a package ID | Control which packages are approved and distributed |
| Estimate a probable hardware cause | Perform the final physical diagnosis |
| Recommend escalation or appointment | Approve critical maintenance actions |
| Generate a troubleshooting explanation | Stop the process when the answer is unsafe or unsupported |

### 7.3 Hallucination Controls

- Use RAG with approved internal knowledge rather than unrestricted model memory.
- Display supporting internal article references where possible.
- Use confidence thresholds and escalation rules.
- Log AI interactions for evaluation and review.
- Do not expose unapproved technician notes as official procedures.
- Prefer "insufficient approved evidence — escalate" over invented instructions.

---

## 8. Data Strategy and Knowledge Feedback Loop

### 8.1 Important Ticket Fields

| Data Group | Example Fields | Why It Matters |
|---|---|---|
| User Context | User, department, device | Operational routing and reporting. |
| Problem | ProblemDescription, error message | Primary NLP input. |
| Classification | Category, subcategory, priority | Training labels and routing. |
| Resolution | RootCause, ActualSolution, ResolvedRemotely | Ground truth for later AI evaluation. |
| Maintenance | PartUsed, repair duration, diagnosis | Hardware history and future triage. |
| AI Metadata | Predicted label, confidence, suggested solution | Measure AI behavior and corrections. |
| Outcome | Accepted recommendation, resolution result | Understand whether AI created real value. |

### 8.2 Knowledge Feedback Loop

> **Learning Cycle** — New ticket → AI recommendation → technician decision → actual solution → reviewed knowledge → better future retrieval.

The project does not assume the model continuously retrains itself automatically. Instead, the operational data and technician outcomes create a controlled feedback loop. Knowledge is reviewed before becoming official, and model retraining/re-indexing is performed as a deliberate versioned process.

### 8.3 Example Knowledge Article

| Field | Example |
|---|---|
| Knowledge ID | KB-0015 |
| Problem | Application fails to start |
| Error | VCRUNTIME140.dll missing |
| Category | Software / Missing Runtime |
| Root Cause | Approved Visual C++ Runtime not installed |
| Solution | Install the approved runtime package according to procedure |
| Related Package | PKG-0041 |
| Approval | Approved |
| Escalation | Escalate if installation does not resolve the problem |

---

## 9. Evaluation Plan and Success Metrics

### 9.1 AI Metrics

| AI Function | Primary Metrics | Example Evaluation Question |
|---|---|---|
| Classification | Accuracy, Precision, Recall, F1 | Did the model predict the correct category/subcategory? |
| Semantic Search | Top-1, Top-3 / Top-K retrieval success | Did a useful previous solution appear in the top results? |
| RAG | Correctness, relevance, groundedness, hallucination rate | Is the answer supported by approved knowledge? |
| Chatbot | Useful answer rate, escalation accuracy, response time | Does the chat help without giving unsupported actions? |
| Triage | Routing accuracy, false escalation, missed escalation | Did the system recommend the correct next support path? |

### 9.2 Operational KPIs

| KPI | Why It Matters |
|---|---|
| Average Resolution Time | Shows whether incidents are resolved faster. |
| Remote / Self-Service Resolution Rate | Measures cases solved without physical visit. |
| First Contact Resolution | Measures effectiveness of the first support interaction. |
| Number of Unnecessary Physical Visits | Directly addresses a core project problem. |
| Workshop Waiting Time | Measures scheduling improvement. |
| Technician Workload | Shows whether repetitive tasks are reduced. |
| AI Recommendation Acceptance Rate | Shows whether technicians/users find recommendations useful. |
| Most Common Incidents / Parts | Supports planning and future inventory forecasting. |

### 9.3 Important Academic Rule

> **Do Not Invent Results** — Targets can be proposed, but final percentages must come from controlled tests or real pilot data. For example, do not claim "55% fewer visits" unless the project evaluation actually measures that result.

---

## 10. Academic Framing for DU AI

### 10.1 Main Research Question

> **Research Question** — Can an offline AI-assisted Help Desk system reduce unnecessary physical IT support visits and improve incident resolution while maintaining security, knowledge grounding and human oversight?

### 10.2 Secondary Questions

- Can NLP accurately classify internal IT incidents?
- Can semantic search retrieve useful solutions from previous incidents despite different wording?
- Does RAG reduce unsupported answers compared with a standalone local LLM?
- Can AI-assisted self-service reduce Help Desk workload?
- Can stock-aware appointment scheduling reduce wasted maintenance visits?
- Can an offline AI architecture provide acceptable performance on limited development hardware?

### 10.3 Hypothesis

Combining semantic search, retrieval-augmented generation, local language models and structured Help Desk workflows can reduce repetitive support effort and improve knowledge reuse while keeping sensitive operational data inside the internal environment.

### 10.4 Project Scope Boundaries

| Included in Core Project | Deferred / Future Work |
|---|---|
| Help Desk tickets | Automatic remote control of user computers |
| Workshop and hardware repair | Automatic execution of AI-generated commands |
| Inventory and approved packages | Training a foundation LLM from scratch |
| Appointments | Cloud-based production AI |
| Knowledge Base + RAG | Fully autonomous repair decisions |
| Classification + semantic search + chatbot | Advanced predictive maintenance / forecasting |

---

## 11. How to Present the Project to the DU AI Doctors

### 11.1 Recommended Presentation Order

| Order | What to Say | Why |
|---|---|---|
| 1 | Start with the real Help Desk and workshop problem. | Shows the project is problem-driven, not "AI for AI's sake." |
| 2 | Explain the offline security requirement. | Makes the architecture constraint clear immediately. |
| 3 | Show the end-to-end workflow. | Doctors understand the user journey before technical detail. |
| 4 | Show the 12-month phased roadmap. | Demonstrates realistic project management and risk control. |
| 5 | Explain where normal software stops and AI begins. | Proves you understand when AI is actually necessary. |
| 6 | Explain semantic search, RAG and local chatbot simply. | Shows core DU AI concepts. |
| 7 | Explain Human-in-the-Loop and hallucination controls. | Demonstrates responsible AI design. |
| 8 | Finish with measurable evaluation metrics. | Turns the project into an academic experiment, not only an application. |

### 11.2 One-Minute Project Explanation

> SmartHelp AI is an offline AI-powered Help Desk and maintenance management system designed to run entirely inside an organization's internal network. A user describes a technical problem in natural language. The system first searches approved internal knowledge and similar historical incidents. AI can classify the problem and suggest a safe self-service solution. If additional help is required, an offline RAG chatbot performs guided troubleshooting. Unresolved incidents are escalated to a human technician. Hardware cases can be connected to spare-part availability and workshop appointments before the user travels. The project is developed in twelve phases, starting with the core Help Desk platform and gradually adding classification, semantic search, RAG, chatbot and smart triage. AI assists technicians; it does not replace them.

### 11.3 Questions the Doctors May Ask

| Question | Strong Short Answer |
|---|---|
| Why do you need AI? | Because users describe incidents in unstructured language and similar incidents may use different wording. AI adds classification, semantic retrieval and grounded conversational assistance. |
| Why not use ChatGPT API? | The production requirement is offline/on-premise. Sensitive operational data should remain inside the internal network. |
| Why RAG? | RAG grounds the local LLM in approved internal procedures and reduces unsupported answers. |
| Why not build only a chatbot? | The business problem also requires tickets, repair workflow, stock, appointments and human escalation. The chatbot is one AI layer inside a complete system. |
| Will AI replace technicians? | No. Critical diagnosis, approval and repair remain human decisions; AI retrieves, recommends and prioritizes. |
| Can your current laptop run it? | Yes for development using small models and lightweight embeddings. Production scale can later use a dedicated internal AI server. |
| How will you prove the AI works? | With held-out classification tests, Top-K retrieval tests, RAG groundedness/hallucination evaluation, latency benchmarks and operational KPIs. |

---

## 12. Final Project Summary

SmartHelp AI combines software engineering, IT service management, databases, natural language processing, semantic search, generative AI, RAG, security and human oversight into one realistic project. Its strength is not the size of the model. Its strength is the architecture: trusted internal knowledge, controlled AI assistance, structured workflows and measurable outcomes.

### Final Architecture in One View

| Traditional Platform | AI Intelligence | Governance |
|---|---|---|
| Users & Roles | Classification | Offline deployment |
| Tickets | Embeddings | Approved knowledge |
| Workshop | Semantic Search | Package whitelist |
| Inventory | RAG | Audit logs |
| Appointments | Offline Chatbot | Human-in-the-Loop |
| Knowledge Base | Smart Triage | AI fallback |

> **Most Important Message** — AI does not replace the technician. It removes repetitive work, retrieves organizational knowledge, assists decision-making, and escalates uncertain situations to a human expert.

### Recommended Immediate Next Step

Start Phase 1 by documenting the actual Help Desk and workshop workflows and defining the first database entities. The first implementation milestone should be a stable traditional ticket system; AI should be added only after the operational data model is reliable.

---

## Appendix A — Phase Completion Checklist

| Phase | Name | Gate |
|---|---|---|
| Phase 1 | Requirements Analysis & System Design | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 2 | Core Help Desk Ticket System | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 3 | Workshop & Hardware Maintenance | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 4 | Inventory & Approved Software Packages | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 5 | Appointment & Workshop Scheduling | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 6 | Approved Knowledge Base | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 7 | AI Ticket Classification | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 8 | Semantic Search & Similar Ticket Retrieval | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 9 | RAG — Retrieval-Augmented Generation | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 10 | Offline AI Chatbot | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 11 | Smart AI Triage & Hardware Pre-Diagnosis | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
| Phase 12 | Full Integration, Security Testing & Evaluation | ☐ Build complete&nbsp;&nbsp;☐ Tests complete&nbsp;&nbsp;☐ Evaluation recorded&nbsp;&nbsp;☐ Approved to proceed |
