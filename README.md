
# GovConnect — Team Task Breakdown

## Shivang — Frontend

**Language:** React + TypeScript

- **Chat screen** → user can type/talk to the AI and get answers
- **Dashboard** → shows status of all applications in one place
- **Upload button** → user can upload documents/certificates
- **Auto-fill preview & print** → user sees the pre-filled form and can print it

---

## Sanjit — Conversational AI

**Language:** Python

- **LLM chatbot** → answers user questions in plain language
- **RAG (fact retrieval)** → pulls real answers from actual government scheme documents so the AI doesn't make things up
- **Voice input/output** → user can speak instead of typing, and hear the answer

---

## Sangharsh — Document AI

**Language:** Python

- **OCR (text reading)** → automatically reads text from uploaded photos/scans of documents
- **Verification** → checks if uploaded document details match the user's profile
- **Fraud/mismatch flagging** → warns the user if something looks fake or doesn't match

---

## Sumedha/Sampada — Backend & Data

**Language:** Python

- **Database & server** → stores user profiles and application status
- **Recommendation engine** → suggests government schemes the user is eligible for but doesn't know about
- **Deadline reminders** → alerts user before documents/licenses expire

---

## Sanjit/Sangahrsh/Shivang — Automation & Demo

**Language:** Python

- **Auto-submit feature** → (real or simulated) fills and submits the application automatically
- **Impact dashboard** → shows numbers like time saved, applications completed
- **Demo & pitch prep** → builds the final presentation and backup demo for judging day

---

# Code Style Guide — Everyone Follow Thiss

Following one shared style means anyone on the team can read anyone else's code without getting confused. Copy the patterns below.

## 1. Naming rules

| What                             | Style                     | Example                                |
| -------------------------------- | ------------------------- | -------------------------------------- |
| Python files/functions/variables | snake_case                | `verify_document.py`, `extract_text()` |
| React components/files           | PascalCase                | `ChatWindow.tsx`, `Dashboard.tsx`      |
| React variables/functions        | camelCase                 | `userProfile`, `fetchApplications()`   |
| Constants                        | UPPER_SNAKE_CASE          | `MAX_FILE_SIZE`                        |
| Branch names                     | feature/short-description | `feature/ocr-extraction`               |

## 2. Python function reference (Persons B, C, D, E)

Every function should have a clear name, type hints, and a short docstring explaining what it does — so a teammate can understand it without reading the whole function.

```python
def extract_text_from_document(image_path: str) -> dict:
    """
    Reads an uploaded document image and pulls out the text.

    Args:
        image_path: path to the uploaded image file

    Returns:
        dict with extracted fields, e.g. {"name": "...", "dob": "..."}
    """
    # step 1: load the image
    # step 2: run OCR
    # step 3: return structured fields
    pass
```

**Rules everyone follows:**

- One function = one job (don't cram multiple tasks into one function)
- Always add type hints (`: str`, `-> dict`, etc.)
- Always add a short docstring — one line is enough if the function is simple

## 3. React component reference (Person A)

```tsx
type ApplicationCardProps = {
  title: string;
  status: "submitted" | "in_review" | "approved" | "rejected";
};

function ApplicationCard({ title, status }: ApplicationCardProps) {
  return (
    <div className="application-card">
      <h3>{title}</h3>
      <span>{status}</span>
    </div>
  );
}

export default ApplicationCard;
```

**Rules everyone follows:**

- One component = one file, named the same as the component
- Always define a `Props` type at the top — no untyped props
- Keep components small; if a file gets long, split it into smaller components

## 4. API contract format — how services talk to each other

Every request/response between frontend and backend, or backend and an AI service, follows this shape. Agree on the exact fields as a team before building.

```json
// Request: POST /api/documents/verify
{
  "user_id": "u123",
  "document_type": "aadhaar",
  "image_url": "https://.../upload123.jpg"
}

// Response
{
  "status": "success",
  "matched": true,
  "extracted_fields": {
    "name": "Sanjit Shetkar",
    "dob": "2003-05-14"
  },
  "flags": []
}
```

**Rule:** always use `snake_case` for JSON field names, and always include a `status` field so the frontend can check success/failure easily.

## 5. Commit message format

```
<type>: <short description>

examples:
feat: add OCR text extraction endpoint
fix: correct date format in profile form
style: adjust dashboard card spacing
docs: update README setup steps
```

Use one of: `feat` (new feature), `fix` (bug fix), `style` (visual only), `docs` (documentation only), `refactor` (code cleanup, no behavior change).
