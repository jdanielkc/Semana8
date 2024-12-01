import { faker } from '@faker-js/faker';
const ghostVersion = Cypress.env('GHOST_VERSION');

describe('Tester de funcionalidad newsletter de config', () => {

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

    it('E0026 Creando un nuevo newsletter con una longitud máxima', () => {
        // Given: El usuario navega a la configuración de newsletters
        cy.get('a[data-test-nav="settings"]').click()
        cy.wait(1500)
        cy.url().should('include', '/settings')

        cy.get('#newsletters').click()
        cy.wait(1500)
        cy.url().should('include', '/settings/newsletters')

        // When: El usuario crea un nuevo newsletter
        cy.get('button:contains("Add newsletter")').click()
        cy.wait(1500)

        cy.get('input[placeholder="Weekly roundup"]').click()

        let newsletterName = faker.lorem.word()
        cy.get('input[placeholder="Weekly roundup"]').type(newsletterName)

        cy.contains('label', 'Description').parent().find('textarea').click()
        let newsletterDescription = faker.lorem.word()
        cy.contains('label', 'Description').parent().find('textarea').type(newsletterDescription)
        cy.get('button:contains("Create")').click()
        cy.wait(1000)

        cy.get('button:contains("Save")').click()
        cy.wait(1000)

        cy.get('button:contains("Close")').click()
        cy.wait(1000)

        // Then: El nuevo newsletter aparece en la lista de newsletters
        cy.get('table.w-full tbody tr').should('contain', newsletterName)
        

    })

    it('E0027 Editando un newsletter', () => {
        // Given: El usuario navega a la configuración de newsletters
        cy.get('a[data-test-nav="settings"]').click()
        cy.wait(1500)
        cy.url().should('include', '/settings')

        cy.get('#newsletters').click()
        cy.wait(1500)
        cy.url().should('include', '/settings/newsletters')

        // When: El usuario edita un newsletter existente
        cy.get('table.w-full tbody tr').first().click({ force: true })
        cy.wait(1500)

        cy.contains('label', 'Name').parent().find('input').clear()
        let newsletterName = faker.lorem.word()
        cy.contains('label', 'Name').parent().find('input').type(newsletterName)
        cy.get('button:contains("Save")').click()
        cy.wait(1000)

        cy.get('button:contains("Close")').click()
        cy.wait(1000)

        // Then: El nombre del newsletter se actualiza en la lista de newsletters
        cy.get('table.w-full tbody tr').should('contain', newsletterName)

        

    })
})