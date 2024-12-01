
const ghostVersion = Cypress.env('GHOST_VERSION_OLD');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad staff de config', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPageOld)
        })
    })
    it('E0001 Modificando el nombre de usuario', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            // ingresando a la configuracion
            cy.get('a[href="#/staff/"]').click()
            cy.wait(1500)
            cy.url().should('include', '/staff')


            cy.fixture('userLogin.json').then((user) => {
                cy.get('div.apps-configured').contains('Owner').click()
                cy.get('input[id="user-name"]').clear().type(user.testUserLoginName, { force: true })
            })
            cy.get('button:contains("Save")').click()
            cy.wait(500)

            cy.get('a[href="#/staff/"]').first().click()
            cy.url().should('include', '/staff')

            //verificar cambio de nombre
            cy.get('h3').should('contain', `${user.testUserLoginName}`)

            cy.screenshot(`${ghostVersion}/modificando-nombre-usuario`)
        })
    })

    afterEach(() => {
        // Restablecer el nombre de usuario al valor original
        cy.fixture('userLogin.json').then((user) => {
            cy.get('div.apps-configured').contains('Owner').click()
            cy.get('input[id="user-name"]').clear().type(user.userLoginName, { force: true })
            cy.get('button:contains("Save")').click()
        })
    })
})