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

    it('E0001 Creando un nuevo newsletter con una longitud máxima', () => {
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

        cy.fixture('A-priori/newsletter.json').then((priori) => {
            const randomIndex = Math.floor(Math.random() * priori.length);
            const newsletter = priori[randomIndex];
            let newsletterName = newsletter.newsletterName;
            cy.get('input[placeholder="Weekly roundup"]').type(newsletterName)

            cy.contains('label', 'Description').parent().find('textarea').click()
            let newsletterDescription = newsletter.newsletterDescription;
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
    })

    it('E0002 Editando un newsletter', () => {
        // Given: El usuario navega a la configuración de newsletters
        cy.get('a[data-test-nav="settings"]').click()
        cy.wait(1500)
        cy.url().should('include', '/settings')

        cy.get('#newsletters').click()
        cy.wait(1500)
        cy.url().should('include', '/settings/newsletters')

        // When: El usuario edita un newsletter existente
        cy.get('table.w-full tbody tr').first().click({force: true})
        cy.wait(1500)

        cy.contains('label', 'Name').parent().find('input').clear()
        cy.fixture('A-priori/newsletter.json').then((priori) => {
            const randomIndex = Math.floor(Math.random() * priori.length);
            const newsletter = priori[randomIndex];
            let newsletterRareName = newsletter.rareName;
            cy.contains('label', 'Name').parent().find('input').type(newsletterRareName)
            cy.get('button:contains("Save")').click()
            cy.wait(1000)

            cy.get('button:contains("Close")').click()
            cy.wait(1000)

            // Then: El nombre del newsletter se actualiza en la lista de newsletters
            cy.get('table.w-full tbody tr').should('contain', newsletterRareName)
        })
    })
})