describe('Responsividade', () => {
  const viewports = [
    { device: 'Mobile', width: 375, height: 667 },
    { device: 'Tablet', width: 768, height: 1024 },
    { device: 'Desktop', width: 1920, height: 1080 }
  ]

  viewports.forEach(({ device, width, height }) => {
    it(`deve ser responsivo em ${device}`, () => {
      cy.viewport(width, height)
      cy.visit('/')
      cy.get('header').should('be.visible')
      cy.get('footer').should('be.visible')
    })
  })
})
