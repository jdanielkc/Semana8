

const ghostVersion = Cypress.env('GHOST_VERSION_OLD');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad page', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPageOld)
        })
    })
    it('E0007 Creando Page con titulo y contenido', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[href="#/pages/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/pages')

            cy.get('a[href="#/editor/page/"]').click()
            cy.wait(1500)
            cy.url().should('include', '/editor/page')

            cy.fixture('pagesData.json').then((page) => {
                cy.get('textarea[placeholder="Page Title"]').type(page.pageTitle)
                cy.get('div[data-placeholder="Begin writing your page..."]').type(page.contenido)
                cy.get('div.gh-publishmenu-trigger').click()
                cy.get('button:contains("Publish")').click()
                cy.wait(1500)
                cy.get('a[href="#/pages/"]').first().click()

                //verificar creacion
                cy.contains('h3', page.pageTitle).should('exist')
            })

            cy.screenshot(`${ghostVersion}/nueva-page`)
        })
    })

    it('E0008 Creando Page con titulo y sin contenido', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[href="#/pages/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/pages')

            cy.get('a[href="#/editor/page/"]').click()
            cy.wait(1500)
            cy.url().should('include', '/editor/page')

            cy.fixture('pagesData.json').then((page) => {
                cy.get('textarea[placeholder="Page Title"]').type(page.pageTitle)
                cy.get('div[data-placeholder="Begin writing your page..."]').focus()
                cy.get('div.gh-publishmenu-trigger').click()
                cy.get('button:contains("Publish")').click()
                cy.wait(1500)
                cy.get('a[href="#/pages/"]').first().click()

                //verificar creacion
                cy.contains('h3', page.pageTitle).should('exist')
            })

            cy.screenshot(`${ghostVersion}/nueva-page-sin-contenido`)
        })
    })
})