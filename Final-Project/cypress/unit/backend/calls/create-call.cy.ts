describe("Call - CREATE", () => {
  const base = "/api/call";

  beforeEach(() => {
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });
  });

  it("should create a new call", () => {
    const callId = crypto.randomUUID();

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
  });

  it("should return 404 for missing callId", () => {
    cy.request({
      method: "POST",
      url: `${base}/`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(404);
    });
  });
});
