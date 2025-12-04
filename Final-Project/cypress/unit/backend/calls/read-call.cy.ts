/**
 * Test suite for retrieving call details via the API.
 * Verifies successful retrieval and error handling for non-existent calls.
 */
describe("Call - READ", () => {
  const base = "/api/call";

  beforeEach(() => {
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });
  });

  it("should return an existing call", () => {
    const callId = Cypress._.uniqueId("call_");

    // first create
    cy.request({
      method: "POST",
      url: `${base}/${callId}`,
      body: {
        data: {
          created_by_id: Cypress.env("CREATED_BY_ID"),
          custom: {
            description: "API Test",
          },
          starts_at: "2025-12-28T06:20:00Z",
        },
      },
    }).then((res) => {
      expect(res.status).to.equal(200);
    });

    // then read
    cy.request(`${base}/${callId}`).then((res) => {
      expect(res.status).to.equal(200);
    });
  });

  it("should return 404 if call does not exist", () => {
    const callId = Cypress._.uniqueId("missing_");

    cy.request({
      url: `${base}/${callId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(404);
    });
  });
});
