export enum Template {
  // Authentication
  RegisteredAsGuest = 'registered_as_guest',
  EmailVerification = 'email_varification',
  ForgotPassword = "forgot_password",
  EmailVerified = 'email_verified',
  PasswordReset = 'password_reset',
  PasswordChanged = 'password_changed',
  AccountDeactivated = 'account_deactivated',
  AccountReactivated = 'account_reactivated',

  // Blog
  BlogSubmitted = 'blog_submitted',
  BlogPublished = 'blog_published',
  BlogUnpublished = 'blog_unpublished',
  BlogCommented = 'blog_commented',
  BlogCommentReplyed = 'blog_comment_replied',
  BlogCommentLiked = 'blog_comment_liked',
  BlogCommentDisliked = 'blog_comment_disliked',
  BlogLiked = 'blog_liked',
  BlogDisliked = 'blog_disliked',

  // Committee
  CommitteeMemberAdded = 'committee_member_added',
  CommitteeMemberRemoved = 'committee_member_removed',
  CommitteeMemberRoleChanged = 'committee_member_role_changed',

  // Event
  EventRegistrationConfirmed = 'event_registration_confirmed',
  EventRegistrationCancelled = 'event_registration_cancelled',
  EventRegistrationWaitlisted = 'event_registration_waitlisted',

  // Invoice
  InvoiceCreated = 'invoice_created',
  InvoicePaid = 'invoice_paid',

  // Member
  MemberCreated = 'member_created',

  // Membership
  MembershipSubmitted = 'membership_submitted',
  MembershipApproved = 'membership_approved',
  MembershipRejected = 'membership_rejected',

  // Notice
  NoticePublished = 'notice_published',
}
