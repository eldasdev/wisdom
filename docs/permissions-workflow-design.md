# Permission and Workflow Layer Design

## Overview

This document defines a **pure logical permission and workflow system** built on top of existing roles and content statuses. **No schema changes** are required - this is implemented as application logic only.

---

## What Remains Untouched

- **All existing models** (User, Content, Author, Journal, etc.)
- **All existing enums** (UserRole, ContentStatus, ContentType, etc.)
- **All existing fields** and relations
- **NextAuth configuration** - no changes to auth system
- **Database schema** - no migrations required

---

## Role Definitions

Based on existing `UserRole` enum:

| Role | Description | Primary Responsibility |
|------|-------------|----------------------|
| **ADMIN** | System administrator | Full platform control, user management, system settings |
| **EDITOR** | Editorial staff | Content review, assignment, editorial decisions |
| **REVIEWER** | Peer reviewer | Review submissions, provide feedback (anonymous) |
| **AUTHOR** | Content creator | Create, edit, submit content |

---

## Permission Matrix: Role vs Action

### Content Actions

| Action | ADMIN | EDITOR | REVIEWER | AUTHOR |
|--------|-------|--------|----------|--------|
| **Create Content** | ✅ | ✅ | ❌ | ✅ |
| **Edit Own Content** | ✅ | ✅ | ❌ | ✅ (own only) |
| **Edit Any Content** | ✅ | ✅ | ❌ | ❌ |
| **Delete Own Content** | ✅ | ✅ | ❌ | ✅ (DRAFT only) |
| **Delete Any Content** | ✅ | ✅ | ❌ | ❌ |
| **View Own Content** | ✅ | ✅ | ❌ | ✅ |
| **View Any Content** | ✅ | ✅ | ✅ (assigned) | ❌ |
| **Submit for Review** | ✅ | ✅ | ❌ | ✅ (own only) |
| **Withdraw Submission** | ✅ | ✅ | ❌ | ✅ (own, REVIEW only) |
| **Publish Content** | ✅ | ✅ | ❌ | ❌ |
| **Archive Content** | ✅ | ✅ | ❌ | ❌ |
| **Feature Content** | ✅ | ✅ | ❌ | ❌ |

### Review Actions

| Action | ADMIN | EDITOR | REVIEWER | AUTHOR |
|--------|-------|--------|----------|--------|
| **Assign Reviewer** | ✅ | ✅ | ❌ | ❌ |
| **View Review Assignment** | ✅ | ✅ | ✅ (own) | ❌ |
| **Accept Review Request** | ✅ | ✅ | ✅ | ❌ |
| **Decline Review Request** | ✅ | ✅ | ✅ | ❌ |
| **Submit Review** | ✅ | ✅ | ✅ (assigned) | ❌ |
| **View Review Comments** | ✅ | ✅ | ✅ (own) | ✅ (own content) |
| **View Reviewer Identity** | ✅ | ✅ | ❌ | ❌ |
| **View Author Identity** | ✅ | ✅ | ✅ (assigned) | ✅ (own) |

### Editorial Actions

| Action | ADMIN | EDITOR | REVIEWER | AUTHOR |
|--------|-------|--------|----------|--------|
| **Approve Content** | ✅ | ✅ | ❌ | ❌ |
| **Reject Content** | ✅ | ✅ | ❌ | ❌ |
| **Request Revisions** | ✅ | ✅ | ❌ | ❌ |
| **Assign to Journal** | ✅ | ✅ | ❌ | ❌ |
| **Assign to Issue** | ✅ | ✅ | ❌ | ❌ |
| **Set Publication Date** | ✅ | ✅ | ❌ | ❌ |
| **Manage Editorial Board** | ✅ | ✅ | ❌ | ❌ |

### User Management Actions

| Action | ADMIN | EDITOR | REVIEWER | AUTHOR |
|--------|-------|--------|----------|--------|
| **Create User** | ✅ | ❌ | ❌ | ❌ |
| **Edit User** | ✅ | ❌ | ❌ | ❌ (own only) |
| **Delete User** | ✅ | ❌ | ❌ | ❌ |
| **Change User Role** | ✅ | ❌ | ❌ | ❌ |
| **View All Users** | ✅ | ✅ | ❌ | ❌ |
| **View User Profile** | ✅ | ✅ | ✅ (limited) | ✅ (own only) |

### System Actions

| Action | ADMIN | EDITOR | REVIEWER | AUTHOR |
|--------|-------|--------|----------|--------|
| **Manage Journals** | ✅ | ✅ | ❌ | ❌ |
| **Manage Tags** | ✅ | ✅ | ❌ | ❌ |
| **View Analytics** | ✅ | ✅ | ❌ | ❌ (own only) |
| **Export Data** | ✅ | ✅ | ❌ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ | ❌ |

---

## Submission Lifecycle Permissions

### Lifecycle States (using existing `ContentStatus` enum)

```
DRAFT → REVIEW → PUBLISHED → ARCHIVED
```

### State Transitions and Permissions

#### 1. DRAFT State

**Who can access:**
- **AUTHOR**: Full access to own content
- **EDITOR**: View and edit any content
- **ADMIN**: Full access to any content
- **REVIEWER**: No access

**Allowed Actions:**
- ✅ AUTHOR: Create, edit, delete own content
- ✅ EDITOR: Edit any content, assign to journal/issue
- ✅ ADMIN: All actions
- ✅ AUTHOR: Submit for review (changes status to REVIEW)

**Restrictions:**
- ❌ Cannot publish from DRAFT (must go through REVIEW)
- ❌ REVIEWER cannot view DRAFT content

#### 2. REVIEW State

**Who can access:**
- **AUTHOR**: View own content, cannot edit
- **EDITOR**: Full access to any content
- **ADMIN**: Full access to any content
- **REVIEWER**: View assigned content only

**Allowed Actions:**
- ✅ AUTHOR: View own content, withdraw submission (back to DRAFT)
- ✅ EDITOR: Assign reviewers, make editorial decisions
- ✅ ADMIN: All actions
- ✅ REVIEWER: Submit review for assigned content
- ✅ EDITOR: Approve → PUBLISHED
- ✅ EDITOR: Reject → DRAFT (with comments)
- ✅ EDITOR: Request revisions → DRAFT (with comments)

**Restrictions:**
- ❌ AUTHOR cannot edit content in REVIEW
- ❌ REVIEWER can only see assigned content
- ❌ REVIEWER cannot see author identity (anonymous review)

#### 3. PUBLISHED State

**Who can access:**
- **AUTHOR**: View own content
- **EDITOR**: Full access to any content
- **ADMIN**: Full access to any content
- **REVIEWER**: View any published content (public)
- **Public**: View published content (no auth required)

**Allowed Actions:**
- ✅ AUTHOR: View own content, view statistics
- ✅ EDITOR: Edit metadata, archive content
- ✅ ADMIN: All actions
- ✅ EDITOR: Archive → ARCHIVED
- ✅ EDITOR: Update metadata (title, description, tags)

**Restrictions:**
- ❌ AUTHOR cannot edit published content
- ❌ Cannot delete published content (must archive first)
- ❌ Cannot revert to REVIEW or DRAFT

#### 4. ARCHIVED State

**Who can access:**
- **AUTHOR**: View own archived content
- **EDITOR**: Full access to any archived content
- **ADMIN**: Full access to any archived content
- **REVIEWER**: No access
- **Public**: View archived content (if archive page is public)

**Allowed Actions:**
- ✅ AUTHOR: View own archived content
- ✅ EDITOR: Restore to PUBLISHED, permanently delete
- ✅ ADMIN: All actions

**Restrictions:**
- ❌ Cannot edit archived content
- ❌ Cannot submit archived content for review
- ❌ REVIEWER cannot access archived content

---

## Reviewer Anonymity Rules

### Single-Blind Review (Default)

**Reviewer Identity:**
- ❌ **Hidden from AUTHOR** - Author cannot see reviewer names
- ✅ **Visible to EDITOR** - Editor can see reviewer assignments
- ✅ **Visible to ADMIN** - Admin can see all reviewer information
- ✅ **Visible to REVIEWER** - Reviewer can see own identity

**Author Identity:**
- ✅ **Visible to REVIEWER** - Reviewer can see author name
- ✅ **Visible to EDITOR** - Editor can see author
- ✅ **Visible to ADMIN** - Admin can see author

**Review Content:**
- ✅ **Visible to REVIEWER** - Reviewer can see full content
- ✅ **Visible to AUTHOR** - Author can see review comments after decision
- ✅ **Visible to EDITOR** - Editor can see all reviews

### Double-Blind Review (Optional - Logic Only)

**Reviewer Identity:**
- ❌ **Hidden from AUTHOR** - Author cannot see reviewer names
- ✅ **Visible to EDITOR** - Editor can see reviewer assignments
- ✅ **Visible to ADMIN** - Admin can see all reviewer information
- ✅ **Visible to REVIEWER** - Reviewer can see own identity

**Author Identity:**
- ❌ **Hidden from REVIEWER** - Reviewer cannot see author name
- ✅ **Visible to EDITOR** - Editor can see author
- ✅ **Visible to ADMIN** - Admin can see author

**Review Content:**
- ✅ **Visible to REVIEWER** - Reviewer can see content (author info redacted)
- ✅ **Visible to AUTHOR** - Author can see review comments after decision
- ✅ **Visible to EDITOR** - Editor can see all reviews

### Implementation Logic (No Schema Changes)

**Single-Blind Check:**
```typescript
// Reviewer can see author
const canReviewerSeeAuthor = (reviewMode: 'single' | 'double') => {
  return reviewMode === 'single';
};

// Author can see reviewer
const canAuthorSeeReviewer = () => {
  return false; // Always false - single-blind
};
```

**Double-Blind Check:**
```typescript
// Reviewer cannot see author
const canReviewerSeeAuthor = (reviewMode: 'single' | 'double') => {
  return false; // Always false for double-blind
};

// Author cannot see reviewer
const canAuthorSeeReviewer = () => {
  return false; // Always false
};
```

**Review Assignment Visibility:**
```typescript
// Who can see reviewer assignments
const canViewReviewerAssignment = (userRole: UserRole, contentAuthorId: string, userId: string) => {
  if (userRole === 'ADMIN' || userRole === 'EDITOR') {
    return true; // Editors and admins can always see
  }
  if (userRole === 'REVIEWER' && isAssignedReviewer(userId, contentId)) {
    return true; // Reviewer can see own assignment
  }
  if (userRole === 'AUTHOR' && contentAuthorId === userId) {
    return false; // Author cannot see reviewer identity
  }
  return false;
};
```

---

## Workflow State Machine

### Content Status Transitions

```
┌─────────┐
│  DRAFT  │
└────┬────┘
     │ AUTHOR submits
     ▼
┌─────────┐
│ REVIEW  │
└────┬────┘
     │
     ├─► EDITOR approves ──► ┌──────────┐
     │                        │PUBLISHED │
     │                        └────┬─────┘
     │                             │
     │                             │ EDITOR archives
     │                             ▼
     │                        ┌──────────┐
     │                        │ ARCHIVED  │
     │                        └──────────┘
     │
     ├─► EDITOR rejects ──► ┌─────────┐
     │                       │  DRAFT  │
     │                       └─────────┘
     │
     └─► EDITOR requests revisions ──► ┌─────────┐
                                       │  DRAFT  │
                                       └─────────┘
```

### Permission-Based Transitions

| Transition | Who Can Do It | Required Conditions |
|------------|---------------|-------------------|
| DRAFT → REVIEW | AUTHOR (own), EDITOR, ADMIN | Content must have title, description, at least one author |
| REVIEW → PUBLISHED | EDITOR, ADMIN | At least one review completed (optional) |
| REVIEW → DRAFT | EDITOR, ADMIN, AUTHOR (own, withdraw) | With rejection comments (if editor) |
| PUBLISHED → ARCHIVED | EDITOR, ADMIN | No conditions |
| ARCHIVED → PUBLISHED | EDITOR, ADMIN | No conditions |

---

## Content Ownership Rules

### Ownership Definition

**Content is "owned" by:**
- The user who created it (if AUTHOR role)
- Any user listed as an author via `ContentAuthor` relation

### Ownership Checks

```typescript
// Check if user owns content
const isContentOwner = async (userId: string, contentId: string): Promise<boolean> => {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      authors: {
        include: { author: true }
      }
    }
  });
  
  if (!content) return false;
  
  // Check if user is in authors list (via email match)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  
  return content.authors.some(ca => ca.author.email === user.email);
};
```

### Ownership-Based Permissions

| Action | Owner | Non-Owner (EDITOR/ADMIN) |
|--------|-------|-------------------------|
| Edit in DRAFT | ✅ Full edit | ✅ Full edit |
| Edit in REVIEW | ❌ No edit | ✅ Can edit |
| Delete in DRAFT | ✅ Can delete | ✅ Can delete |
| Delete in PUBLISHED | ❌ Cannot delete | ✅ Can archive |
| Withdraw from REVIEW | ✅ Can withdraw | ✅ Can reject |

---

## Implementation Guidelines

### Permission Check Function

```typescript
// Example permission check (pure logic, no schema changes)
export async function canPerformAction(
  userId: string,
  action: string,
  resourceType: 'content' | 'user' | 'journal',
  resourceId?: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  
  const role = user.role as 'ADMIN' | 'EDITOR' | 'REVIEWER' | 'AUTHOR';
  
  // Admin can do everything
  if (role === 'ADMIN') return true;
  
  // Check action-specific permissions
  switch (action) {
    case 'edit_content':
      if (role === 'EDITOR') return true;
      if (role === 'AUTHOR' && resourceId) {
        return await isContentOwner(userId, resourceId);
      }
      return false;
      
    case 'assign_reviewer':
      return role === 'EDITOR';
      
    case 'submit_review':
      if (role === 'REVIEWER' && resourceId) {
        return await isAssignedReviewer(userId, resourceId);
      }
      return false;
      
    // ... more actions
  }
  
  return false;
}
```

### Status-Based Permission Check

```typescript
// Check if user can perform action on content in specific status
export async function canPerformActionOnContent(
  userId: string,
  action: string,
  contentId: string
): Promise<boolean> {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: { authors: { include: { author: true } } }
  });
  
  if (!content) return false;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  
  const role = user.role as 'ADMIN' | 'EDITOR' | 'REVIEWER' | 'AUTHOR';
  const status = content.status;
  const isOwner = await isContentOwner(userId, contentId);
  
  // Status-based permission matrix
  const permissions: Record<string, Record<string, boolean>> = {
    DRAFT: {
      edit: role === 'ADMIN' || role === 'EDITOR' || (role === 'AUTHOR' && isOwner),
      delete: role === 'ADMIN' || role === 'EDITOR' || (role === 'AUTHOR' && isOwner),
      submit: role === 'ADMIN' || role === 'EDITOR' || (role === 'AUTHOR' && isOwner),
    },
    REVIEW: {
      edit: role === 'ADMIN' || role === 'EDITOR',
      view: role === 'ADMIN' || role === 'EDITOR' || (role === 'AUTHOR' && isOwner) || (role === 'REVIEWER' && await isAssignedReviewer(userId, contentId)),
      withdraw: (role === 'AUTHOR' && isOwner) || role === 'EDITOR' || role === 'ADMIN',
    },
    PUBLISHED: {
      edit_metadata: role === 'ADMIN' || role === 'EDITOR',
      archive: role === 'ADMIN' || role === 'EDITOR',
      view: true, // Public
    },
    ARCHIVED: {
      restore: role === 'ADMIN' || role === 'EDITOR',
      view: role === 'ADMIN' || role === 'EDITOR' || (role === 'AUTHOR' && isOwner),
    },
  };
  
  return permissions[status]?.[action] ?? false;
}
```

---

## Summary

This permission and workflow system:

✅ **No schema changes** - Pure application logic  
✅ **Uses existing roles** - ADMIN, EDITOR, REVIEWER, AUTHOR  
✅ **Uses existing statuses** - DRAFT, REVIEW, PUBLISHED, ARCHIVED  
✅ **Backward compatible** - All existing content and users work  
✅ **Flexible** - Can be extended with additional logic  
✅ **Secure** - Permission checks at application layer  

The system can be implemented as utility functions and middleware without any database migrations or schema modifications.
