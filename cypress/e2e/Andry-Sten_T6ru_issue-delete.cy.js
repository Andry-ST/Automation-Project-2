const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

describe("Issue deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should delete an issue", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').should("be.visible").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get("button").contains("Delete issue").should("be.visible").click();
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
    cy.reload();
    cy.contains("This is an issue of type: Task.").should("not.exist");
  });

  it("Should cancel issue deletion", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').should("be.visible").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:close"]').first().should("be.visible").click();
    });
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    cy.reload();
    cy.contains("This is an issue of type: Task.").should("exist");
  });
});
