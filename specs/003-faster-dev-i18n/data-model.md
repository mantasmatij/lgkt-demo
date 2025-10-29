# Data Model: Faster Dev Feedback and LT/EN i18n

Date: 2025-10-29
Branch: 003-faster-dev-i18n

## Entities

### Language
- code: string (enum: "lt", "en")
- displayName: string (e.g., "Lietuvių", "English")

### TranslationKey
- key: string (unique)
- text_lt: string
- text_en: string
- notes: string (optional)

### UserSession (conceptual)
- id: string
- language: string ("lt"|"en") — preferred language for this session
- expiresAt: datetime

### EmailTemplate (conceptual)
- id: string (unique)
- name: string (human-readable)
- subject_lt: string
- subject_en: string
- body_lt: rich text/markup
- body_en: rich text/markup

### PdfTemplate (conceptual)
- id: string (unique)
- name: string
- layout: identifier (template name)
- labels_lt: map<string,string>
- labels_en: map<string,string>

## Relationships
- TranslationKey is referenced across UI, EmailTemplate, PdfTemplate by stable keys/labels.
- UserSession.language informs UI rendering, email trigger language, and PDF/export language at generation time.

## Validation Rules
- Language.code must be in {lt,en}.
- TranslationKey.{text_lt,text_en} non-empty on critical paths.
- EmailTemplate/PdfTemplate must have both locales for included communications/documents; missing entries must fall back safely.

## Notes
- Session-backed preference means language resets when session expires; consider later enhancement for cookie/account persistence if needed.
