describe("FriendRequest - FULL CRUD FLOW", () => {
  const base = "/api/friend-request";

  beforeEach(() => {
    cy.resetDB();
  });

  it("should perform full CRUD flow", () => {
    cy.fixture("users").then(({ userA, userB }) => {
      // 1. create
      cy.request("POST", `${base}/${userB.id}?currentUserId=${userA.id}`);

      // 2. list pending
      cy.request(`${base}?userId=${userB.id}&status=PENDING`).then((res) => {
        expect(res.body.length).to.equal(1);
      });

      // 3. accept
      cy.request("PATCH", `${base}/${userB.id}?currentUserId=${userA.id}`);

      // 4. list accepted
      cy.request(`${base}?userId=${userA.id}&status=ACCEPTED`).then((res) => {
        expect(res.body.length).to.equal(1);
      });

      // 5. delete
      cy.request(
        "DELETE",
        `${base}/${userB.id}?currentUserId=${userA.id}`,
      ).then((res) => {
        expect(res.status).to.equal(200);
      });

      // 6. list again → must be empty
      cy.request(`${base}?userId=${userA.id}&status=ACCEPTED`).then((res) => {
        expect(res.body.length).to.equal(0);
      });
    });
  });
});
