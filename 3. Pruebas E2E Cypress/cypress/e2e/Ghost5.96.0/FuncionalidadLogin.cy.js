import { faker } from '@faker-js/faker';


const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad page', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })
    it('E0005 Verificando Inicio de sesión exitoso', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })

        cy.screenshot(`${ghostVersion}/inicio-sesion-exitoso`)

    })

    it('E0006 Verificando inicio de sesión fallido', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            let contraseniaMala = faker.internet.password()
            cy.get('#password').type(contraseniaMala)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.get('p[data-test-flow-notification]').should('exist')
        })

        cy.screenshot(`${ghostVersion}/inicio-sesion-fallido`)
    })
})