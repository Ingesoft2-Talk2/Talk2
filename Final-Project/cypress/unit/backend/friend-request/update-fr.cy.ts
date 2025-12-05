/**
 * Test suite for updating friend requests (accepting) via the API.
 * Verifies successful status update to ACCEPTED and error handling.
 */
describe("FriendRequest - UPDATE", () => {
  const base = "/api/friend-request";

  beforeEach(() => {
    cy.resetDB();
    cy.visit("/");

    cy.clerkSignIn({
      strategy: "password",
      identifier: Cypress.env("CLERK_IDENTIFIER"),
      password: Cypress.env("CLERK_PASSWORD"),
    });
  });

  it("should accept a pending friend request", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      // create
      cy.request("POST", `${base}/${userB.id}?currentUserId=${userA.id}`);

      // accept
      cy.request({
        method: "PATCH",
        url: `${base}/${userB.id}?currentUserId=${userA.id}`,
      }).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("ACCEPTED");
      });
    });
  });

  it("should return 404 if request does not exist", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      cy.request({
        method: "PATCH",
        url: `${base}/${userB.id}?currentUserId=${userA.id}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.equal(404);
      });
    });
  });

  it("should return 400 if missing IDs", () => {
    cy.request({
      method: "PATCH",
      url: `${base}/some-id`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(400);
    });
  });
});
