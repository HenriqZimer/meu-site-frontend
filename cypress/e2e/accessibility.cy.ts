describe('Acessibilidade', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve ter alt text em imagens', () => {
    cy.get('img').each($img => {
      cy.wrap($img).should('have.attr', 'alt')
    })
  })

  it('deve ter labels em inputs', () => {
    cy.get('input').each($input => {
      const id = $input.attr('id')
      if (id) {
        cy.get(`label[for="${id}"]`).should('exist')
      }
    })
  })

  it('deve ter elementos focáveis', () => {
    cy.get('a, button').first().should('exist')
  })
})
