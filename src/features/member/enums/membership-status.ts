export enum MembershipStatus {
    /**
     * The membership is in draft state, not yet submitted for review.
     * This status is typically used when a member is still filling out their application.
     * It allows members to save their progress without submitting.
     * Members can edit their application until they submit it for review.
     */
    Draft = "draft",

    /**
     * The membership application has been submitted for review.
     * At this stage, the application is under review by the membership committee or relevant authority.
     * Members cannot make changes to their application while it is in this state.
     * The application will be evaluated based on the criteria set by the organization.
     */
    Applied = "applied",

    /**
     * The membership application is currently under review.
     * This status indicates that the application has been received and is being processed.
     * The membership committee may request additional information or clarification during this stage.
     * Members may be notified of any updates or requests for information.
     */
    InReview = "in_review",

    /**
     * Additional information is required from the member to proceed with the application.
     * This status is used when the membership committee needs more details or clarification on certain aspects of the application.
     * Members will be notified of the specific information needed and must provide it to continue the review process.
     * If the required information is not provided, the application may be delayed or rejected.
     */
    InformationRequired = "information_required",

    /**
     * The membership application requires payment to proceed.
     * This status indicates that the member must complete a payment process before the application can be approved.
     * Members will be provided with payment details and instructions.
     * If the payment is not completed within a specified timeframe, the application may be delayed or rejected.
     * 
     * If payment is not required, reviewers can skip this step and procceed to approval or rejection.
     */
    PaymentRequired = "payment_required",

    /**
     * The membership application has been approved.
     * This status indicates that the member has successfully met all requirements and criteria for membership.
     * Members will receive confirmation of their membership status and any relevant details or next steps.
     * Approved members may gain access to member-only resources, benefits, or privileges.
     */
    Approved = "approved",

    /**
     * The membership application has been rejected.
     * This status indicates that the application did not meet the necessary criteria or requirements for membership.
     * Members will be notified of the rejection and may receive feedback on the reasons for the decision.
     * Depending on the organization's policies, members may have the option to reapply in the future.
     */
    Rejected = "rejected",
}