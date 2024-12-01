
const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad tiers de config', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })
    it('E0004 Modificando tier free', () => {
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

            cy.get('#tiers').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/tiers')

            cy.get('div[data-testid="tier-card"]').click()
            cy.fixture('tierData.json').then((tier) => {
                cy.get('input[id=":r16:"]').clear().type(tier.tierName)
                cy.get('input[id=":r18:"]').clear().type(tier.tierDescription)
            })
            cy.get('button:contains("Save")').click()
            cy.wait(500)
            cy.get('button:contains("Close")').click()
            cy.url().should('include', '/settings/tiers')

            cy.get('#tiers').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/tiers')

            //verificar cambio de nombre
            cy.fixture('tierData.json').then((tier) => {
                cy.get('div[class*="text-[1.65rem]"][class*="font-bold"]').should('contain', tier.tierName)
                cy.get('div[class*="line-clamp-2"][class*="text-[1.4rem]"][class*="font-medium"]').should('contain', tier.tierDescription)
            })

            cy.screenshot(`${ghostVersion}/modificando-tier-free`)
        })
    })

    afterEach(() => {
        // Restablecer el nombre y la descripción del tier al valor original
        let tierName = 'Free'
        let tierDescription = 'No description'
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#tiers').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/tiers')

            cy.get('div[data-testid="tier-card"]').click()
            cy.get('input[id=":r1g:"]').clear().type(tierName)
            cy.get('input[id=":r1i:"]').clear().type(tierDescription)
            cy.get('button:contains("Save")').click()
            cy.wait(500)
            cy.get('button:contains("Close")').click()
            cy.url().should('include', '/settings/tiers')
        })
        cy.fixture('tierData.json').then((tier) => {
            cy.get('div[class*="text-[1.65rem]"][class*="font-bold"]').should('contain', tierName)
            cy.get('div[class*="line-clamp-2"][class*="text-[1.4rem]"][class*="font-medium"]').should('contain', tierDescription)
        })
    })
})