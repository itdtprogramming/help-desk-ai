# SmartHelp AI — ERD (Sprint MVP scope)

Scope: what the 3-week sprint proposal actually demos (tickets, classification, retrieval, RAG, escalation). Deliberately excludes Workshop/Device repair, Inventory/StockTransaction, and Appointment/Availability entities — those are out of scope per the proposal (section G) and would be added in the 12-month roadmap (analysis doc, Phases 3/4/5) without redesigning this core.

```mermaid
erDiagram
    ROLE ||--o{ USER : has
    USER ||--o{ TICKET : reports
    USER ||--o{ TICKET : "assigned to (technician)"
    TICKET ||--o{ TICKET_STATUS_HISTORY : has
    TICKET ||--o{ TICKET_COMMENT : has
    TICKET ||--o| KNOWLEDGE_ARTICLE : "resolved by"
    TICKET ||--o{ TICKET_CLASSIFICATION_LOG : has
    TICKET ||--o{ RETRIEVAL_LOG : triggers
    TICKET ||--o| CHAT_SESSION : "escalated from"
    KNOWLEDGE_ARTICLE ||--o| PACKAGE : references
    KNOWLEDGE_ARTICLE ||--o{ RETRIEVAL_RESULT : "returned as"
    RETRIEVAL_LOG ||--o{ RETRIEVAL_RESULT : contains
    USER ||--o{ CHAT_SESSION : starts
    CHAT_SESSION ||--o{ CHAT_MESSAGE : contains
    USER ||--o{ KNOWLEDGE_ARTICLE : reviews
    USER ||--o{ AUDIT_LOG : performs

    ROLE {
        int Id PK
        string Name
    }
    USER {
        int Id PK
        string FullName
        string Email
        string PasswordHash
        int RoleId FK
        string Department
        bool IsActive
        datetime CreatedAt
    }
    TICKET {
        int Id PK
        string DisplayCode
        int ReportedByUserId FK
        int AssignedTechnicianId FK
        string ProblemDescription
        string ErrorMessage
        string Category
        string PredictedCategory
        float PredictionConfidence
        string Priority
        string Status
        string RootCause
        string ActualSolution
        bool ResolvedRemotely
        string ResolutionSource
        int RelatedKnowledgeArticleId FK
        datetime CreatedAt
        datetime UpdatedAt
        datetime ClosedAt
    }
    TICKET_STATUS_HISTORY {
        int Id PK
        int TicketId FK
        string OldStatus
        string NewStatus
        int ChangedByUserId FK
        datetime ChangedAt
        string Note
    }
    TICKET_COMMENT {
        int Id PK
        int TicketId FK
        int AuthorUserId FK
        string Body
        bool IsInternal
        datetime CreatedAt
    }
    KNOWLEDGE_ARTICLE {
        string Id PK
        string Category
        string ProblemAr
        string ProblemEn
        string ErrorText
        string RootCauseAr
        string RootCauseEn
        string SolutionAr
        string SolutionEn
        string RelatedPackageId FK
        string ApprovalStatus
        string EscalationNoteAr
        string EscalationNoteEn
        int Version
        int ReviewedByUserId FK
        datetime CreatedAt
        datetime UpdatedAt
        datetime ReviewDate
    }
    PACKAGE {
        string Id PK
        string Name
        string VersionLabel
        string FileName
        string Sha256Hash
        string ApprovalStatus
        string Description
        datetime CreatedAt
    }
    TICKET_CLASSIFICATION_LOG {
        int Id PK
        int TicketId FK
        string PredictedCategory
        float Confidence
        string ModelVersion
        datetime PredictedAt
        bool WasOverridden
        string OverriddenCategory
        int OverriddenByUserId FK
    }
    RETRIEVAL_LOG {
        int Id PK
        int TicketId FK
        string QueryText
        string ModelVersion
        datetime RequestedAt
    }
    RETRIEVAL_RESULT {
        int Id PK
        int RetrievalLogId FK
        string KnowledgeArticleId FK
        int Rank
        float SimilarityScore
    }
    CHAT_SESSION {
        int Id PK
        int TicketId FK
        int UserId FK
        datetime StartedAt
        datetime EndedAt
        bool EscalatedToTicket
    }
    CHAT_MESSAGE {
        int Id PK
        int ChatSessionId FK
        string Role
        string Content
        string RetrievedKbIdsJson
        string ModelVersion
        datetime CreatedAt
    }
    AUDIT_LOG {
        int Id PK
        int UserId FK
        string Action
        string EntityType
        string EntityId
        string Details
        datetime CreatedAt
    }
```

## Design notes

- **`Ticket.Category` vs `PredictedCategory`**: `Category` is the confirmed/ground-truth label (set by the reporter or overridden by a technician); `PredictedCategory` + `PredictionConfidence` is what the AI classifier returned. Keeping both, plus `TicketClassificationLog`, is what makes the override-rate and accuracy metrics (analysis doc §9.1) measurable instead of asserted.
- **`ResolutionSource`** (`SelfService` / `Chatbot` / `Technician`) is the field the "self-service resolution rate" and "First Contact Resolution" KPIs (§9.2) are computed from — without it those KPIs have no data to read from.
- **`RetrievalLog` + `RetrievalResult`** normalize Top-K results into rows (article id, rank, similarity score) rather than a JSON blob, so Top-1/Top-3 success can be computed with a plain SQL query against the eval set.
- **`Package` is metadata-only** — no stock/quantity fields. It exists so `KnowledgeArticle.RelatedPackageId` and the "AI recommends only approved Package IDs" security requirement (§7.1) are representable. Stock transactions are a Phase 4 (analysis doc) extension, not built here.
- **`KnowledgeArticle.Id` and `Package.Id` are strings** (`KB-0001`, `PKG-0041`) to match the dataset already generated in `data/knowledge_base.json`, rather than surrogate ints that would need remapping.
- **Not modeled**: Workshop/Device/Repair, Inventory/StockTransaction, Appointment/TechnicianAvailability — explicitly out of scope for the sprint (proposal section G).
