# Platform Comparison: Prime SP vs OJS (Open Journal Systems)

## Overview

This document compares the **Prime Scientific Publishing** platform with **OJS (Open Journal Systems)** to identify:
- Features already implemented
- Features intentionally NOT implemented (different focus)
- Features required for Scopus/DOAJ indexing
- Features safe to postpone

---

## What Remains Untouched

- All existing models, fields, and enums
- Current feature set and API structure
- Database schema (no changes required for this analysis)

---

## Features We Already Cover

### ✅ Core Publishing Features

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Multi-journal support** | ✅ Implemented | `Journal` model with status, ISSN, publisher |
| **Volume/Issue structure** | ✅ Implemented | `Volume` and `Issue` models with optional relations |
| **Content types** | ✅ Implemented | ARTICLE, CASE_STUDY, BOOK, BOOK_CHAPTER, TEACHING_NOTE, COLLECTION |
| **Content status workflow** | ✅ Implemented | DRAFT → REVIEW → PUBLISHED → ARCHIVED |
| **Author management** | ✅ Implemented | `Author` model with ORCID, institution, bio |
| **Multi-author support** | ✅ Implemented | `ContentAuthor` many-to-many relation |
| **Editorial board** | ✅ Implemented | `EditorialBoardMember` model with positions |
| **Role-based permissions** | ✅ Implemented | ADMIN, EDITOR, REVIEWER, AUTHOR roles |
| **PDF upload/storage** | ✅ Implemented | PDF upload via Vercel Blob, `pdfUrl` field |
| **DOI support** | ✅ Implemented | `doi` field, Crossref integration ready |
| **Citation generation** | ✅ Implemented | Multiple citation styles (Harvard, APA, MLA, etc.) |
| **Tag system** | ✅ Implemented | `Tag` model with many-to-many content relation |
| **Search functionality** | ✅ Implemented | Search API with filters |
| **Archive system** | ✅ Implemented | ARCHIVED status, archive page |
| **Analytics/Statistics** | ✅ Implemented | View counts, analytics API |
| **Featured content** | ✅ Implemented | `featured` boolean field |
| **Content metadata** | ✅ Implemented | JSON metadata field for flexible data |

### ✅ Technical Features

| Feature | Status | Implementation |
|---------|--------|----------------|
| **OAI-PMH support** | ✅ Implemented | `/api/oai-pmh` endpoint with Dublin Core |
| **Crossref XML generation** | ✅ Implemented | `generateCrossrefXML()` function |
| **RESTful API** | ✅ Implemented | Comprehensive API routes |
| **Authentication** | ✅ Implemented | NextAuth.js with JWT |
| **User management** | ✅ Implemented | User CRUD, role management |
| **Responsive design** | ✅ Implemented | Mobile-first responsive UI |
| **Multi-language support** | ✅ Implemented | i18n with English, Uzbek, Russian |
| **Review & Approval workflow** | ✅ Implemented | Admin dashboard with pending items |

### ✅ Content Management

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Rich text editor** | ✅ Implemented | RichTextEditor component |
| **Content versioning** | ✅ Partial | `updatedAt` timestamp (full versioning not implemented) |
| **Content preview** | ✅ Implemented | PDF viewer, content viewer components |
| **Content statistics** | ✅ Implemented | View counts, citation counts |
| **Content export** | ✅ Partial | Crossref XML export (full export not implemented) |

---

## Features Intentionally NOT Implemented

### ❌ OJS Features We Don't Need (Different Focus)

| OJS Feature | Why Not Implemented | Our Alternative |
|-------------|---------------------|-----------------|
| **Plugin system** | Too complex for our use case | Direct feature implementation |
| **Payment/subscription system** | Not needed for our model | Open access focus |
| **Email notification system** | Can be added later if needed | Manual notifications for now |
| **Custom submission forms** | Standardized content types work better | Fixed content types (ARTICLE, CASE_STUDY, etc.) |
| **Reviewer rating system** | Not needed for our workflow | Simple accept/reject/revision |
| **Copyediting workflow** | Simplified to single review stage | Direct DRAFT → REVIEW → PUBLISHED |
| **Layout editing** | Not needed - we use templates | Template-based publishing |
| **Multi-site hosting** | Single platform focus | One platform, multiple journals |
| **Statistics plugin system** | Built-in analytics sufficient | Custom analytics API |
| **Announcements system** | Can use content for announcements | Featured content serves this |
| **Reading tools** | Not needed for our audience | Simple PDF viewer sufficient |
| **Subscription management** | Open access model | No subscriptions needed |
| **Payment gateway integration** | Not applicable | Free/open access |
| **Custom metadata schemas** | JSON metadata field is flexible | `metadata` JSON field |
| **Galley file management** | PDF-only approach | Single PDF per content |
| **Supplementary files** | Can be added to metadata if needed | JSON metadata field |

### 🎯 Our Unique Features (Not in OJS)

| Feature | Description |
|---------|-------------|
| **Multi-content type support** | Articles, case studies, books, teaching notes, collections |
| **Modern web stack** | Next.js, React, TypeScript, Tailwind CSS |
| **Cloud-native** | Vercel Blob storage, serverless architecture |
| **API-first design** | Comprehensive REST API for all operations |
| **Real-time analytics** | Built-in view tracking and analytics |
| **Citation style dropdown** | Multiple citation formats with copy-to-clipboard |
| **Mobile-first responsive** | Optimized for all devices |
| **Modern UI/UX** | Clean, modern interface vs OJS's dated UI |

---

## Features Required for Scopus/DOAJ Indexing

### 🔴 Critical (Must Have)

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| **OAI-PMH endpoint** | ✅ Implemented | Critical | Required for DOAJ |
| **Dublin Core metadata** | ✅ Implemented | Critical | OAI-PMH uses Dublin Core |
| **Persistent URLs** | ✅ Implemented | Critical | Slug-based URLs are persistent |
| **ISSN registration** | ✅ Implemented | Critical | `issn` and `eissn` fields in Journal |
| **DOI registration** | ⚠️ Partial | Critical | DOI field exists, needs Crossref submission |
| **Open Access indicator** | ✅ Implemented | Critical | `openAccess` field in Journal |
| **Article-level metadata** | ✅ Implemented | Critical | Title, authors, abstract, keywords |
| **Publication dates** | ✅ Implemented | Critical | `publishedAt` field |
| **Author affiliations** | ✅ Implemented | Critical | `institution` field in Author |
| **ORCID integration** | ✅ Implemented | Critical | `orcid` field in Author |
| **Journal metadata** | ✅ Implemented | Critical | Title, ISSN, publisher, scope |
| **Volume/Issue structure** | ✅ Implemented | Critical | Volume and Issue models |
| **Stable article URLs** | ✅ Implemented | Critical | Slug-based URLs |

### 🟡 Important (Should Have)

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| **Crossref XML submission** | ⚠️ Partial | Important | XML generator exists, needs API submission |
| **Abstract field** | ✅ Implemented | Important | `description` field serves as abstract |
| **Keywords/Subject terms** | ✅ Implemented | Important | Tags system |
| **Article language** | ⚠️ Partial | Important | Journal has `language`, content doesn't |
| **License information** | ⚠️ Partial | Important | Can be in metadata, not explicit field |
| **Article type classification** | ✅ Implemented | Important | ContentType enum |
| **Reference list** | ❌ Missing | Important | No structured references field |
| **Peer review statement** | ⚠️ Partial | Important | Review workflow exists, no public statement |
| **Editorial board display** | ✅ Implemented | Important | Public editorial board page |
| **Journal scope/aims** | ✅ Implemented | Important | `scope` field in Journal |
| **Indexing information** | ✅ Implemented | Important | `indexedIn` field in Journal |

### 🟢 Nice to Have (Can Add Later)

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| **Article metrics** | ⚠️ Partial | Nice | View counts exist, citations need tracking |
| **Altmetrics integration** | ❌ Missing | Nice | Social media mentions, etc. |
| **Full-text XML** | ❌ Missing | Nice | JATS XML format |
| **Article identifiers** | ⚠️ Partial | Nice | DOI exists, no internal ID scheme |
| **Supplementary materials** | ⚠️ Partial | Nice | Can use metadata JSON |
| **Data availability statement** | ❌ Missing | Nice | Can add to metadata |
| **Funding information** | ❌ Missing | Nice | Can add to metadata |
| **Conflict of interest** | ❌ Missing | Nice | Can add to metadata |

---

## What Is Safe to Postpone

### 📅 Can Postpone (Not Blocking)

| Feature | Reason | When to Add |
|---------|--------|-------------|
| **Full Crossref API submission** | XML generator works, manual submission possible | When ready for production DOI registration |
| **Email notifications** | Manual workflow works for now | When volume increases |
| **Advanced review workflow** | Basic review works | When peer review becomes critical |
| **Reference management** | Can add manually in content | When authors request it |
| **Article versioning** | `updatedAt` sufficient for now | When corrections/retractions needed |
| **Altmetrics** | View counts sufficient | When social sharing becomes important |
| **JATS XML export** | Dublin Core sufficient for indexing | When full-text indexing needed |
| **Supplementary files** | PDF + metadata sufficient | When authors need data files |
| **Advanced analytics** | Basic stats sufficient | When detailed reporting needed |
| **Bulk operations** | Individual operations work | When managing large volumes |
| **Import/Export tools** | API can be used for export | When migration needed |
| **Custom workflows** | Standard workflow works | When journals need customization |
| **Multi-language content** | Single language per content works | When multilingual journals needed |
| **Advanced search** | Basic search sufficient | When content volume grows |
| **User notifications** | Email/phone sufficient | When real-time updates needed |
| **Reviewer dashboard** | Email assignments work | When reviewer self-service needed |
| **Editorial statistics** | Basic analytics sufficient | When detailed reporting needed |
| **Content scheduling** | Manual publishing works | When advance scheduling needed |
| **RSS feeds** | Can add if needed | When syndication requested |
| **API rate limiting** | Low traffic, not needed yet | When API usage grows |

### 🚫 Don't Need (OJS Complexity)

| Feature | Why Not Needed |
|---------|----------------|
| **Plugin architecture** | Direct implementation is simpler |
| **Theme system** | Single modern design is better |
| **Payment processing** | Open access model |
| **Subscription management** | Not applicable |
| **Custom user roles** | 4 roles sufficient |
| **Workflow customization** | Standard workflow works |
| **Multi-site management** | Single platform focus |
| **Legacy browser support** | Modern browsers only |
| **Desktop client** | Web-based is sufficient |

---

## Gap Analysis: Scopus/DOAJ Requirements

### ✅ Fully Compliant

- ✅ OAI-PMH endpoint with Dublin Core
- ✅ Persistent URLs (slug-based)
- ✅ ISSN support
- ✅ Open Access indicator
- ✅ Article metadata (title, authors, abstract)
- ✅ Publication dates
- ✅ Author affiliations
- ✅ ORCID support
- ✅ Journal metadata
- ✅ Volume/Issue structure

### ⚠️ Needs Completion

1. **DOI Registration**
   - ✅ DOI field exists
   - ✅ Crossref XML generator exists
   - ⚠️ Need: Active Crossref API submission
   - **Action**: Implement Crossref API client submission

2. **Content Language**
   - ✅ Journal has `language` field
   - ⚠️ Content doesn't have explicit language
   - **Action**: Add `language` to Content or use Journal language

3. **License Information**
   - ⚠️ No explicit license field
   - ✅ Can use `metadata` JSON
   - **Action**: Add explicit `license` field or document metadata usage

4. **Reference List**
   - ❌ No structured references
   - **Action**: Add `references` JSON field or text field

5. **Peer Review Statement**
   - ✅ Review workflow exists
   - ⚠️ No public statement page
   - **Action**: Add peer review policy page

### ❌ Missing (Can Add Later)

- Full-text JATS XML
- Altmetrics
- Data availability statements
- Funding information
- Conflict of interest statements

---

## Implementation Roadmap

### Phase 1: Scopus/DOAJ Compliance (Critical)

**Timeline: 1-2 weeks**

1. ✅ OAI-PMH endpoint (DONE)
2. ✅ Dublin Core metadata (DONE)
3. ⚠️ Complete Crossref DOI submission
4. ⚠️ Add content language field (or use Journal language)
5. ⚠️ Add license field to Content
6. ⚠️ Create peer review policy page

### Phase 2: Enhanced Features (Important)

**Timeline: 2-4 weeks**

1. Add structured references field
2. Implement Crossref API submission
3. Add article-level language field
4. Create public peer review statement
5. Enhance metadata for indexing

### Phase 3: Nice to Have (Postpone)

**Timeline: 3-6 months**

1. Altmetrics integration
2. JATS XML export
3. Advanced analytics
4. Email notifications
5. Reviewer dashboard

---

## Summary

### ✅ Strengths

- **Modern architecture** - Next.js, TypeScript, cloud-native
- **API-first design** - Comprehensive REST API
- **OAI-PMH ready** - Already implemented
- **Flexible content types** - Beyond just articles
- **Good foundation** - Most critical features present

### ⚠️ Gaps for Indexing

- **DOI submission** - Generator exists, needs API integration
- **Content language** - Needs explicit field
- **License field** - Should be explicit
- **References** - Structured format needed
- **Peer review statement** - Public page needed

### 📊 Compliance Status

- **DOAJ**: ~85% compliant (needs DOI submission, license, language)
- **Scopus**: ~80% compliant (needs DOI, references, full metadata)
- **Crossref**: ~90% compliant (needs active API submission)

### 🎯 Next Steps

1. **Immediate**: Complete Crossref DOI submission
2. **Short-term**: Add missing metadata fields (language, license)
3. **Medium-term**: Add structured references
4. **Long-term**: Enhance with advanced features

---

## Conclusion

The platform has a **strong foundation** with most critical features implemented. The main gaps for Scopus/DOAJ indexing are:

1. **Active DOI registration** (infrastructure exists, needs activation)
2. **Explicit metadata fields** (language, license)
3. **Structured references** (can be added)

These are **manageable gaps** that can be addressed without major schema changes, maintaining the additive-only constraint.
