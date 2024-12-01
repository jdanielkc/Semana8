import { faker } from '@faker-js/faker';

const ghostVersion = Cypress.env('GHOST_VERSION');

describe('Tester de funcionalidad staff de config', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })
    })

    it('E0028 Modificando el nombre de usuario', () => {
        // Given: El usuario está autenticado y en la página de configuración de staff
        cy.get('a[data-test-nav="settings"]').click()
        cy.wait(1500)
        cy.url().should('include', '/settings')

        cy.get('#staff').click()
        cy.wait(1500)
        cy.url().should('include', '/settings/staff')

        // When: El usuario modifica el nombre de usuario
        cy.get('div[data-testid="owner-user"]').click()
        const newFullName = faker.person.fullName();
        cy.get('input[id=":r16:"]').clear().type(newFullName)

        cy.get('button:contains("Save")').click()
        cy.wait(500)
        cy.get('button:contains("Close")').click()
        cy.url().should('include', '/settings/staff')

        // Then: El nombre del usuario se actualiza en la lista de staff
        cy.get('#staff').click()
        cy.wait(1500)
        cy.url().should('include', '/settings/staff')
        cy.get('div.flex.flex-col > span').should('contain', `${newFullName} — Owner`)
    })

    afterEach(() => {
        // Restablecer el nombre de usuario al valor original
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#staff').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/staff')

            cy.get('div[data-testid="owner-user"]').click()
            cy.get('input[id=":r1u:"]').clear().type(user.userLoginName)
            cy.get('button:contains("Save")').click()
            cy.wait(500)
            cy.get('button:contains("Close")').click()
            cy.url().should('include', '/settings/staff')
        })
    })
})