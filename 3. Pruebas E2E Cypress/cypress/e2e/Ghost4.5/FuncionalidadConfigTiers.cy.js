
const ghostVersion = Cypress.env('GHOST_VERSION_OLD');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad tiers de config', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPageOld)
        })
    })
    it('E0002 Modificando tier free', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            // ingresando a la configuracion
            cy.get('a[href="#/settings/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/settings')

            cy.get('a[href="#/settings/products/"]').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/products')

            cy.get('a[href="#/settings/products/"]').click()
            cy.fixture('tierData.json').then((tier) => {
                cy.get('input[id="name"]').clear()
                cy.get('input[id="name"]').type(tier.tierName)

                cy.get('input[id="description"]').clear()
                cy.get('input[id="description"]').type(tier.tierDescription)
            })
            cy.get('button:contains("Save")').click()
            cy.wait(500)
            cy.url().should('include', '/settings/products')

            //verificar cambio de nombre
            cy.fixture('tierData.json').then((tier) => {
                cy.get('p').should('contain', tier.tierDescription)
            })

            cy.screenshot(`${ghostVersion}/modificando-tier-free`)
        })
    })

    afterEach(() => {
        // Restablecer el nombre de usuario al valor original
        let tierName = 'Free'
        let tierDescription = 'Free Preview'
        cy.get('a[href="#/settings/products/"]').click()
        cy.get('input[id="name"]').clear()
        cy.get('input[id="name"]').type(tierName)

        cy.get('input[id="description"]').clear()
        cy.get('input[id="description"]').type(tierDescription)
        cy.get('button:contains("Save")').click()
    })
})