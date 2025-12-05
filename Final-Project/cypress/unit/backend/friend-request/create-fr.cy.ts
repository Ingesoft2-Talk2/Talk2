/**
 * Test suite for creating friend requests via the API.
 * Verifies successful creation, handling of existing requests, and error cases.
 */
describe("FriendRequest - CREATE", () => {
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

  it("should create a new friend request", () => {
    cy.visit("/friends");

    cy.fixture("users").then(({ userA, userB }) => {
      cy.request({
        method: "POST",
        url: `${base}/${userB.id}?currentUserId=${userA.id}`,
      }).then((res) => {
        expect(res.status).to.equal(201);
        expect(res.body.friendRequest.senderId).to.equal(userA.id);
        expect(res.body.friendRequest.receiverId).to.equal(userB.id);
        expect(res.body.friendRequest.status).to.equal("PENDING");
      });
    });
  });

  it("should return existing request if it already exists", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      const url = `${base}/${userB.id}?currentUserId=${userA.id}`;

      // first request → creates
      cy.request("POST", url);

      // second request → should return status 200
      cy.request("POST", url).then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Friend request already exists");
      });
    });
  });

  it("should return 400 if missing currentUserId", () => {
    cy.fixture("users").then(({ userB }) => {
      cy.request({
        method: "POST",
        url: `${base}/${userB.id}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("Missing currentUserId");
      });
    });
  });

  it("should return 400 when sending request to yourself", () => {
    cy.fixture("users").then(({ userA }) => {
      cy.request({
        method: "POST",
        url: `${base}/${userA.id}?currentUserId=${userA.id}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal(
          "Cannot send friend request to yourself",
        );
      });
    });
  });
});
