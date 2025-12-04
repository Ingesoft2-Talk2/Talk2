/**
 * Test suite for updating call details via the API.
 * Verifies successful updates and error handling for non-existent calls.
 */
describe("Call - UPDATE", () => {
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

  it("should update an existing call", () => {
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

    const payload = {
      description: "API Test Change",
      startsAt: new Date().toISOString(),
    };

    // update
    cy.request({
      method: "PATCH",
      url: `${base}/${callId}`,
      body: payload,
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      expect(res.status).to.equal(200);
    });
  });

  it("should return 404 when updating non-existent call", () => {
    const callId = Cypress._.uniqueId("missing_");

    const payload = {
      description: "API Test Change",
      startsAt: new Date().toISOString(),
    };

    cy.request({
      method: "PATCH",
      url: `${base}/${callId}`,
      body: payload,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(404);
    });
  });
});
