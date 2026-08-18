# SmartHelp AI — Progress Log

_Last updated: 2026-08-19_

This document explains, step by step, everything that has been built in this
repository so far — what exists, how it works, how to run it, and what is
still missing. It is written so that someone who was not part of the work
(a teammate, an advisor, a grader) can read it and understand the current
state of the project without reading the code first.

An Arabic version follows the English section (سيتبع القسم الإنجليزي نسخة
عربية كاملة أدناه).

---

## 1. What this project is

SmartHelp AI is an offline, AI-assisted IT Help Desk. A user describes a
technical problem in Arabic or English (or a mix of both); the system
classifies the problem's category, retrieves the closest matching solutions
from an approved knowledge base, and — if nothing matches confidently —
lets the user escalate to a human technician as a ticket. Technicians work
those tickets through a queue (assign, change status, comment); an Admin
manages accounts and roles.

The project follows a proposal that scopes it as a 3-week sprint MVP
(see `Documentation/Offline AI-Powered IT Help Desk and Maintenance
Management System__Proposal_Filled.docx`), which is itself a condensed demo
of a larger 12-month roadmap (`Documentation/SmartHelp_AI_DU_AI_Project_Analysis.docx`).

## 2. Architecture

Three independent services, run separately in development:

| Service | Tech | Port | Purpose |
|---|---|---|---|
| `backend/` | ASP.NET Core 10 Web API + EF Core + SQL Server | 5299 | Business data: users, tickets, knowledge base, auth |
| `ai-service/` | Python FastAPI + sentence-transformers + FAISS + scikit-learn | 8000 | Classification and semantic retrieval only |
| `frontend/` | React 19 + TypeScript + Vite + shadcn/ui + Tailwind CSS v4 | 5173 | The web UI |

The frontend calls both APIs directly. The AI service is intentionally
separate from the backend (per the analysis doc's architecture principle)
so the underlying model can be swapped later without touching the business
API or the database.

## 3. Data

- `data/knowledge_base.json` — 40 approved knowledge articles (category,
  problem description in Arabic+English, root cause, solution, escalation
  note, optional related package).
- `data/incidents.json` — 160 synthetic incidents (80 train / 80 eval),
  each with a ground-truth category and a "gold" KB article id, used to
  evaluate classification and retrieval. The eval split is **entirely**
  `vague` / `misleading` / `paraphrase` style incidents (zero "direct"
  wording) — it was built to test the hardest cases, not average-case
  accuracy. This matters when reading the numbers in §6.

## 4. Backend (`backend/`)

Built with ASP.NET Core 10, Entity Framework Core against a local SQL
Server (`SQLEXPRESS`) instance.

**Data model** (`backend/Models/`): `Role`, `User`, `Ticket`,
`TicketStatusHistory`, `TicketComment`, `KnowledgeArticle`, `Package`,
`TicketClassificationLog`, `RetrievalLog`/`RetrievalResult`, `ChatSession`/
`ChatMessage` (not yet used), `AuditLog` (not yet used). See `docs/erd.md`
for the full entity-relationship diagram and the reasoning behind each
field.

**Authentication & authorization** (`backend/Auth/`, `AuthController`):
- JWT bearer tokens. `POST /api/auth/login` and `POST /api/auth/register`
  issue a token containing the user's id, name, email, and role.
- Every controller requires a valid token (`[Authorize]`); ticket-management
  actions additionally require `Technician` or `Admin`
  (`[Authorize(Roles = "Technician,Admin")]`); user management requires
  `Admin` only.
- Self-registration always creates a plain `"User"` account — Technician
  and Admin accounts can only be created by an Admin through the Users page.
- `ReportedByUserId`, `ChangedByUserId`, and `AuthorUserId` are read from
  the JWT, never from the request body, so a client cannot forge who
  reported a ticket or who changed its status.

**Controllers** (`backend/Controllers/`):
- `AuthController` — login, register.
- `TicketsController` — list (role-filtered: a `User` only sees their own
  tickets; `Technician`/`Admin` see everything), get by id (with status
  history and comments), create, change status, assign-to-self, add
  comment (internal-only comments are only possible for staff roles).
- `KnowledgeArticlesController` — list/get approved articles.
- `UsersController` (Admin-only) — list users, create a user with any role.

**Seeding** (`backend/Data/DbSeeder.cs`), runs automatically in development:
- Loads all 40 KB articles and the 3 packages they reference into the
  database.
- Creates one demo account per role if it does not already exist:
  - `user@smarthelp.local` / `Passw0rd!` (User)
  - `tech@smarthelp.local` / `Passw0rd!` (Technician)
  - `admin@smarthelp.local` / `Passw0rd!` (Admin)

## 5. AI service (`ai-service/`)

A small FastAPI app, independent of the backend, with two endpoints:

- `POST /classify` — takes free text, returns a predicted category
  (Software/Hardware/Network/Account) and a confidence score. The
  classifier is a logistic regression trained on sentence-transformer
  embeddings of the 80 **train** incidents (trained once at startup, not
  saved to disk).
- `POST /retrieve` — takes free text, returns the Top-3 most similar
  knowledge base articles (FAISS index over embeddings of all 40 articles)
  with similarity scores, plus a `needs_escalation` flag when the top score
  is below a confidence threshold.

Embedding model: `paraphrase-multilingual-MiniLM-L12-v2` (handles the mixed
Arabic/English text).

**Evaluation** (`ai-service/scripts/evaluate.py`, `scripts/tune_threshold.py`),
run against the 80-incident eval split:

| Metric | Result | Proposal target |
|---|---|---|
| Top-1 retrieval accuracy | 47.5% | — |
| Top-3 retrieval accuracy | 70.0% | ≥ 85% |
| Classification accuracy | 66.2% | ≥ 80% |

These numbers are **below** the proposal's targets, and that needs an
honest caveat: the eval split is 100% hard cases (vague/misleading/
paraphrased wording) by design — there are zero "direct" (easy) incidents
in it. So this measures worst-case robustness, not typical-case accuracy.
The retrieval confidence threshold (0.55) was chosen by scanning candidate
values against the **train** split only (`tune_threshold.py`) — the eval
split was never used to pick it, so the eval numbers above are honest.
Improving these numbers is realistic future work (more training data,
per-category thresholds, a better embedding model), not something to
paper over for a demo.

## 6. Frontend (`frontend/`)

React + TypeScript + Vite, styled with **Tailwind CSS v4** and
**shadcn/ui** components, laid out behind a collapsible left sidebar
(`react-router-dom` for routing).

**Design language**: sharp corners everywhere (`--radius: 0`), translucent
glassmorphism panels (blurred, semi-transparent cards/sidebar/popovers)
over a flat, neutral (no color) background with a subtle depth vignette —
chosen after iterating away from an earlier, more colorful version per
feedback that it read as noisy for a minimalist design.

**Pages** (`frontend/src/pages/`):
- `Assistant` (`/`) — the main demo flow: describe a problem, see the
  predicted category and Top-3 KB matches, escalate to a ticket if needed.
- `Tickets` (`/tickets`) — a `User` sees only their own tickets ("My
  tickets"); `Technician`/`Admin` see the full queue ("Ticket queue").
  Clicking a row opens the ticket detail page.
- `TicketDetail` (`/tickets/:id`) — problem details, an "Assign to me"
  button and a status-change control (staff only), status history, and a
  comment thread (staff can mark a comment "internal", hidden from the
  reporter).
- `KnowledgeBase` (`/knowledge-base`) — a searchable list of all 40
  approved articles.
- `Login` / `Register` (`/login`, `/register`) — the login page shows the
  three demo accounts' emails directly, since this is a development/demo
  build, not production.
- `Users` (`/users`, Admin-only) — list of all accounts and a dialog to
  create a new account with any role.

**Auth on the frontend** (`frontend/src/auth.tsx`, `RouteGuards.tsx`): a
React context holds the current user and JWT (persisted to
`localStorage`); route guards redirect to `/login` if not authenticated,
or back to `/` if a role-restricted route (like `/users`) is visited
without permission; an automatic logout fires if the backend ever returns
401 (e.g. an expired token).

## 7. How to run it locally

Three terminals:

```bash
# 1. Backend (http://localhost:5299)
cd backend
dotnet run --urls http://localhost:5299

# 2. AI service (http://localhost:8000)
cd ai-service
.venv/Scripts/python -m uvicorn app.main:app --port 8000

# 3. Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Then open `http://localhost:5173` and sign in with one of the seeded
demo accounts (see §4). The backend auto-creates and seeds the SQL Server
database (`SmartHelpAI`) the first time it runs in Development.

## 8. What has been verified

Every feature described above has been checked by actually running it —
not just reading the code:
- Backend endpoints tested directly (curl) for both success and
  failure/permission cases (401 unauthenticated, 403 wrong role).
- The full browser flow (Assistant → analyze → escalate → ticket appears
  in the queue) tested with a headless browser for all three roles, with
  screenshots reviewed and the browser console checked for errors each
  time.
- Retrieval and classification accuracy measured against the held-out
  eval set, not asserted.

## 9. What is **not** built yet (honest gaps)

- **RAG / chatbot** (Phase 9–10 of the 12-month roadmap): no multi-turn
  conversation, no local LLM. The Assistant page is single-shot
  (describe → analyze → escalate), not a chat.
- **Knowledge Base approval workflow**: articles are seeded as already
  "Approved"; there's no UI for a technician to propose an article or an
  admin to review/approve one.
- **Package/inventory management**: `Package` exists as a data model
  (referenced by 3 KB articles) but has no UI and no stock tracking (this
  is explicitly out of scope per the proposal).
- **Workshop/hardware repair, appointments**: explicitly out of scope for
  this sprint (12-month roadmap Phases 3–5).
- **User account management beyond create**: no edit, deactivate, or
  delete UI (deactivation was done once manually via SQL for leftover
  test accounts, not through the app).
- **Audit logging**: the `AuditLog` model exists but nothing writes to it
  yet.
- The JWT signing key is committed in `appsettings.Development.json` for
  convenience — fine for a local student/dev project, but a production
  deployment must replace it with a real secret (environment variable /
  user-secrets / key vault), never a committed value.

## 10. Repository map

```
Project/
├── backend/            ASP.NET Core API (Models, Data, Controllers, Auth, Migrations)
├── ai-service/          FastAPI classification + retrieval service
├── frontend/            React + Vite + shadcn/ui web app
├── data/                Seed dataset (knowledge_base.json, incidents.json, schema.md)
├── docs/
│   ├── erd.md           Entity-relationship diagram + design notes
│   └── PROGRESS.md       This file
└── Documentation/        Original proposal + analysis documents (.docx)
```

---

# سجل التقدم — SmartHelp AI

_آخر تحديث: 2026-08-19_

يشرح هذا المستند، خطوة بخطوة، كل ما تم بناؤه في هذا المشروع حتى الآن: ما
الموجود فعليًا، وكيف يعمل، وكيف يتم تشغيله، وما الذي ما زال ناقصًا. كُتب
بحيث يستطيع أي شخص لم يشارك في العمل (زميل، مشرف أكاديمي، مقيّم) أن يقرأه
ويفهم الوضع الحالي للمشروع دون الحاجة لقراءة الكود أولاً.

## ١. ما هو هذا المشروع

SmartHelp AI هو نظام دعم فني (Help Desk) يعمل بدون اتصال بالإنترنت
ويستخدم الذكاء الاصطناعي كمساعد. يكتب المستخدم مشكلته التقنية بالعربية أو
الإنجليزية أو مزيج منهما؛ يقوم النظام بتصنيف فئة المشكلة، ثم يسترجع أقرب
الحلول المعتمدة من قاعدة المعرفة، وإذا لم يجد تطابقًا واثقًا، يتيح
للمستخدم تصعيد المشكلة كتذكرة (Ticket) إلى فني بشري. يعمل الفنيون على هذه
التذاكر (تعيين لأنفسهم، تغيير الحالة، إضافة تعليقات)، بينما يدير المسؤول
(Admin) الحسابات والأدوار.

يتبع المشروع مقترحًا يحدد نطاقه كنسخة أولية (MVP) لسبرنت مدته ثلاثة
أسابيع (راجع
`Documentation/Offline AI-Powered IT Help Desk and Maintenance
Management System__Proposal_Filled.docx`)، وهو بدوره عرض مختصر لخارطة طريق
أكبر مدتها اثنا عشر شهرًا
(`Documentation/SmartHelp_AI_DU_AI_Project_Analysis.docx`).

## ٢. البنية المعمارية (Architecture)

ثلاث خدمات مستقلة، تعمل كل منها بشكل منفصل أثناء التطوير:

| الخدمة | التقنية | المنفذ (Port) | الغرض |
|---|---|---|---|
| `backend/` | ASP.NET Core 10 Web API + EF Core + SQL Server | 5299 | البيانات الأساسية: المستخدمون، التذاكر، قاعدة المعرفة، تسجيل الدخول |
| `ai-service/` | Python FastAPI + sentence-transformers + FAISS + scikit-learn | 8000 | التصنيف والاسترجاع الدلالي فقط |
| `frontend/` | React 19 + TypeScript + Vite + shadcn/ui + Tailwind CSS v4 | 5173 | واجهة الويب |

تتواصل الواجهة الأمامية مع كلتا الخدمتين مباشرة. خدمة الذكاء الاصطناعي
منفصلة عمدًا عن الواجهة الخلفية (بحسب مبدأ العمارة في وثيقة التحليل) حتى
يمكن استبدال النموذج لاحقًا دون المساس بواجهة الأعمال أو قاعدة البيانات.

## ٣. البيانات

- `data/knowledge_base.json` — 40 مقالة معتمدة في قاعدة المعرفة (الفئة،
  وصف المشكلة بالعربية والإنجليزية، السبب الجذري، الحل، ملاحظة التصعيد،
  وحزمة مرتبطة اختيارية).
- `data/incidents.json` — 160 حادثة اصطناعية (80 للتدريب / 80 للتقييم)،
  لكل منها فئة حقيقية ومعرّف مقالة "ذهبية" (gold) من قاعدة المعرفة، تُستخدم
  لتقييم التصنيف والاسترجاع. مجموعة التقييم بالكامل من نوع الحالات
  الصعبة (غامضة / مضللة / معاد صياغتها) — لا توجد فيها أي حادثة "مباشرة"
  الصياغة. هذا مهم عند قراءة الأرقام في القسم ٦.

## ٤. الواجهة الخلفية (`backend/`)

مبنية باستخدام ASP.NET Core 10 و Entity Framework Core على قاعدة بيانات
SQL Server محلية (`SQLEXPRESS`).

**نموذج البيانات** (`backend/Models/`): `Role`، `User`، `Ticket`،
`TicketStatusHistory`، `TicketComment`، `KnowledgeArticle`، `Package`،
`TicketClassificationLog`، `RetrievalLog`/`RetrievalResult`، `ChatSession`/
`ChatMessage` (غير مستخدمة بعد)، `AuditLog` (غير مستخدمة بعد). راجع
`docs/erd.md` لمخطط العلاقات الكامل وأسباب اختيار كل حقل.

**تسجيل الدخول والصلاحيات** (`backend/Auth/`، `AuthController`):
- رموز JWT. تصدر `POST /api/auth/login` و `POST /api/auth/register` رمزًا
  يحتوي على معرّف المستخدم واسمه وبريده الإلكتروني ودوره.
- كل نقطة وصول (Controller) تتطلب رمزًا صالحًا (`[Authorize]`)؛ أما
  إجراءات إدارة التذاكر فتتطلب إضافيًا دور `Technician` أو `Admin`؛
  وإدارة المستخدمين تتطلب `Admin` فقط.
- التسجيل الذاتي ينشئ دائمًا حساب "User" عاديًا فقط — حسابات الفني
  والمسؤول لا يمكن إنشاؤها إلا من قبل مسؤول عبر صفحة المستخدمين.
- يتم قراءة هوية مُبلّغ التذكرة ومن غيّر حالتها ومن كتب التعليق من رمز
  JWT نفسه وليس من الطلب المُرسَل من المتصفح، بحيث لا يمكن لأي عميل
  انتحال هوية شخص آخر.

**نقاط الوصول (Controllers)** (`backend/Controllers/`):
- `AuthController` — تسجيل الدخول والتسجيل الجديد.
- `TicketsController` — عرض التذاكر (مُفلترة حسب الدور: "User" يرى
  تذاكره فقط، بينما "Technician"/"Admin" يريان كل التذاكر)، عرض تذكرة
  واحدة (مع سجل الحالات والتعليقات)، إنشاء تذكرة، تغيير الحالة، تعيين
  التذكرة لنفس الفني، وإضافة تعليق (التعليقات الداخلية فقط للفنيين
  والمسؤولين).
- `KnowledgeArticlesController` — عرض المقالات المعتمدة.
- `UsersController` (للمسؤول فقط) — عرض المستخدمين وإنشاء مستخدم بأي دور.

**تعبئة البيانات المبدئية** (`backend/Data/DbSeeder.cs`)، تعمل تلقائيًا
في وضع التطوير:
- تحميل جميع مقالات قاعدة المعرفة الأربعين والحزم الثلاث المرتبطة بها
  إلى قاعدة البيانات.
- إنشاء حساب تجريبي واحد لكل دور إن لم يكن موجودًا:
  - `user@smarthelp.local` / `Passw0rd!` (مستخدم عادي)
  - `tech@smarthelp.local` / `Passw0rd!` (فني)
  - `admin@smarthelp.local` / `Passw0rd!` (مسؤول)

## ٥. خدمة الذكاء الاصطناعي (`ai-service/`)

تطبيق FastAPI صغير، مستقل عن الواجهة الخلفية، يوفر نقطتي وصول:

- `POST /classify` — يستقبل نصًا حرًا ويعيد الفئة المتوقعة
  (برمجيات/عتاد/شبكة/حساب) ودرجة الثقة. المصنّف هو انحدار لوجستي
  (Logistic Regression) مدرّب على تمثيلات (embeddings) حادثات التدريب
  الثمانين، ويُدرَّب مرة واحدة عند بدء تشغيل الخدمة (وليس محفوظًا على
  القرص).
- `POST /retrieve` — يستقبل نصًا حرًا ويعيد أفضل 3 مقالات مشابهة من قاعدة
  المعرفة (باستخدام فهرس FAISS على تمثيلات المقالات الأربعين) مع درجة
  التشابه لكل منها، بالإضافة إلى إشارة `needs_escalation` عندما تكون أعلى
  درجة تشابه أقل من حد الثقة المحدد.

نموذج التمثيل (Embedding) المستخدم:
`paraphrase-multilingual-MiniLM-L12-v2` (يدعم النصوص المختلطة عربي/إنجليزي).

**التقييم** (`ai-service/scripts/evaluate.py`، `scripts/tune_threshold.py`)،
تم تشغيله على مجموعة التقييم المكوّنة من 80 حادثة:

| المقياس | النتيجة | الهدف في المقترح |
|---|---|---|
| دقة الاسترجاع Top-1 | %47.5 | — |
| دقة الاسترجاع Top-3 | %70.0 | ≥ %85 |
| دقة التصنيف | %66.2 | ≥ %80 |

هذه الأرقام **أقل** من أهداف المقترح، ويجب توضيح السبب بأمانة: مجموعة
التقييم بأكملها من الحالات الصعبة (صياغة غامضة/مضللة/معاد صياغتها) بشكل
مقصود — لا توجد فيها أي حالة "مباشرة" (سهلة). لذلك فهي تقيس المتانة في
أسوأ الحالات، لا الدقة في الحالة المتوسطة. تم اختيار حد الثقة الخاص
بالاسترجاع (0.55) بفحص قيم مرشحة على مجموعة **التدريب فقط**
(`tune_threshold.py`) — لم تُستخدم مجموعة التقييم أبدًا في اختياره، لذا
فالأرقام أعلاه صادقة. تحسين هذه الأرقام عمل مستقبلي واقعي (بيانات تدريب
أكثر، حدود ثقة لكل فئة، نموذج تمثيل أفضل)، وليس أمرًا يجب التستر عليه من
أجل العرض التقديمي.

## ٦. الواجهة الأمامية (`frontend/`)

React + TypeScript + Vite، مصمَّمة باستخدام **Tailwind CSS v4** ومكوّنات
**shadcn/ui**، ومنظَّمة خلف شريط جانبي أيسر قابل للطي
(`react-router-dom` للتنقل بين الصفحات).

**لغة التصميم**: زوايا حادة في كل مكان (`--radius: 0`)، لوحات زجاجية
شفافة (Glassmorphism) بخلفية ضبابية (بطاقات/شريط جانبي/نوافذ منبثقة شبه
شفافة) فوق خلفية مسطحة محايدة (بلا ألوان) مع تدرج عمق خفيف — تم اختيار
هذا بعد التراجع عن نسخة سابقة أكثر تلوّنًا بناءً على ملاحظة أنها بدت
"صاخبة" بالنسبة لتصميم بسيط (Minimalist).

**الصفحات** (`frontend/src/pages/`):
- `Assistant` (الصفحة الرئيسية `/`) — تدفق العرض الأساسي: وصف المشكلة،
  رؤية الفئة المتوقعة وأفضل 3 مقالات مطابقة، والتصعيد كتذكرة عند الحاجة.
- `Tickets` (`/tickets`) — "المستخدم" يرى تذاكره فقط ("تذاكري")؛
  "الفني"/"المسؤول" يريان كل التذاكر ("قائمة انتظار التذاكر"). النقر على
  صف يفتح صفحة تفاصيل التذكرة.
- `TicketDetail` (`/tickets/:id`) — تفاصيل المشكلة، زر "تعيين لي" وأداة
  تغيير الحالة (للفنيين فقط)، سجل الحالات، وسلسلة التعليقات (يمكن للفني
  وضع علامة "داخلي" على تعليق فلا يراه مُبلّغ التذكرة).
- `KnowledgeBase` (`/knowledge-base`) — قائمة قابلة للبحث تضم كل المقالات
  الأربعين المعتمدة.
- `Login` / `Register` (`/login`، `/register`) — صفحة الدخول تعرض بريد كل
  حساب تجريبي مباشرة، لأن هذه نسخة تطوير/عرض تجريبي وليست نسخة إنتاجية.
- `Users` (`/users`، للمسؤول فقط) — قائمة كل الحسابات ونافذة لإنشاء حساب
  جديد بأي دور.

**تسجيل الدخول في الواجهة الأمامية** (`frontend/src/auth.tsx`،
`RouteGuards.tsx`): سياق React (Context) يحتفظ بالمستخدم الحالي ورمز JWT
(محفوظ في `localStorage`)؛ حراس المسارات (Route Guards) يعيدون التوجيه
إلى `/login` إذا لم يكن المستخدم مسجَّل الدخول، أو إلى `/` إذا حاول الوصول
إلى صفحة مقيَّدة بدور معين (مثل `/users`) دون صلاحية؛ ويحدث تسجيل خروج
تلقائي إذا أعادت الواجهة الخلفية استجابة 401 (مثلاً عند انتهاء صلاحية
الرمز).

## ٧. كيفية التشغيل محليًا

ثلاث نوافذ طرفية (terminals):

```bash
# ١. الواجهة الخلفية (http://localhost:5299)
cd backend
dotnet run --urls http://localhost:5299

# ٢. خدمة الذكاء الاصطناعي (http://localhost:8000)
cd ai-service
.venv/Scripts/python -m uvicorn app.main:app --port 8000

# ٣. الواجهة الأمامية (http://localhost:5173)
cd frontend
npm run dev
```

ثم افتح `http://localhost:5173` وسجّل الدخول بأحد الحسابات التجريبية
المذكورة في القسم ٤. تقوم الواجهة الخلفية تلقائيًا بإنشاء وتعبئة قاعدة
بيانات SQL Server (`SmartHelpAI`) عند أول تشغيل في وضع التطوير.

## ٨. ما الذي تم التحقق منه فعليًا

كل ميزة مذكورة أعلاه تم التحقق منها بتشغيلها فعليًا، وليس فقط بقراءة
الكود:
- تم اختبار نقاط الوصول في الواجهة الخلفية مباشرة (curl) في حالتي
  النجاح والفشل/الصلاحيات (401 لغير المسجَّل، 403 للدور الخاطئ).
- تم اختبار التدفق الكامل في المتصفح (المساعد ← التحليل ← التصعيد ←
  ظهور التذكرة في القائمة) باستخدام متصفح بدون واجهة (headless) لكل
  الأدوار الثلاثة، مع مراجعة لقطات الشاشة والتحقق من عدم وجود أخطاء في
  console المتصفح في كل مرة.
- تم قياس دقة الاسترجاع والتصنيف مقابل مجموعة التقييم المحجوزة فعليًا،
  وليس افتراضًا.

## ٩. ما لم يُبنَ بعد (بصراحة)

- **الدردشة بالذكاء الاصطناعي (RAG / Chatbot)** (المرحلتان 9 و10 من
  خارطة الطريق ذات الاثني عشر شهرًا): لا توجد محادثة متعددة الأدوار ولا
  نموذج لغوي محلي. صفحة المساعد حاليًا سؤال واحد فقط (وصف ← تحليل ←
  تصعيد)، وليست محادثة.
- **سير عمل اعتماد قاعدة المعرفة**: المقالات مُدرجة مسبقًا بحالة
  "معتمدة"؛ لا توجد واجهة لفني يقترح مقالة أو لمسؤول يراجعها ويعتمدها.
- **إدارة الحزم والمخزون**: يوجد نموذج بيانات `Package` (ترجع إليه 3
  مقالات) لكنه بلا واجهة وبلا تتبع للمخزون (هذا خارج النطاق صراحة حسب
  المقترح).
- **الورشة وإصلاح الأجهزة والمواعيد**: خارج نطاق هذا السبرنت صراحة
  (المراحل 3-5 من خارطة الطريق).
- **إدارة حسابات المستخدمين بعد الإنشاء**: لا توجد واجهة للتعديل أو
  التعطيل أو الحذف (تم تعطيل بعض الحسابات التجريبية الزائدة يدويًا عبر
  SQL وليس عبر التطبيق).
- **سجل التدقيق (Audit Log)**: نموذج `AuditLog` موجود لكن لا شيء يكتب
  إليه حتى الآن.
- مفتاح توقيع JWT مُدرَج مباشرة في `appsettings.Development.json` للتسهيل
  — مقبول لمشروع دراسي/تطويري محلي، لكن أي نشر إنتاجي حقيقي يجب أن
  يستبدله بسرّ حقيقي (متغير بيئة / user-secrets / خزنة مفاتيح)، وليس
  قيمة مرفوعة في المستودع.

## ١٠. خريطة المستودع

```
Project/
├── backend/            واجهة API بلغة ASP.NET Core (النماذج، البيانات، نقاط الوصول، المصادقة، الترحيلات)
├── ai-service/          خدمة التصنيف والاسترجاع بلغة FastAPI
├── frontend/            تطبيق الويب بلغة React + Vite + shadcn/ui
├── data/                بيانات التعبئة المبدئية (knowledge_base.json، incidents.json، schema.md)
├── docs/
│   ├── erd.md           مخطط العلاقات وملاحظات التصميم
│   └── PROGRESS.md       هذا الملف
└── Documentation/        وثائق المقترح والتحليل الأصلية (.docx)
```
