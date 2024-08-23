import { faker } from "@faker-js/faker";

const commentTextArea = 'textarea[placeholder="Add a comment..."]';
const issueComment = '[data-testid="issue-comment"]';

const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const getDeletionConfirmation = () => cy.get('[data-testid="modal:confirm"]');

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it("Should create, edit, and delete a comment successfully", () => {
    const commentCreate = faker.lorem.sentence();
    const commentEdit = faker.lorem.sentence();

    // Add a new comment
    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();
      cy.get(commentTextArea).type(commentCreate);
      cy.contains("button", "Save").click().should("not.exist");
      cy.contains("Add a comment...").should("exist");
      cy.get(issueComment).should("contain", commentCreate);

      // Edit the comment
      cy.get(issueComment).first().contains("Edit").click().should("not.exist");
      cy.get(commentTextArea).clear().type(commentEdit);
      cy.contains("button", "Save").click().should("not.exist");
      cy.get(issueComment).should("contain", commentEdit);

      // Delete the comment
      cy.get(issueComment)
        .contains(commentEdit)
        .parent()
        .contains("Delete")
        .click();
    });

    // Confirm deletion
    getDeletionConfirmation()
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    // Assert the comment is deleted
    getIssueDetailsModal()
      .find(issueComment)
      .contains(commentEdit)
      .should("not.exist");
  });
});
