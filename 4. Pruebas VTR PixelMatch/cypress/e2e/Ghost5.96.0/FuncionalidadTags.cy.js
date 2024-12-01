import { faker } from '@faker-js/faker';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad Tags', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })

    it('E0018 Creando un nuevo Tag', () => {
        cy.fixture('userLogin.json').then((user) => {
            //Inicio de sesión
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1000)
            cy.url().should('include', '/dashboard')

            // Creación de Tag
            cy.get('a[data-test-nav="tags"]').click()
            cy.wait(1000)
            cy.url().should('include', '/tags')

            cy.get('a[href="#/tags/new/"]').click()
            cy.wait(1000)
            cy.url().should('include', '/tags/new')

            let tagName = faker.lorem.word()
            let accentColor = faker.number.int({ max: 400000, min: 100000 }).toString().padStart(6, '0')
            let description = faker.lorem.sentence()
            cy.get('input[data-test-input="tag-name"]').type(tagName)
            cy.get('input[data-test-input="accentColor"]').type(`${accentColor}`)
            cy.get('textarea[data-test-input="tag-description"]').type(description)

            cy.get('button[data-test-button="save"]').click()
            cy.wait(100)

            //verificar creación
            cy.get('a[data-test-nav="tags"]').click()
            cy.contains('h3', tagName).should('exist')

            cy.screenshot(`${ghostVersion}/nuevo-tag`)
        })
    })

    it('E0019 Eliminando un tag', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })

        cy.get('a[data-test-nav="tags"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags')

        // Contar el número de <div> antes de la eliminación
        cy.get('ol.tags-list > li.gh-tags-list-item').then(($lis) => {
            const filasAntes = $lis.length
            cy.wrap(filasAntes).as('filasAntes')
        })

        // Hacer clic en el primer elemento de la lista de post
        cy.get('ol.tags-list > li.gh-tags-list-item').first().find('a.gh-list-data').first().click()
        cy.wait(500)

        cy.get('button[data-test-button="delete-tag"]').click()
        cy.get('button[data-test-button="confirm"]').click()
        cy.url().should('include', '/tags')

        // Contar el número de filas <li> después de la eliminación
        cy.get('ol.tags-list > li.gh-tags-list-item').then(($lis) => {
            const filasDespues = $lis.length
            cy.wrap(filasDespues).as('filasDespues')
        })

        // Verificar que el número de divs después sea el número de divs antes - 1
        cy.get('@filasAntes').then((filasAntes) => {
            cy.get('@filasDespues').then((filasDespues) => {
                expect(filasDespues).to.equal(filasAntes - 1)
            })
        })

        cy.screenshot(`${ghostVersion}/eliminar-tag`)

    })

    it('E0020 Editando un tag', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })

        cy.get('a[data-test-nav="tags"]').click()
        cy.wait(1000)
        cy.url().should('include', '/tags')

        // Hacer clic en el primer elemento de la lista de post
        cy.get('ol.tags-list > li.gh-tags-list-item').first().find('a.gh-list-data').first().click()
        cy.wait(500)

        let tagName = faker.lorem.word()
        let accentColor = faker.number.int({ max: 400000, min: 100000 }).toString().padStart(6, '0')
        let description = faker.lorem.sentence()
        cy.get('input[data-test-input="tag-name"]').clear().type(tagName)
        cy.get('input[data-test-input="accentColor"]').clear().type(`${accentColor}`)
        cy.get('textarea[data-test-input="tag-description"]').clear().type(description)

        cy.get('button[data-test-button="save"]').click()
        cy.get('a[href="#/tags/"]').first().click()
        cy.wait(500)
        cy.url().should('include', '/tags')

        //verificar edición
        cy.contains('h3', tagName).should('exist')

        cy.screenshot(`${ghostVersion}/editar-tag`)
    })

})