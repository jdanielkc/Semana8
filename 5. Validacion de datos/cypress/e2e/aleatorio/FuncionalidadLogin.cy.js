import { faker } from '@faker-js/faker';

const ghostVersion = Cypress.env('GHOST_VERSION');

describe('Tester de funcionalidad login', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })
    it('E0030 Verificando Inicio de sesión exitoso', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })
        
    })

    it('E0031 Verificando inicio de sesión fallido', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            let contraseniaMala = faker.internet.password()
            cy.get('#password').type(contraseniaMala)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.get('p[data-test-flow-notification]').should('exist')
        })
    })
})