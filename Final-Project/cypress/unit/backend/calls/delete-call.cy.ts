/**
 * Test suite for deleting a call via the API.
 * Verifies successful deletion and error handling for non-existent calls.
 */
describe("Call - DELETE", () => {
  const base = "/api/call";
  const callId = crypto.randomUUID();

  beforeEach(() => {
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });
  });

  it("should delete an existing call", () => {
    // create
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

    // delete
    cy.request({
      method: "DELETE",
      url: `${base}/${callId}`,
    }).then((res) => {
      expect(res.status).to.equal(200);
    });
  });

  it("should return 404 if call does not exist", () => {
    cy.request({
      method: "DELETE",
      url: `${base}/${callId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(404);
    });
  });
});
