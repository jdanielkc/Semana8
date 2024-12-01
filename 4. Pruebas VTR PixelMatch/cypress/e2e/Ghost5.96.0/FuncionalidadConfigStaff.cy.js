
const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad staff de config', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })
    it('E0003 Modificando el nombre de usuario', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            // ingresando a la configuracion
            cy.get('a[data-test-nav="settings"]').click()
            cy.wait(1500)
            cy.url().should('include', '/settings')

            cy.get('#staff').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/staff')

            cy.get('div[data-testid="owner-user"]').click()
            cy.fixture('userLogin.json').then((user) => {
                cy.get('input[id=":r16:"]').clear().type(user.testUserLoginName)
            })
            cy.get('button:contains("Save")').click()
            cy.wait(500)
            cy.get('button:contains("Close")').click()
            cy.url().should('include', '/settings/staff')

            cy.get('#staff').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/staff')

            //verificar cambio de nombre
            cy.get('div.flex.flex-col > span').should('contain', `${user.testUserLoginName} — Owner`)
            cy.get('div.flex.flex-col > span').next().should('contain', user.email)

            cy.screenshot(`${ghostVersion}/modificando-nombre-usuario`)
        })
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