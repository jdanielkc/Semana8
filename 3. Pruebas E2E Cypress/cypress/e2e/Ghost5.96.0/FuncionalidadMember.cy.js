import { faker } from '@faker-js/faker';

const ghostVersion = Cypress.env('GHOST_VERSION');
const ghostPort = Cypress.env('GHOST_PORT');

describe('Tester de funcionalidad Member', () => {
    beforeEach(() => {
        cy.fixture('userLogin.json').then((user) => {
            cy.visit(user.loginPage)
        })
    })

    it('E0007 Añadiendo usuario administrativo como miembro', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="members"]').click()
            cy.wait(1500)
            cy.url().should('include', '/members')

            cy.get('button[data-test-button="add-yourself"]').click()
            cy.wait(1500)

            //verificar creación
            cy.contains('h3', user.userLoginName).should('exist')

            cy.get('button[data-test-button="close-notification"]').click()
            cy.wait(500)
            cy.screenshot(`${ghostVersion}/agregar-usuario-administrativo`)
        })
    })

    it('E0008 Creando un nuevo miembro', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="members"]').click()
            cy.wait(1500)
            cy.url().should('include', '/members')

            cy.get('a:contains("New member")').click()
            cy.wait(1000)
            cy.url().should('include', '/members/new')
            let memberName = faker.person.fullName()
            cy.get('input[data-test-input="member-name"]').type(memberName, { force: true })
            cy.get('input[data-test-input="member-email"]').type(faker.internet.email(), { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(faker.word.verb() + '{enter}', { force: true })

            cy.get('button[data-test-button="save"]').click()
            cy.get('a[data-test-nav="members"]').click()
            cy.wait(1500)
            //verificar creación
            cy.contains('h3', memberName).should('exist')

            cy.screenshot(`${ghostVersion}/nuevo-miembro`)
        })
    })
    it('E0009 Eliminando un miembro', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(2000)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="members"]').click()
            cy.url().should('include', '/members')
            cy.wait(1500)

            cy.get('table tbody tr').then(($filas) => {
                const filasAntes = $filas.length
                cy.wrap(filasAntes).as('filasAntes')
            })


            cy.get('a[data-test-table-data="details"]').first().click()
            cy.wait(1500)

            cy.get('button[data-test-button="member-actions"]').click()
            cy.get('button[data-test-button="delete-member"]').click()
            cy.get('button[data-test-button="confirm"]').click()
            cy.get('a[data-test-nav="members"]').click()
            cy.url().should('include', '/members')

            cy.get('table tbody tr').then(($filas) => {
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
    })

    it('E0010 Eliminando miembro administrador', () => {
        cy.fixture('userLogin.json').then((user) => {
            cy.get('#identification').type(user.email)
            cy.get('#password').type(user.password)
            cy.get('button[data-test-button="sign-in"]').click()
            cy.wait(1500)
            cy.url().should('include', '/dashboard')

            cy.get('a[data-test-nav="members"]').click()
            cy.wait(1500)
            cy.url().should('include', '/members')

            cy.get('a[data-test-table-data="details"]').first().click()
            cy.wait(1500)

            cy.get('button[data-test-button="member-actions"]').click()
            cy.get('button[data-test-button="delete-member"]').click()
            cy.get('button[data-test-button="confirm"]').click()
            cy.url().should('include', '/members')

            // verificar que add-yourself existe
            cy.get('button[data-test-button="add-yourself"]').should('exist')
            cy.get('a[data-test-nav="members"]').click()
            cy.screenshot(`${ghostVersion}/eliminar-miembro-administrador`)
        })
    })

})