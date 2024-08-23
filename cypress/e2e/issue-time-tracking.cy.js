import IssueModal from "../pages/IssueModal";
import { faker } from "@faker-js/faker";

const issueTitle = "Time tracking functionality";
const issueDescription = faker.lorem.sentence();

const timeEstimationField = 'input[placeholder="Number"]';
const stopwatchIcon = '[data-testid="icon:stopwatch"]';
const trackingModal = '[data-testid="modal:tracking"]';
const firstTimeEstimation = "10";
const editTimeEstimation = "20";
const loggedTimeEstimation = "7";
const loggedTime = "2";
const remainingTime = "5";

const timeEstimationText = "h estimated";
const loggedTimeText = "h logged";
const remainingTimeText = "h remaining";

describe("Time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
        cy.get('[data-testid="modal:issue-create"]').within(() => {
          cy.get(".ql-editor").type(issueDescription);
          cy.get('input[name="title"]').type(issueTitle);
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Bug"]')
            .wait(1000)
            .trigger("mouseover")
            .trigger("click");
          cy.get('[data-testid="select:priority"]').click();
          cy.get('[data-testid="select-option:Highest"]')
            .wait(1000)
            .trigger("mouseover")
            .trigger("click");
          cy.get('[data-testid="select:reporterId"]').click();
          cy.get('[data-testid="select-option:Pickle Rick"]').click();
          cy.get('[data-testid="form-field:userIds"]').click();
          cy.get('[data-testid="select-option:Lord Gaben"]').click();
          cy.get('button[type="submit"]').click();
        });
        cy.get('[data-testid="modal:issue-create"]').should("not.exist");
        cy.contains("Issue has been successfully created.").should(
          "be.visible"
        );
        IssueModal.ensureIssueIsCreated;
        IssueModal.ensureIssueIsVisibleOnBoard;
        openIssue(issueTitle);
      });
  });

  it("Should add, edit and remove time estimation", () => {
    checkTimeLogged("No time logged");
    updateTimeEstimation(firstTimeEstimation);
    IssueModal.closeDetailModal();
    openIssue(issueTitle);
    checkEstimation(firstTimeEstimation);
    updateTimeEstimation(editTimeEstimation);
    IssueModal.closeDetailModal();
    openIssue(issueTitle);
    checkEstimation(editTimeEstimation);
    clearTimeEstimation();
    checkTimeLogged("No time logged");
  });

  it("Should add and remove logged time", () => {
    checkTimeLogged("No time logged");
    updateTimeEstimation(loggedTimeEstimation);
    logTime(loggedTime, remainingTime);
    checkLoggedAndRemainingTime(loggedTime, remainingTime);
    clearLoggedTime();
    checkEstimation(loggedTimeEstimation);
  });
});

function openIssue(title) {
  cy.reload();
  cy.get('[data-testid="board-list:backlog"]').contains(title).click();
}
function checkTimeLogged(text) {
  cy.contains(text).should("be.visible");
  cy.get('[placeholder="Number"]').should("be.visible");
}
function updateTimeEstimation(value) {
  cy.get(timeEstimationField).clear().type(value);
  cy.wait(1000);
  cy.contains(`${value}${timeEstimationText}`).should("be.visible");
}
function checkEstimation(value) {
  cy.contains(`${value}${timeEstimationText}`).should("be.visible");
}
function clearTimeEstimation() {
  cy.get(timeEstimationField).clear();
  cy.wait(1000);
}
function logTime(logged, remaining) {
  cy.get(stopwatchIcon).click();
  cy.get(trackingModal).within(() => {
    cy.get('input[placeholder="Number"]').first().type(logged);
    cy.get('input[placeholder="Number"]').last().type(remaining);
    cy.contains("button", "Done").click();
  });
}
function checkLoggedAndRemainingTime(logged, remaining) {
  cy.get(trackingModal).should("not.exist");
  cy.contains(`${logged}${loggedTimeText}`).should("be.visible");
  cy.contains(`${remaining}${remainingTimeText}`).should("be.visible");
}
function clearLoggedTime() {
  cy.get(stopwatchIcon).click();
  cy.get(trackingModal).within(() => {
    cy.get('input[placeholder="Number"]').first().clear();
    cy.get('input[placeholder="Number"]').last().clear();
    cy.contains("button", "Done").click();
  });
}
