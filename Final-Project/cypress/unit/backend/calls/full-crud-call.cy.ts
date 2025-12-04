/**
 * Test suite for the full CRUD lifecycle of a call.
 * Verifies Create, Read, Update, and Delete operations in sequence.
 */
describe("Call - FULL CRUD FLOW", () => {
  const base = "/api/call";

  beforeEach(() => {
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });
  });

  it("should perform full CRUD flow for a call", () => {
    const callId = crypto.randomUUID();

    // 1. CREATE
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

    // 2. READ
    cy.request(`${base}/${callId}`).then((res) => {
      expect(res.status).to.equal(200);
    });

    // 3. UPDATE
    const payload = {
      description: "API Test Change",
      startsAt: new Date().toISOString(),
    };

    cy.request({
      method: "PATCH",
      url: `${base}/${callId}`,
      body: payload,
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      expect(res.status).to.equal(200);
    });

    // 4. DELETE
    cy.request({
      method: "DELETE",
      url: `${base}/${callId}`,
    }).then((res) => {
      expect(res.status).to.equal(200);
    });

    // 5. READ AGAIN → not found
    cy.request({
      url: `${base}/${callId}`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(404);
    });
  });
});
