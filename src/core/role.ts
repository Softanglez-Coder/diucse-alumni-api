export enum Role {
  /**
   * Can do everything, including managing users and settings.
   * This role is typically reserved for the system administrator.
   * It has the highest level of access and control over the system.
   * It can create, read, update, and delete any resource.
   * It can also manage roles and permissions for other users.
   * This role should be assigned with caution, as it has the power to change system settings and configurations.
   */
  SuperAdmin = 'super_admin',

  /**
   * Can do everything, including managing users and settings.
   * This role is typically reserved for the system administrator.
   * It has the highest level of access and control over the system.
   * It can create, read, update, and delete any resource.
   * It can also manage roles and permissions for other users.
   * This role should be assigned with caution, as it has the power to change system settings and configurations.
   *
   * In this application, this role should be assinged to
   * president, vice-president, secretary of current board of directors.
   */
  Admin = 'admin',

  /**
   * Can manage every opration related to finance.
   * This role is responsible for overseeing financial transactions,
   * budgeting, and financial reporting.
   * It can create, read, update, and delete financial records.
   * It can also manage financial reports and budgets.
   * This role is typically assigned to the accountant, trasourar or financial manager.
   */
  Accountant = 'accountant',

  /**
   * Can send mails, manage newsletters, and handle marketing campaigns.
   * This role is responsible for creating and managing marketing content,
   * including newsletters, promotional materials, and campaigns.
   * It can create, read, update, and delete marketing content.
   */
  MarketingManager = 'marketing_manager',

  /**
   * Responsible for ecommerce oprations, ticket sales, and other sales-related activities.
   * This role can create, read, update, and delete sales records.
   * It can also manage sales reports and customer interactions.
   * This role is typically assigned to sales representatives, sales managers, or sales directors.
   */
  SalesManager = 'sales_manager',

  /**
   * Responsible for managing events, including planning, organizing, and executing events.
   * This role can create, read, update, and delete event details.
   * It can also manage event registrations, schedules, and resources.
   * This role is typically assigned to event coordinators or managers.
   */
  EventManager = 'event_manager',

  /**
   * Responsible for resolving and managing customer inquiries, issues, and feedback.
   * This role can read, update, and delete customer support tickets.
   * It can also manage customer feedback and inquiries.
   * This role is typically assigned to customer support representatives or managers.
   */
  CustomerSupport = 'customer_support',

  /**
   * Responsible for new member request review, approval, and rejection.
   * This role can read, update member requests.
   */
  Reviewer = 'reviewer',

  /**
   * Responsible for managing content on the platform.
   * This role can create, read, update, and delete content such as blogs, news, notices, and other informational resources.
   * It can also manage content categories and tags.
   * This role is typically assigned to content editors, or managers.
   */
  Publisher = 'publisher',

  /**
   * This role is for regular users who can access the system
   * but have limited permissions.
   * Members can create, read, and update their own resources,
   * but they cannot delete resources or manage other users.
   * This role is typically assigned to general users of the system.
   *
   * If no role is assigned to a user, they will be assigned this role by default.
   */
  Member = 'member',

  /**
   * This role is for users who can access the system
   * but have no permissions.
   * This role is typically assigned to users who are not yet registered or have not been assigned a role.
   * Users with this role can only read public resources.
   */
  Guest = 'guest',
}
