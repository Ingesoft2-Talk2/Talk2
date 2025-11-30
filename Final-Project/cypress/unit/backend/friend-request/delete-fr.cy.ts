describe("FriendRequest - DELETE", () => {
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

  it("should delete an existing request", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      cy.request("POST", `${base}/${userB.id}?currentUserId=${userA.id}`);

      cy.request({
        method: "DELETE",
        url: `${base}/${userB.id}?currentUserId=${userA.id}`,
      }).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal(
          "Friend request deleted successfully",
        );
      });
    });
  });

  it("should return 404 if no request exists", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      cy.request({
        method: "DELETE",
        url: `${base}/${userB.id}?currentUserId=${userA.id}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.equal(404);
      });
    });
  });
});
