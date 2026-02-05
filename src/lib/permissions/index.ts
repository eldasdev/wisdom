/**
 * Permission and Workflow System
 * 
 * Pure logical implementation - NO schema changes required
 * Uses existing UserRole enum and ContentStatus enum
 * 
 * This module provides permission checking functions based on:
 * - User role (ADMIN, EDITOR, REVIEWER, AUTHOR)
 * - Content status (DRAFT, REVIEW, PUBLISHED, ARCHIVED)
 * - Content ownership (via ContentAuthor relation)
 */

import { prisma } from '@/lib/prisma';
import { UserRole, ContentStatus } from '@prisma/client';

// Type definitions
type Action = 
  | 'create_content'
  | 'edit_content'
  | 'delete_content'
  | 'view_content'
  | 'submit_content'
  | 'withdraw_content'
  | 'publish_content'
  | 'archive_content'
  | 'assign_reviewer'
  | 'submit_review'
  | 'view_reviewer'
  | 'view_author'
  | 'approve_content'
  | 'reject_content'
  | 'request_revisions';

type ResourceType = 'content' | 'user' | 'journal' | 'review';

/**
 * Check if user owns content (via ContentAuthor relation)
 */
export async function isContentOwner(userId: string, contentId: string): Promise<boolean> {
  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        authors: {
          include: { author: true }
        }
      }
    });

    if (!content) return false;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) return false;

    // Check if user's email matches any author email
    return content.authors.some(ca => ca.author.email === user.email);
  } catch {
    return false;
  }
}

/**
 * Check if user is assigned as reviewer for content
 * (Uses existing Review model if it exists, otherwise returns false)
 */
export async function isAssignedReviewer(userId: string, contentId: string): Promise<boolean> {
  try {
    // Check if Review model exists and user is assigned
    // This checks the Review model if it exists in your schema
    // If Review model doesn't exist yet, this will return false
    const review = await (prisma as any).review?.findFirst({
      where: {
        contentId,
        reviewerId: userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] }
      }
    });

    return !!review;
  } catch {
    // If Review model doesn't exist yet, return false
    // This allows the permission system to work even without Review model
    return false;
  }
}

/**
 * Check if user can perform action on content
 */
export async function canPerformActionOnContent(
  userId: string,
  action: Action,
  contentId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  const role = user.role as UserRole;
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      authors: {
        include: { author: true }
      }
    }
  });

  if (!content) return false;

  const status = content.status as ContentStatus;
  const isOwner = await isContentOwner(userId, contentId);
  const isReviewer = await isAssignedReviewer(userId, contentId);

  // Admin can do everything
  if (role === 'ADMIN') return true;

  // Permission matrix by status and action
  const permissions: Record<ContentStatus, Record<Action, (role: UserRole, isOwner: boolean, isReviewer: boolean) => boolean>> = {
    DRAFT: {
      create_content: () => role === 'AUTHOR' || role === 'EDITOR' || role === 'ADMIN',
      edit_content: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner),
      delete_content: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner),
      view_content: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner),
      submit_content: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner),
      withdraw_content: () => false, // Cannot withdraw from DRAFT
      publish_content: () => role === 'EDITOR' || role === 'ADMIN',
      archive_content: () => role === 'EDITOR' || role === 'ADMIN',
      assign_reviewer: () => role === 'EDITOR' || role === 'ADMIN',
      submit_review: () => false, // No reviews in DRAFT
      view_reviewer: () => role === 'EDITOR' || role === 'ADMIN',
      view_author: () => true, // Everyone can see author
      approve_content: () => false, // Cannot approve DRAFT
      reject_content: () => false, // Cannot reject DRAFT
      request_revisions: () => false, // Cannot request revisions on DRAFT
    },
    REVIEW: {
      create_content: () => false, // Not applicable
      edit_content: () => role === 'EDITOR' || role === 'ADMIN',
      delete_content: () => role === 'EDITOR' || role === 'ADMIN',
      view_content: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner) || (role === 'REVIEWER' && isReviewer),
      submit_content: () => false, // Already in review
      withdraw_content: () => (role === 'AUTHOR' && isOwner) || role === 'EDITOR' || role === 'ADMIN',
      publish_content: () => role === 'EDITOR' || role === 'ADMIN',
      archive_content: () => role === 'EDITOR' || role === 'ADMIN',
      assign_reviewer: () => role === 'EDITOR' || role === 'ADMIN',
      submit_review: () => (role === 'REVIEWER' && isReviewer) || role === 'EDITOR' || role === 'ADMIN',
      view_reviewer: () => role === 'EDITOR' || role === 'ADMIN', // Author cannot see reviewer (single-blind)
      view_author: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'REVIEWER' && isReviewer), // Reviewer can see author (single-blind)
      approve_content: () => role === 'EDITOR' || role === 'ADMIN',
      reject_content: () => role === 'EDITOR' || role === 'ADMIN',
      request_revisions: () => role === 'EDITOR' || role === 'ADMIN',
    },
    PUBLISHED: {
      create_content: () => false, // Not applicable
      edit_content: () => role === 'EDITOR' || role === 'ADMIN', // Only metadata
      delete_content: () => false, // Cannot delete published, must archive
      view_content: () => true, // Public
      submit_content: () => false, // Already published
      withdraw_content: () => false, // Cannot withdraw published
      publish_content: () => false, // Already published
      archive_content: () => role === 'EDITOR' || role === 'ADMIN',
      assign_reviewer: () => false, // Not in review
      submit_review: () => false, // Not in review
      view_reviewer: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner), // Author can see after publication
      view_author: () => true, // Public
      approve_content: () => false, // Already published
      reject_content: () => false, // Already published
      request_revisions: () => false, // Already published
    },
    ARCHIVED: {
      create_content: () => false, // Not applicable
      edit_content: () => false, // Cannot edit archived
      delete_content: () => role === 'EDITOR' || role === 'ADMIN', // Permanent delete
      view_content: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner),
      submit_content: () => false, // Cannot submit archived
      withdraw_content: () => false, // Not applicable
      publish_content: () => role === 'EDITOR' || role === 'ADMIN', // Restore
      archive_content: () => false, // Already archived
      assign_reviewer: () => false, // Not applicable
      submit_review: () => false, // Not applicable
      view_reviewer: () => role === 'EDITOR' || role === 'ADMIN' || (role === 'AUTHOR' && isOwner),
      view_author: () => true, // Public
      approve_content: () => false, // Not applicable
      reject_content: () => false, // Not applicable
      request_revisions: () => false, // Not applicable
    },
  };

  const permissionCheck = permissions[status]?.[action];
  if (!permissionCheck) return false;

  return permissionCheck(role, isOwner, isReviewer);
}

/**
 * Check if user can perform general action
 */
export async function canPerformAction(
  userId: string,
  action: Action,
  resourceType: ResourceType,
  resourceId?: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  const role = user.role as UserRole;

  // Admin can do everything
  if (role === 'ADMIN') return true;

  // Resource-specific checks
  if (resourceType === 'content' && resourceId) {
    return canPerformActionOnContent(userId, action, resourceId);
  }

  // General permission matrix
  const generalPermissions: Record<Action, (role: UserRole) => boolean> = {
    create_content: (r) => r === 'AUTHOR' || r === 'EDITOR' || r === 'ADMIN',
    edit_content: (r) => r === 'EDITOR' || r === 'ADMIN',
    delete_content: (r) => r === 'EDITOR' || r === 'ADMIN',
    view_content: () => true, // Public content
    submit_content: (r) => r === 'AUTHOR' || r === 'EDITOR' || r === 'ADMIN',
    withdraw_content: (r) => r === 'AUTHOR' || r === 'EDITOR' || r === 'ADMIN',
    publish_content: (r) => r === 'EDITOR' || r === 'ADMIN',
    archive_content: (r) => r === 'EDITOR' || r === 'ADMIN',
    assign_reviewer: (r) => r === 'EDITOR' || r === 'ADMIN',
    submit_review: (r) => r === 'REVIEWER' || r === 'EDITOR' || r === 'ADMIN',
    view_reviewer: (r) => r === 'EDITOR' || r === 'ADMIN',
    view_author: () => true, // Generally visible
    approve_content: (r) => r === 'EDITOR' || r === 'ADMIN',
    reject_content: (r) => r === 'EDITOR' || r === 'ADMIN',
    request_revisions: (r) => r === 'EDITOR' || r === 'ADMIN',
  };

  const permissionCheck = generalPermissions[action];
  return permissionCheck ? permissionCheck(role) : false;
}

/**
 * Get all actions user can perform on content
 */
export async function getAllowedActions(
  userId: string,
  contentId: string
): Promise<Action[]> {
  const actions: Action[] = [
    'create_content',
    'edit_content',
    'delete_content',
    'view_content',
    'submit_content',
    'withdraw_content',
    'publish_content',
    'archive_content',
    'assign_reviewer',
    'submit_review',
    'view_reviewer',
    'view_author',
    'approve_content',
    'reject_content',
    'request_revisions',
  ];

  const allowed: Action[] = [];
  for (const action of actions) {
    if (await canPerformActionOnContent(userId, action, contentId)) {
      allowed.push(action);
    }
  }

  return allowed;
}

/**
 * Check reviewer anonymity (single-blind vs double-blind)
 * Returns whether reviewer can see author identity
 */
export function canReviewerSeeAuthor(reviewMode: 'single' | 'double' = 'single'): boolean {
  return reviewMode === 'single';
}

/**
 * Check if author can see reviewer identity
 * In single-blind and double-blind, author cannot see reviewer
 */
export function canAuthorSeeReviewer(): boolean {
  return false; // Always false - reviewers are anonymous to authors
}

/**
 * Check if user can view reviewer assignment
 */
export async function canViewReviewerAssignment(
  userId: string,
  contentId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;

  const role = user.role as UserRole;

  // Editors and admins can always see
  if (role === 'ADMIN' || role === 'EDITOR') return true;

  // Reviewer can see own assignment
  if (role === 'REVIEWER') {
    return await isAssignedReviewer(userId, contentId);
  }

  // Author cannot see reviewer identity (single-blind)
  if (role === 'AUTHOR') {
    const isOwner = await isContentOwner(userId, contentId);
    // Author can see reviewer after content is published
    const content = await prisma.content.findUnique({ where: { id: contentId } });
    return isOwner && content?.status === 'PUBLISHED';
  }

  return false;
}
