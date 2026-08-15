# ONE STOP — Backend

> **Not yet implemented.** This directory will contain the FastAPI backend.

## Planned Stack

- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **AI/LLM**: Gemini / OmniRoute integration
- **Auth**: JWT-based authentication
- **APIs**: Government college data, scholarship APIs

## Planned Structure

```
backend/
├── app/
│   ├── api/          ← Route handlers
│   ├── models/       ← SQLAlchemy models
│   ├── services/     ← Business logic
│   ├── schemas/      ← Pydantic schemas
│   └── main.py
├── alembic/          ← DB migrations
├── requirements.txt
└── README.md
```

## Getting Started (Future)

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```
