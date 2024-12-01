const ghostVersion = Cypress.env('GHOST_VERSION');
const mockarooUrl = 'https://my.api.mockaroo.com/pseudo_aleatorio.json?key=5c1e2be0';

describe('Tester de funcionalidad page', () => {
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

    it('E0063 Creando Page con titulo y contenido', () => {
        // Given: El usuario está autenticado y en la página de creación de pages
        cy.get('a[data-test-nav="pages"]').click()
        cy.wait(1500)
        cy.url().should('include', '/pages')

        cy.get('a[data-test-new-page-button]').click()
        cy.wait(1500)
        cy.url().should('include', '/editor/page')

        // When: El usuario crea una nueva página con título y contenido
        cy.request(mockarooUrl).then((response) => {
            const page = response.body[0];
            cy.get('textarea[data-test-editor-title-input]').type(page.pageTitle)
            cy.get('div[data-lexical-editor="true"]').first().type(page.pageContent)
            cy.get('button[data-test-button="publish-flow"]').first().click()
            cy.get('button[data-test-button="continue"]').click()
            cy.wait(500)
            cy.get('button[data-test-button="confirm-publish"]').click()
            cy.get('button[data-test-button="close-publish-flow"]').click()
            cy.wait(500)
            cy.url().should('include', '/pages')

            // Then: Verificar creación
            cy.contains('h3', page.pageTitle).should('exist')
            
        })
    })

    it('E0064 Creando Page con titulo y sin contenido', () => {
        // Given: El usuario está autenticado y en la página de creación de pages
        cy.get('a[data-test-nav="pages"]').click()
        cy.wait(1500)
        cy.url().should('include', '/pages')

        cy.get('a[data-test-new-page-button]').click()
        cy.wait(1500)
        cy.url().should('include', '/editor/page')

        // When: El usuario crea una nueva página con título y sin contenido
        cy.request(mockarooUrl).then((response) => {
            const page = response.body[0];
            cy.get('textarea[data-test-editor-title-input]').type(page.pageTitle)
            cy.get('div[data-lexical-editor="true"]').first().focus()
            cy.wait(500)
            cy.get('button[data-test-button="publish-flow"]').first().click()
            cy.get('button[data-test-button="continue"]').click()
            cy.wait(500)
            cy.get('button[data-test-button="confirm-publish"]').click()
            cy.get('button[data-test-button="close-publish-flow"]').click()
            cy.wait(500)
            cy.url().should('include', '/pages')

            // Then: Verificar creación
            cy.contains('h3', page.pageTitle).should('exist')
            
        })
    })

    it('E0065 Eliminando una Page', () => {
        // Given: El usuario está autenticado y en la página de listado de pages
        cy.get('a[data-test-nav="pages"]').click()
        cy.wait(500)
        cy.url().should('include', '/pages')

        // When: El usuario elimina una página
        cy.get('li.gh-list-row.gh-posts-list-item').then(($divs) => {
            const divsAntes = $divs.length
            cy.wrap(divsAntes).as('divsAntes')
        })

        cy.get('li.gh-list-row.gh-posts-list-item').first().click()
        cy.get('button[title="Settings"]').click()
        cy.wait(500)
        cy.url().should('include', '/editor/page')

        cy.get('button[data-test-button="delete-post"]').click()
        cy.get('button[data-test-button="delete-post-confirm"]').click()
        cy.wait(500)

        // Then: La cantidad de páginas disminuye en uno
        cy.get('li.gh-list-row.gh-posts-list-item').then(($divs) => {
            const divsDespues = $divs.length
            cy.wrap(divsDespues).as('divsDespues')
        })

        cy.get('@divsAntes').then((divsAntes) => {
            cy.get('@divsDespues').then((divsDespues) => {
                expect(divsDespues).to.equal(divsAntes - 1)
            })
        })

       
    })

    it('E0066 Editando una Page', () => {
        // Given: El usuario está autenticado y en la página de listado de pages
        cy.get('a[data-test-nav="pages"]').click()
        cy.wait(500)
        cy.url().should('include', '/pages')

        // When: El usuario edita una página
        cy.get('li.gh-list-row.gh-posts-list-item').first().click()
        cy.get('button[title="Settings"]').click()
        cy.wait(500)
        cy.url().should('include', '/editor/page')

        cy.request(mockarooUrl).then((response) => {
            const page = response.body[0];
            cy.get('textarea[data-test-editor-title-input]').clear().type(page.pageTitle)
            cy.get('button[data-test-button="publish-save"]').first().click()
            cy.get('a[href="#/pages/"]').click()
            cy.wait(500)
            cy.url().should('include', '/pages')

            // Then: La página editada aparece en la lista de pages
            cy.contains('h3', page.pageTitle).should('exist')
            
        })
    })

    it('E0067 Creando un page con un titulo mayor a 255 caracteres', () => {
        // Given: El usuario está autenticado y en la página de creación de pages
        cy.get('a[data-test-nav="pages"]').click()
        cy.wait(1500)
        cy.url().should('include', '/pages')

        cy.get('a[data-test-new-page-button]').click()
        cy.wait(1500)
        cy.url().should('include', '/editor/page')

        // When: El usuario crea una nueva página con un título mayor a 255 caracteres
        cy.request(mockarooUrl).then((response) => {
            const page = response.body[0];
            const largeTitle = page.largeTitle;
            const pageContent = page.pageContent;
            cy.get('div[data-lexical-editor="true"]').first().type(pageContent)
            cy.get('textarea[data-test-editor-title-input]').type(largeTitle)
            cy.get('div[data-lexical-editor="true"]').first().click()
            cy.get('button[data-test-button="publish-flow"]').first().click()
            cy.wait(500)

            // Then: El mensaje de error se muestra en la pantalla
            cy.contains('div', "Validation failed: Title cannot be longer than 255 characters.").should('exist')
            
        })
    })
})