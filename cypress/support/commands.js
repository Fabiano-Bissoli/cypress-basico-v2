Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Fabiano')
    cy.get('#lastName').type('Bissoli')
    cy.get('#email').type('fabiano@teste.com')
    cy.get('#open-text-area').type('Tete')
    cy.get('button[type="submit"]').click()
})