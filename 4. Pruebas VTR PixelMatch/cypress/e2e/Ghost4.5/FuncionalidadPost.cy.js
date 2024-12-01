import { faker } from '@faker-js/faker';


const ghostVersion = Cypress.env('GHOST_VERSION_OLD');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad Post', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPageOld)
        })
    })

    it('E0009 Creando un nuevo post', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(500)
            cy.url().should('include', '/dashboard')

            cy.get('a[href="#/posts/"]').first().click()
            cy.wait(500)
            cy.url().should('include', '/posts')

            cy.get('a').contains('New post').click()
            cy.wait(500)
            cy.url().should('include', '/editor/post')

            let postTitle = faker.lorem.sentence()
            cy.get('textarea[placeholder="Post Title"]').type(postTitle)
            let postContent = faker.lorem.paragraphs()
            cy.get('div[data-placeholder="Begin writing your post..."]').first().type(postContent)
            cy.get('div.gh-publishmenu-trigger').click()
            cy.get('button:contains("Publish")').click()
            cy.wait(500)
            cy.get('a[href="#/posts/"]').first().click()

            //verificar creación
            cy.contains('h3', postTitle).should('exist')

            cy.screenshot(`${ghostVersion}/nuevo-post`)
        })
    })

    it('E0010 Eliminando un post', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(500)
            cy.url().should('include', '/dashboard')
        })

        cy.get('a[href="#/posts/"]').first().click()
        cy.wait(500)
        cy.url().should('include', '/posts')

        // Contar el número de <div> antes de la eliminación
        cy.get('li[class="gh-list-row gh-posts-list-item"]').then(($divs) => {
            const divsAntes = $divs.length
            cy.wrap(divsAntes).as('divsAntes')
        })

        // Hacer clic en el primer elemento de la lista de post
        cy.get('li[class="gh-list-row gh-posts-list-item"]').first().find('a').first().click()
        cy.get('button[title="Settings"]').click()
        cy.get('button.settings-menu-delete-button').click()
        cy.wait(500)
        cy.get('button.gh-btn.gh-btn-red.gh-btn-icon').click()
        cy.wait(500)
        cy.url().should('include', '/posts')

        // Contar el número de <div> después de la eliminación
        cy.get('li[class="gh-list-row gh-posts-list-item"]').then(($divs) => {
            const divsDespues = $divs.length
            cy.wrap(divsDespues).as('divsDespues')
        })

        // Verificar que el número de divs después sea el número de divs antes - 1
        cy.get('@divsAntes').then((divsAntes) => {
            cy.get('@divsDespues').then((divsDespues) => {
                expect(divsDespues).to.equal(divsAntes - 1)
            })
        })

        cy.screenshot(`${ghostVersion}/eliminar-post`)

    })

})