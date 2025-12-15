/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to scroll to a section
       * @example cy.scrollToSection('#about')
       */
      scrollToSection(selector: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('scrollToSection', (selector: string) => {
  return cy.get(selector).scrollIntoView({ duration: 500 })
})

export {}
