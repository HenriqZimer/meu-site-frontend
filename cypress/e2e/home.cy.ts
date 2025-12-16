describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve carregar a página inicial', () => {
    cy.url().should('include', 'localhost:3000')
  })

  it('deve ter header visível', () => {
    cy.get('header').should('be.visible')
  })

  it('deve ter footer visível', () => {
    cy.get('footer').should('be.visible')
  })

  it('deve carregar em menos de 3 segundos', () => {
    cy.window().then(win => {
      const perfData = win.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      expect(pageLoadTime).to.be.lessThan(3000)
    })
  })
})
