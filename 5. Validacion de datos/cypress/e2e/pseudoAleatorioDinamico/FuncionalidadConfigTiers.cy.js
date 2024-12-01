const ghostVersion = Cypress.env('GHOST_VERSION');
const mockarooUrl = 'https://my.api.mockaroo.com/pseudo_aleatorio.json?key=5c1e2be0';

describe('Tester de funcionalidad tiers de config', () => {
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

    it('E0054 Modificando tier free', () => {
        // Given: El usuario está autenticado y en la página de configuración de tiers
        cy.get('a[data-test-nav="settings"]').click()
        cy.wait(1500)
        cy.url().should('include', '/settings')

        cy.get('#tiers').click()
        cy.wait(1500)
        cy.url().should('include', '/settings/tiers')

        // When: El usuario modifica el nombre y la descripción del tier
        cy.get('div[data-testid="tier-card"]').click()

        // Obtener datos falsos de Mockaroo
        cy.request(mockarooUrl).then((response) => {
            const tier = response.body[0];
            cy.get('input[id=":r16:"]').clear().type(tier.fullName)
            cy.get('input[id=":r18:"]').clear().type(tier.tierDescription)
            cy.get('button:contains("Save")').click()
            cy.wait(500)
            cy.get('button:contains("Close")').click()
            cy.url().should('include', '/settings/tiers')

            // Then: El nombre y la descripción del tier se actualizan en la lista de tiers
            cy.get('#tiers').click()
            cy.wait(1500)
            cy.url().should('include', '/settings/tiers')
            cy.get('div[class*="text-[1.65rem]"][class*="font-bold"]').should('contain', tier.fullName)
            cy.get('div[class*="line-clamp-2"][class*="text-[1.4rem]"][class*="font-medium"]').should('contain', tier.tierDescription)
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
        cy.get('div[class*="text-[1.65rem]"][class*="font-bold"]').should('contain', tierName)
        cy.get('div[class*="line-clamp-2"][class*="text-[1.4rem]"][class*="font-medium"]').should('contain', tierDescription)
    })
})