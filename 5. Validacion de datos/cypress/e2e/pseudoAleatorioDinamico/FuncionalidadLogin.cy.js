const ghostVersion = Cypress.env('GHOST_VERSION');
const mockarooUrl = 'https://my.api.mockaroo.com/pseudo_aleatorio.json?key=5c1e2be0';

describe('Tester de funcionalidad login', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })

    it('E0055 Verificando Inicio de sesión exitoso', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })
        
    })

    it('E0066 Verificando inicio de sesión fallido', () => {
        // Obtener datos falsos de Mockaroo
        cy.request(mockarooUrl).then((response) => {
            const user = response.body[0];
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.fakePassword)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.get('p[data-test-flow-notification]').should('exist')
        })
    })
})