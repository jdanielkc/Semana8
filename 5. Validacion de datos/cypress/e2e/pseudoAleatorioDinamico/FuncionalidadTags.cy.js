const ghostVersion = Cypress.env('GHOST_VERSION');
const mockarooUrl = 'https://my.api.mockaroo.com/pseudo_aleatorio.json?key=5c1e2be0';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Tester de funcionalidad Tags', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1000)
            cy.url().should('include', '/dashboard')
        })
    })

    it('E0072 Creando un nuevo Tag', () => {
        // Given: El usuario está autenticado y en la página de creación de tags
        cy.get('a[data-test-nav="tags"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags')

        cy.get('a[href="#/tags/new/"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags/new')

        // When: El usuario crea un nuevo tag
        cy.request(mockarooUrl).then((response) => {
            const tag = response.body[0];
            cy.get('input[data-test-input="tag-name"]').type(tag.tagName)
            cy.get('input[data-test-input="accentColor"]').type(tag.accentColor.replace('#', ''))
            cy.get('textarea[data-test-input="tag-description"]').type(tag.description)

            cy.get('button[data-test-button="save"]').click()
            cy.wait(100)

            // Then: El nuevo tag aparece en la lista de tags
            cy.get('a[data-test-nav="tags"]').click()
            cy.contains('h3', tag.tagName).should('exist')
        })
    })

    it('E0073 Eliminando un tag', () => {
        // Given: El usuario está autenticado y en la página de listado de tags
        cy.get('a[data-test-nav="tags"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags')

        // When: El usuario elimina un tag
        cy.get('ol.tags-list > li.gh-tags-list-item').then(($lis) => {
            const filasAntes = $lis.length
            cy.wrap(filasAntes).as('filasAntes')
        })

        cy.get('ol.tags-list > li.gh-tags-list-item').first().find('a.gh-list-data').first().click()
        cy.wait(500)

        cy.get('button[data-test-button="delete-tag"]').click()
        cy.get('button[data-test-button="confirm"]').click()
        cy.url().should('include', '/tags')

        // Then: La cantidad de tags disminuye en uno
        cy.get('ol.tags-list > li.gh-tags-list-item').then(($lis) => {
            const filasDespues = $lis.length
            cy.wrap(filasDespues).as('filasDespues')
        })

        cy.get('@filasAntes').then((filasAntes) => {
            cy.get('@filasDespues').then((filasDespues) => {
                expect(filasDespues).to.equal(filasAntes - 1)
            })
        })

        
    })

    it('E0074 Editando un tag', () => {
        // Given: El usuario está autenticado y en la página de listado de tags
        cy.get('a[data-test-nav="tags"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags')

        // When: El usuario edita un tag
        cy.get('ol.tags-list > li.gh-tags-list-item').first().find('a.gh-list-data').first().click()
        cy.wait(500)

        cy.request(mockarooUrl).then((response) => {
            const tag = response.body[0];
            cy.get('input[data-test-input="tag-name"]').clear().type(tag.tagName)
            cy.get('input[data-test-input="accentColor"]').clear().type(tag.accentColor.replace('#', ''))
            cy.get('textarea[data-test-input="tag-description"]').clear().type(tag.description)

            cy.get('button[data-test-button="save"]').click()
            cy.get('a[href="#/tags/"]').first().click()
            cy.wait(500)
            cy.url().should('include', '/tags')

            // Then: El tag editado aparece en la lista de tags
            cy.contains('h3', tag.tagName).should('exist')
            
        })
    })

    it('E0075 Creando un tag con una descripcion mayor a 500 caracteres', () => {
        // Given: El usuario está autenticado y en la página de creación de tags
        cy.get('a[data-test-nav="tags"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags')

        cy.get('a[href="#/tags/new/"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags/new')

        // When: El usuario crea un nuevo tag
        cy.request(mockarooUrl).then((response) => {
            const tag = response.body[0];
            const largeDescription = tag.largeDescription;
            cy.get('input[data-test-input="tag-name"]').type(tag.tagName)
            cy.get('input[data-test-input="accentColor"]').type(tag.accentColor.replace('#', ''))
            cy.get('textarea[data-test-input="tag-description"]').type(largeDescription)

            cy.get('button[data-test-button="save"]').click()

            // Then: Verificar mensaje de error
            cy.contains('p', "Description cannot be longer than 500 characters.").should('exist')

            
        })
    })
})