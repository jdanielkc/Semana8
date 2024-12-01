import { faker } from '@faker-js/faker';

const ghostVersion = Cypress.env('GHOST_VERSION_OLD');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad Member', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPageOld)
        })
    })

    it('E0003 Añadiendo usuario administrativo como miembro', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[href="#/members/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/members')

            cy.get('button.gh-btn.gh-btn-green').contains('Add yourself as a member to test').click()
            cy.wait(1500)

            //verificar creación
            cy.contains('h3', user.userLoginName).should('exist')

            cy.wait(1000)
            cy.screenshot(`${ghostVersion}/agregar-usuario-administrativo`)
        })
    })

    it('E0004 Creando un nuevo miembro', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[href="#/members/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/members')

            cy.get('a[href="#/members/new/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/members/new')

            let memberName = faker.person.fullName()
            cy.get('input[id="member-name"]').type(memberName)
            cy.get('input[id="member-email"]').type(faker.internet.email())
            cy.get('input[class="ember-power-select-trigger-multiple-input"]').type(faker.word.verb() + '{enter}')

            cy.get('button:contains("Save")').click()
            cy.wait(1500)

            cy.get('a[href="#/members/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/members')

            //verificar creación
            cy.contains('h3', memberName).should('exist')
            cy.wait(1000)
            cy.screenshot(`${ghostVersion}/nuevo-miembro`)
        })
    })
    it('E0005 Eliminando un miembro', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')
        })
        cy.get('a[href="#/members/"]').first().click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('li[class="gh-list-row gh-members-list-item "').then(($filas) => {
            const filasAntes = $filas.length
            cy.wrap(filasAntes).as('filasAntes')
        })

        cy.get('li[class="gh-list-row gh-members-list-item "]').first().find('a').first().click()
        cy.get('button:contains("Delete member")').click()
        cy.wait(1000)
        cy.get('button:contains("Delete member")').last().click()
        cy.wait(1500)

        cy.get('li[class="gh-list-row gh-members-list-item "').then(($filas) => {
            const filasDespues = $filas.length
            cy.wrap(filasDespues).as('filasDespues')
        })

        // Verificar que el numero de filas despues sea el numero de filas antes - 1
        cy.get('@filasAntes').then((filasAntes) => {
            cy.get('@filasDespues').then((filasDespues) => {
                expect(filasDespues).to.equal(filasAntes - 1)
            })
        })

        cy.screenshot(`${ghostVersion}/eliminar-miembro`)

    })

    it('E0006 Eliminando miembro administrador', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('input[name="identification"]').type(user.email)
            cy.get('input[name="password"]').type(user.password)
            cy.get('button[id="ember12"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[href="#/members/"]').first().click()
            cy.wait(1500)
            cy.url().should('include', '/members')


            cy.get('li[class="gh-list-row gh-members-list-item "]').first().find('a').first().click()
            cy.get('button:contains("Delete member")').click()
            cy.wait(1000)
            cy.get('button:contains("Delete member")').last().click()

            cy.wait(1500)

            // verificar que add-yourself existe
            cy.get('button').contains('Add yourself as a member to test').should('exist')

            cy.screenshot(`${ghostVersion}/eliminar-miembro-administrador`)
        })
    })

})