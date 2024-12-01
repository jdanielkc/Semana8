import { faker } from '@faker-js/faker';


const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad Post', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })

    it('E0015 Creando un nuevo post', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="posts"]').click()
            cy.wait(1500)
            cy.url().should('include', '/posts')

            cy.get('a[data-test-new-post-button]').click()
            cy.wait(1500)
            cy.url().should('include', '/editor/post')

            let postTitle = faker.lorem.sentence()
            cy.get('textarea[data-test-editor-title-input]').type(postTitle)
            let postContent = faker.lorem.paragraphs()
            cy.get('div[data-lexical-editor="true"]').first().type(postContent)

            cy.get('button[data-test-button="publish-flow"]').first().click()
            cy.get('button[data-test-button="continue"]').click()
            cy.wait(500)
            cy.get('button[data-test-button="confirm-publish"]').click()
            cy.get('button[data-test-button="close-publish-flow"]').click()
            cy.wait(500)
            cy.url().should('include', '/posts')

            //verificar creación
            cy.contains('h3', postTitle).should('exist')

            cy.screenshot(`${ghostVersion}/nuevo-post`)
        })
    })

    it('E0016 Eliminando un post', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="posts"]').click()
            cy.wait(1500)
            cy.url().should('include', '/posts')

            // Contar el número de <div> antes de la eliminación
            cy.get('div.posts-list > div.gh-posts-list-item-group').then(($divs) => {
                const divsAntes = $divs.length
                cy.wrap(divsAntes).as('divsAntes')
            })

            // Hacer clic en el primer elemento de la lista de post
            cy.get('div.posts-list li.gh-posts-list-item').first().find('a.gh-list-data').first().click()
            cy.wait(500)

            cy.get('button[data-test-psm-trigger]').click()
            cy.get('button[data-test-button="delete-post"]').click()
            cy.get('button[data-test-button="delete-post-confirm"]').click()
            cy.get('a[data-test-nav="posts"]').click()
            cy.url().should('include', '/posts')

            // Contar el número de <div> después de la eliminación
            cy.get('div.posts-list > div.gh-posts-list-item-group').then(($divs) => {
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

    it('E0017 Editando un post', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="posts"]').click()
            cy.wait(1500)
            cy.url().should('include', '/posts')

            // Hacer clic en el primer elemento de la lista de post
            cy.get('div.posts-list li.gh-posts-list-item').first().find('a.gh-list-data').first().click()
            cy.wait(500)

            let postTitle = faker.lorem.sentence()
            cy.get('textarea[data-test-editor-title-input]').clear().type(postTitle)

            cy.get('button[data-test-button="publish-save"]').first().click()
            cy.get('a[href="#/posts/"]').first().click()
            cy.wait(500)
            cy.url().should('include', '/posts')

            //verificar edición
            cy.contains('h3', postTitle).should('exist')

            cy.screenshot(`${ghostVersion}/editar-post`)
        })
    })

})