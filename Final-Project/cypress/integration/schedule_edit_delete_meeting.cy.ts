describe("Schedule, edit and delete meeting", () => {
  let meetingDescription: string;
  let updatedDescription: string;
  let initialDateISO: string;

  before(() => {
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });
  });

  beforeEach(() => {
    // Stay logged in between tests
    cy.session("user-session", () => {
      cy.visit("/");
      cy.clerkSignIn({
        strategy: "password",
        identifier: Cypress.env("CLERK_IDENTIFIER"),
        password: Cypress.env("CLERK_PASSWORD"),
      });
    });

    cy.visit("/dashboard");
  });

  it("creates a meeting", () => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    initialDateISO = inOneHour.toISOString().slice(0, 16);

    meetingDescription = `Test meeting ${Date.now()}`;
    updatedDescription = `${meetingDescription} updated`;

    // 1. Click on Schedule Meeting
    cy.contains("button", "Schedule Meeting").click();

    // 2. Complete date/time + description
    cy.get('[data-testid="schedule-datetime"]').clear().type(initialDateISO);

    cy.get('[data-testid="schedule-description"]')
      .clear()
      .type(meetingDescription);

    // 3. Create meeting
    cy.get('[data-testid="schedule-submit-btn"]').click();

    // Wait for feedback
    cy.contains("Meeting Scheduled").should("exist");
  });

  it("edits the meeting", () => {
    // 4. Go to Upcoming
    cy.visit("/upcoming");

    // 5. Search the list for the created meeting
    cy.contains('[data-testid="meeting-card"]', meetingDescription)
      .as("newMeeting")
      .should("exist");

    // 6. Open options menu (3 dots)
    cy.get("@newMeeting").find('[data-testid="options-menu-btn"]').click();

    // 7. Click on Edit
    cy.get('[data-testid="edit-meeting-btn"]').click();

    // 8. Edit description
    cy.get('[data-testid="edit-description"]').clear().type(updatedDescription);

    // Edit date/time (add 30 more minutes)
    const updatedDateISO = new Date(
      new Date(initialDateISO).getTime() + 30 * 60 * 1000,
    )
      .toISOString()
      .slice(0, 16);

    cy.get('[data-testid="edit-datetime"]').clear().type(updatedDateISO);

    // 9. Save changes
    cy.get('[data-testid="confirm-edit-btn"]').click();

    cy.contains("Meeting updated successfully").should("exist");
  });

  it("deletes the meeting", () => {
    // 10. Reopen the menu to delete it.
    cy.visit("/upcoming");

    cy.contains('[data-testid="meeting-card"]', updatedDescription)
      .as("updatedMeeting")
      .should("exist");

    cy.get("@updatedMeeting").find('[data-testid="options-menu-btn"]').click();

    // 11. Click delete
    cy.get('[data-testid="delete-meeting-btn"]').click();

    // 12. Confirm deletion
    cy.get('[data-testid="confirm-delete-btn"]').click();

    cy.contains("Meeting deleted successfully").should("exist");

    // 13. Verify that it no longer exists in Upcoming
    cy.contains(updatedDescription).should("not.exist");
  });
});
