import IssueModal from '../pages/IssueModal';
const issueModal = 'Click on an issue';

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains(issueModal).click();
    });
  });

  it('Should delete "Click on an issue to see whats behind it." issue successfully', () => {
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Are you sure you want to delete this issue?').should('be.visible').wait(2000);
      cy.contains("Once you delete, it's gone for good.").should('be.visible').wait(2000);
      cy.contains('Delete issue').click().wait(3000);
    })
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueModal).should('not.exist');
    });

    cy.reload().wait(3000);
    cy.contains('Click on an issue to see whats behind it.').should('not.exist');
  });

  it('Should cancel issue deletion process successfully', () => {
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    cy.get('[data-testid="icon:trash"]').click().wait(2000);
    cy.get('[data-testid="modal:confirm"]').should('be.visible').wait(2000);;
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Are you sure you want to delete this issue?').should('be.visible').wait(1500);
      cy.contains("Once you delete, it's gone for good.").should('be.visible').wait(2000);

      cy.contains('button', 'Cancel').click().wait(3000);
    })
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').find('[data-testid="icon:close"]').first().click().wait(3000);;
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");

    cy.get('[data-testid="list-issue"]')
      .find("p").wait(2000)
      .contains(issueModal).wait(2000)
      .should("be.visible");
  });
})
