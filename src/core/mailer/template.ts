export enum Template {
    // Membershi request
    MEMBERSHIP_REQUESTED = 'membership_requested',
    MEMBERSHIP_REQUEST_IN_PROGRESS = 'membership_request_in_progress',
    MEMBERSHIP_REQUEST_VALIDATED = 'membership_request_validated',
    MEMBERSHIP_REQUEST_APPROVED = 'membership_request_approved',
    MEMBERSHIP_REQUEST_REJECTED = 'membership_request_rejected',

    // User account
    RECOVER_PASSWORD = 'recover_password',
    RESET_PASSWORD = 'reset_password',

    // Member
    MEMBER_BLOCKED = 'member_blocked',
    MEMBER_UNBLOCKED = 'member_unblocked',
    MEMBER_ROLE_ASSIGNED = 'member_role_assigned',
    MEMBER_ROLE_REMOVED = 'member_role_removed',

    // Payment
    PAYMENT_INVOICE_CREATED = 'payment_invoice_created',
    PAYMENT_INVOICE_PAID = 'payment_invoice_paid',
    PAYMENT_INVOICE_REMINDER = 'payment_invoice_reminder',
    PAYMENT_INVOICE_REFUNDED = 'payment_invoice_refunded',

    // Event
    EVENT_REGISTRATION_CONFIRMED = 'event_registration_confirmed',
    EVENT_REGISTRATION_CANCELLED = 'event_registration_cancelled',
    EVENT_REMINDER = 'event_reminder',
    EVENT_FEEDBACK_REQUEST = 'event_feedback_request',

    // Newsletter
    NEWSLETTER_SUBSCRIPTION_CONFIRMED = 'newsletter_subscription_confirmed',
    NEWSLETTER_SUBSCRIPTION_UNSUBSCRIBED = 'newsletter_subscription_unsubscribed',

    // General
    GENERAL_WELCOME = 'welcome',
    GENERAL_GOODBYE = 'goodbye',

    // Greetings
    GREETING_BIRTHDAY = 'greeting_birthday',
    GREETING_NEW_YEAR = 'greeting_new_year',
    GREETINGS_EID_UL_FITR = 'greeting_eid_ul_fitr',
    GREETINGS_EID_UL_ADHA = 'greeting_eid_ul_adha',

    // Meetup
    MEETUP_INVITATION = 'meetup_invitation',
    MEETUP_REMINDER = 'meetup_reminder',
    MEETUP_FOLLOW_UP = 'meetup_follow_up',
    MEETUP_FEEDBACK_REQUEST = 'meetup_feedback_request',
}