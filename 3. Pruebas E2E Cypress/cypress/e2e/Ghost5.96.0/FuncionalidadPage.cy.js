

const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad page', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })
    it('E0011 Creando Page con titulo y contenido', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="pages"]').click()
            cy.wait(1500)
            cy.url().should('include', '/pages')

            cy.get('a[data-test-new-page-button]').click()
            cy.wait(1500)
            cy.url().should('include', '/editor/page')

            cy.fixture('pagesData.json').then((page) => {
                cy.get('textarea[data-test-editor-title-input]').type(page.pageTitle)
                cy.get('div[data-lexical-editor="true"]').first().type(page.contenido)
                cy.get('button[data-test-button="publish-flow"]').first().click()
                cy.get('button[data-test-button="continue"]').click()
                cy.wait(500)
                cy.get('button[data-test-button="confirm-publish"]').click()
                cy.get('button[data-test-button="close-publish-flow"]').click()
                cy.wait(500)
                cy.url().should('include', '/pages')
                //verificar creacion
                cy.contains('h3', page.pageTitle).should('exist')
            })

            cy.screenshot(`${ghostVersion}/nueva-page`)
        })
    })

    it('E0012 Creando Page con titulo y sin contenido', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="pages"]').click()
            cy.wait(1500)
            cy.url().should('include', '/pages')

            cy.get('a[data-test-new-page-button]').click()
            cy.wait(1500)
            cy.url().should('include', '/editor/page')

            cy.fixture('pagesData.json').then((page) => {
                cy.get('textarea[data-test-editor-title-input]').type(page.pageTitle2)
                cy.get('div[data-lexical-editor="true"]').first().focus()
                cy.wait(500)
                cy.get('button[data-test-button="publish-flow"]').first().click()
                cy.get('button[data-test-button="continue"]').click()
                cy.wait(500)
                cy.get('button[data-test-button="confirm-publish"]').click()
                cy.get('button[data-test-button="close-publish-flow"]').click()
                cy.wait(500)
                cy.url().should('include', '/pages')
                //verificar creacion
                cy.contains('h3', page.pageTitle2).should('exist')
            })

            cy.screenshot(`${ghostVersion}/nueva-page-sin-contenido`)
        })
    })

    it('E0013 Eliminando una Page', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="pages"]').click()
            cy.wait(500)
            cy.url().should('include', '/pages')

            // Contar la cantidad antes de la eliminación
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

            // Contar la cantidad despues de la eliminación
            cy.get('li.gh-list-row.gh-posts-list-item').then(($divs) => {
                const divsDespues = $divs.length
                cy.wrap(divsDespues).as('divsDespues')
            })

            cy.get('@divsAntes').then((divsAntes) => {
                cy.get('@divsDespues').then((divsDespues) => {
                    expect(divsDespues).to.equal(divsAntes - 1)
                })
            })

            cy.screenshot(`${ghostVersion}/eliminar-page`)
        })
    })

    it('E0014 Editando una Page', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="pages"]').click()
            cy.wait(500)
            cy.url().should('include', '/pages')

            cy.get('li.gh-list-row.gh-posts-list-item').first().click()

            cy.get('button[title="Settings"]').click()
            cy.wait(500)
            cy.url().should('include', '/editor/page')

            cy.get('textarea[data-test-editor-title-input]').clear()
            cy.get('textarea[data-test-editor-title-input]').type('Page editada')
            cy.get('button[data-test-button="publish-save"]').first().click()
            cy.get('a[href="#/pages/"]').click()
            cy.wait(500)
            cy.url().should('include', '/pages')
            //verificar edicion
            cy.contains('h3', 'Page editada').should('exist')

            cy.screenshot(`${ghostVersion}/editar-page`)
        })
    })
})