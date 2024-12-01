const ghostVersion = Cypress.env('GHOST_VERSION');

describe('Tester de funcionalidad login', () => {
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

    })

    it('E0006 Verificando inicio de sesión fallido', () => {
        cy.fixture('A-priori/login.json').then((user) => {
            const randomIndex = Math.floor(Math.random() * user.length);
            const userSelect = user[randomIndex];
            cy.get('#identification').type(userSelect.email)
            cy.get('#password').type(userSelect.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.get('p[data-test-flow-notification]').should('exist')
        })
    })
})