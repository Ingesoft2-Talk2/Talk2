describe("FriendRequest - LIST", () => {
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

  it("should list pending friend requests for a user", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      // A sends a request to B
      cy.request("POST", `${base}/${userB.id}?currentUserId=${userA.id}`);

      cy.request(`${base}?userId=${userB.id}&status=PENDING`).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].senderId).to.equal(userA.id);
      });
    });
  });

  it("should return 400 if missing query params", () => {
    cy.request({
      url: `${base}?userId=user123`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.equal(400);
    });
  });
});
