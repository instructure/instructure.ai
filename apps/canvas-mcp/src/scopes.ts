export const SCOPE_MANIFEST = `https://sso.canvaslms.com/all-client-scopes
url:GET|/api/quiz/v1/courses/:course_id/quizzes
url:GET|/api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items
url:GET|/api/v1/accounts
url:GET|/api/v1/accounts/:account_id/courses
url:GET|/api/v1/accounts/:account_id/groups
url:GET|/api/v1/accounts/:account_id/sub_accounts
url:GET|/api/v1/accounts/:account_id/users
url:GET|/api/v1/conversations
url:GET|/api/v1/conversations/:id
url:GET|/api/v1/courses
url:GET|/api/v1/courses/:course_id/assignment_groups
url:GET|/api/v1/courses/:course_id/assignments
url:GET|/api/v1/courses/:course_id/assignments/:assignment_id/submissions
url:GET|/api/v1/courses/:course_id/assignments/:id
url:GET|/api/v1/courses/:course_id/assignments/overrides
url:GET|/api/v1/courses/:course_id/bulk_user_progress
url:GET|/api/v1/courses/:course_id/content_exports
url:GET|/api/v1/courses/:course_id/content_exports/:id
url:GET|/api/v1/courses/:course_id/discussion_topics
url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id
url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries
url:GET|/api/v1/courses/:course_id/discussion_topics/:topic_id/entries/:entry_id/replies
url:GET|/api/v1/courses/:course_id/enrollments
url:GET|/api/v1/courses/:course_id/files
url:GET|/api/v1/courses/:course_id/group_categories
url:GET|/api/v1/courses/:course_id/groups
url:GET|/api/v1/courses/:course_id/modules
url:GET|/api/v1/courses/:course_id/modules/:context_module_id/assignment_overrides
url:GET|/api/v1/courses/:course_id/modules/:id
url:GET|/api/v1/courses/:course_id/modules/:module_id/items
url:GET|/api/v1/courses/:course_id/modules/:module_id/items/:id
url:GET|/api/v1/courses/:course_id/outcome_groups
url:GET|/api/v1/courses/:course_id/outcome_results
url:GET|/api/v1/courses/:course_id/outcome_rollups
url:GET|/api/v1/courses/:course_id/pages
url:GET|/api/v1/courses/:course_id/pages/:url_or_id
url:GET|/api/v1/courses/:course_id/quizzes
url:GET|/api/v1/courses/:course_id/quizzes/:id
url:GET|/api/v1/courses/:course_id/quizzes/:quiz_id/statistics
url:GET|/api/v1/courses/:course_id/rubrics
url:GET|/api/v1/courses/:course_id/rubrics/:id
url:GET|/api/v1/courses/:course_id/rubrics/:id/used_locations
url:GET|/api/v1/courses/:course_id/search_users
url:GET|/api/v1/courses/:course_id/settings
url:GET|/api/v1/courses/:course_id/students
url:GET|/api/v1/courses/:course_id/students/submissions
url:GET|/api/v1/courses/:course_id/users
url:GET|/api/v1/courses/:id
url:GET|/api/v1/search/recipients
url:GET|/api/v1/users/:user_id/courses
url:GET|/api/v1/users/:user_id/profile
url:POST|/api/quiz/v1/courses/:course_id/quizzes/:assignment_id/accommodations
url:POST|/api/v1/accounts/:account_id/external_tools
url:POST|/api/v1/conversations
url:POST|/api/v1/conversations/:id/add_message
url:POST|/api/v1/conversations/:id/add_recipients
url:POST|/api/v1/conversations/:id/remove_messages
url:POST|/api/v1/courses/:course_id/assignments
url:POST|/api/v1/courses/:course_id/assignments/:assignment_id/duplicate
url:POST|/api/v1/courses/:course_id/assignments/:assignment_id/overrides
url:POST|/api/v1/courses/:course_id/assignments/overrides
url:POST|/api/v1/courses/:course_id/content_exports
url:POST|/api/v1/courses/:course_id/discussion_topics
url:POST|/api/v1/courses/:course_id/discussion_topics/:topic_id/duplicate
url:POST|/api/v1/courses/:course_id/external_tools
url:POST|/api/v1/courses/:course_id/group_categories
url:POST|/api/v1/courses/:course_id/group_categories/bulk_manage_differentiation_tag
url:POST|/api/v1/courses/:course_id/modules
url:POST|/api/v1/courses/:course_id/modules/:module_id/items
url:POST|/api/v1/courses/:course_id/pages
url:POST|/api/v1/courses/:course_id/pages/:url_or_id/duplicate
url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/extensions
url:POST|/api/v1/courses/:course_id/quizzes/:quiz_id/questions
url:POST|/api/v1/courses/:course_id/rubric_associations
url:POST|/api/v1/courses/:course_id/rubrics
url:POST|/api/v1/group_categories/:group_category_id/groups
url:POST|/api/v1/groups
url:POST|/api/v1/groups/:group_id/memberships
url:PUT|/api/v1/conversations/:id
url:PUT|/api/v1/courses/:course_id/assignments/:id
url:PUT|/api/v1/courses/:course_id/assignments/bulk_update
url:PUT|/api/v1/courses/:course_id/assignments/overrides
url:PUT|/api/v1/courses/:course_id/discussion_topics/:topic_id
url:PUT|/api/v1/courses/:course_id/modules/:context_module_id/assignment_overrides
url:PUT|/api/v1/courses/:course_id/modules/:id
url:PUT|/api/v1/courses/:course_id/modules/:id/relock
url:PUT|/api/v1/courses/:course_id/modules/:module_id/items/:id
url:PUT|/api/v1/courses/:course_id/modules/:module_id/items/:id/done
url:PUT|/api/v1/courses/:course_id/pages/:url_or_id
url:PUT|/api/v1/courses/:course_id/quizzes/:id
url:PUT|/api/v1/courses/:course_id/rubrics/:id
url:PUT|/api/v1/groups/:group_id
url:PATCH|/api/quiz/v1/courses/:course_id/quizzes/:assignment_id/items/:item_id
url:DELETE|/api/v1/conversations/:id
url:DELETE|/api/v1/courses/:course_id/assignments/:assignment_id/overrides/:id
url:DELETE|/api/v1/courses/:course_id/discussion_topics/:topic_id
url:DELETE|/api/v1/courses/:course_id/modules/:id
url:DELETE|/api/v1/courses/:course_id/modules/:module_id/items/:id
url:DELETE|/api/v1/courses/:course_id/quizzes/:id
url:DELETE|/api/v1/courses/:course_id/quizzes/:quiz_id/questions/:id
url:DELETE|/api/v1/courses/:course_id/rubric_associations/:id
url:DELETE|/api/v1/courses/:course_id/rubrics/:id
url:DELETE|/api/v1/groups/:group_id
url:DELETE|/api/v1/groups/:group_id/users/:user_id
url:POST|/api/v1/oauth2/introspect`;

// A maintainer with Maple access must supply provenance before production use.
export const SCOPE_PROVENANCE: {
	status: "unreviewed" | "reviewed";
	mapleRevision: string | null;
	generatedAt: string | null;
	reviewedAt: string | null;
} = { status: "unreviewed", mapleRevision: null, generatedAt: null, reviewedAt: null };

export function scopeManifestReady(): boolean {
	const { status, mapleRevision, generatedAt, reviewedAt } = SCOPE_PROVENANCE;
	return status === "reviewed" && Boolean(mapleRevision && generatedAt && reviewedAt);
}
