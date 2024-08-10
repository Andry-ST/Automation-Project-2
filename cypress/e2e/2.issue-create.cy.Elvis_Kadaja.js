import { faker } from '@faker-js/faker';
import IssueModal from '../pages/IssueModal';


describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {

        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it('Should create an issue and validate it successfully', () => {

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('TEST_DESCRIPTION').wait(3000);
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION').wait(3000);

      cy.get('input[name="title"]').type('TEST_TITLE')
      .wait(3000);
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE').wait(3000);


      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').wait(2000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible').wait(3000);


      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();


      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();


      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('TEST_TITLE')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Should validate title is required field if missing', () => {

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  })

  //Test Case 1: Custom Issue Creation:

  it('Should create an issue "BUGGY" and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('My buggy description');
      cy.get('.ql-editor').should('have.text', 'My buggy description');

      cy.get('input[name="title"]').type('Buggy')
      //.wait(3000);
      cy.get('input[name="title"]').should('have.value', 'Buggy').wait(3000);

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').wait(3000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:bug"]').should('be.visible').wait(3000);

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]')
        .wait(2000)
        .trigger('mouseover')
        .trigger('click');

      cy.get('button[type="submit"]').click().wait(3000);
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Buggy')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
            cy.get('[data-testid="icon:bug"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('Bug')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:bug"]').should('be.visible');
      });
  });

  it('Should create a Random Data Plugin Issue and validate it successfully', () => {

    const randomWord = faker.word.noun();
    const randomWords = faker.word.words(5);
    let issueTitle = 'randomWord';
    let issueDescription = 'randomWords';

    cy.log(randomWord);
    cy.log(randomWords);

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type(randomWords);
      cy.get('.ql-editor').should('have.text', randomWords);

      cy.get('input[name="title"]').type(randomWord);
      cy.get('input[name="title"]').should('have.value', randomWord);

      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:task"]').should('be.visible');

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]')
        .wait(2000)
        .trigger('mouseover')
        .trigger('click').wait(3000);

      cy.get('button[type="submit"]').click();
    });
    // Assert success message and modal closure
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the   page and verify issue is visible
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert backlog list and verify first issue details
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          // Adjust if number of issues changes
          .first()
          .find('p')
          .contains(randomWord) // Verify title contains random word
          .siblings()
          .within(() => {
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:task"]').should('be.visible');
          });
      })
  });
})
