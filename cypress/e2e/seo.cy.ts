describe('SEO', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve ter título da página', () => {
    cy.title().should('not.be.empty')
  })

  it('deve ter meta description', () => {
    cy.get('meta[name="description"]').should('exist')
  })

  it('deve ter meta viewport', () => {
    cy.get('meta[name="viewport"]').should('exist')
  })

  it('deve ter charset UTF-8', () => {
    cy.get('meta[charset]').should('have.attr', 'charset', 'utf-8')
  })
})
