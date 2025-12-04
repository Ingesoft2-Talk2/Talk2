/**
 * Test suite for the Dashboard page.
 * Verifies the rendering of header info, time/date, and dashboard cards.
 * Also checks that modals open correctly.
 */
describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });

    cy.visit("/dashboard");
  });

  it("renders header info", () => {
    cy.contains(
      /Upcoming Meeting|No meetings scheduled for today|Loading/,
    ).should("exist");
  });

  it("shows time and date", () => {
    cy.get("h1.text-4xl").should("exist");
    cy.get("p.text-lg").should("exist");
  });

  it("shows correct time and date", () => {
    const now = new Date();

    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
    }).format(now);

    cy.get('[data-testid="dashboard-time"]')
      .invoke("text")
      .should((text) => {
        expect(text.trim()).to.equal(formattedTime);
      });

    cy.get('[data-testid="dashboard-date"]')
      .invoke("text")
      .should((text) => {
        expect(text.trim()).to.equal(formattedDate);
      });
  });

  it("renders dashboard cards", () => {
    cy.contains("New Meeting").should("exist");
    cy.contains("Join Meeting").should("exist");
    cy.contains("Schedule Meeting").should("exist");
  });

  it("opens New Meeting modal", () => {
    cy.contains("New Meeting").click();
    cy.contains("Start an Instant Meeting").should("exist");
    cy.contains("Start Meeting").should("exist");
  });

  it("opens Join Meeting modal", () => {
    cy.contains("Join Meeting").click();
    cy.contains("Type the link here").should("exist");
  });

  it("opens Schedule Meeting modal", () => {
    cy.contains("Schedule Meeting").click();
    cy.contains("Create Meeting").should("exist");
  });
});
