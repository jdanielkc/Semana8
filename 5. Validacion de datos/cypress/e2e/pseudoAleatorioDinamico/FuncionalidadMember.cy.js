const ghostVersion = Cypress.env('GHOST_VERSION');
const mockarooUrl = 'https://my.api.mockaroo.com/pseudo_aleatorio.json?key=5c1e2be0';

describe('Tester de funcionalidad Member', () => {
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

    it('E0057 Añadiendo usuario administrativo como miembro', () => {
        // Given: El usuario está autenticado y en la página de miembros
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        // When: El usuario añade un usuario administrativo como miembro
        cy.get('button[data-test-button="add-yourself"]').click()
        cy.wait(1500)

        // Then: Verificar creación
        cy.fixture('userLogin.json').then((user) => {
            cy.contains('h3', user.userLoginName).should('exist')
        })
        cy.get('button[data-test-button="close-notification"]').click()
        cy.wait(500)
        
    })

    it('E0058 Creando un nuevo miembro', () => {
        // Given: El usuario está autenticado y en la página de creación de miembros
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('a:contains("New member")').click()
        cy.wait(1000)
        cy.url().should('include', '/members/new')

        // When: El usuario crea un nuevo miembro
        cy.request(mockarooUrl).then((response) => {
            const member = response.body[0];
            cy.get('input[data-test-input="member-name"]').type(member.fullName, { force: true })
            cy.get('input[data-test-input="member-email"]').type(member.email, { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(member.word + '{enter}', { force: true })

            cy.get('button[data-test-button="save"]').click()
            cy.get('a[data-test-nav="members"]').click()
            cy.wait(1500)

            // Then: Verificar creación
            cy.contains('h3', member.fullName).should('exist')
            
        })
    })

    it('E0059 Creando un nuevo miembro con email no valido', () => {
        // Given: El usuario está autenticado y en la página de creación de miembros
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('a:contains("New member")').click()
        cy.wait(1000)
        cy.url().should('include', '/members/new')

        // When: El usuario crea un nuevo miembro con email no válido
        cy.request(mockarooUrl).then((response) => {
            const member = response.body[0];
            cy.get('input[data-test-input="member-name"]').type(member.fullName, { force: true })
            cy.get('input[data-test-input="member-email"]').type(member.invalidEmail, { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(member.word + '{enter}', { force: true })

            cy.get('button[data-test-button="save"]').click()

            // Then: Verificar mensaje de error
            cy.contains('p', "Invalid Email.").should('exist')
            
        })
    })

    it('E0060 Creando un nuevo miembro con campo nota mayor a 500 caracteres', () => {
        // Given: El usuario está autenticado y en la página de creación de miembros
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('a:contains("New member")').click()
        cy.wait(1000)
        cy.url().should('include', '/members/new')

        // When: El usuario crea un nuevo miembro con una nota mayor a 500 caracteres
        cy.request(mockarooUrl).then((response) => {
            const member = response.body[0];
            cy.get('input[data-test-input="member-name"]').type(member.fullName, { force: true })
            cy.get('input[data-test-input="member-email"]').type(member.email, { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(member.word + '{enter}', { force: true })
            cy.get('#member-note').type(member.largeNote, { force: true })
            cy.get('button[data-test-button="save"]').click()

            // Then: Verificar mensaje de error
            cy.contains('p', "Note is too long.").should('exist')
            
        })
    })

    it('E0061 Eliminando un miembro', () => {
        // Given: El usuario está autenticado y en la página de listado de miembros
        cy.get('a[data-test-nav="members"]').click()
        cy.url().should('include', '/members')
        cy.wait(1500)

        // When: El usuario elimina un miembro
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

        // Then: Verificar que el número de filas después sea el número de filas antes - 1
        cy.get('table tbody tr').then(($filas) => {
            const filasDespues = $filas.length
            cy.wrap(filasDespues).as('filasDespues')
        })

        cy.get('@filasAntes').then((filasAntes) => {
            cy.get('@filasDespues').then((filasDespues) => {
                expect(filasDespues).to.equal(filasAntes - 1)
            })
        })

        
    })

    it('E0062 Eliminando miembro administrador', () => {
        // Given: El usuario está autenticado y en la página de listado de miembros
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        // When: El usuario elimina un miembro administrador
        cy.get('a[data-test-table-data="details"]').first().click()
        cy.wait(1500)

        cy.get('button[data-test-button="member-actions"]').click()
        cy.get('button[data-test-button="delete-member"]').click()
        cy.get('button[data-test-button="confirm"]').click()
        cy.url().should('include', '/members')

        // Then: Verificar que el botón "add-yourself" existe
        cy.get('button[data-test-button="add-yourself"]').should('exist')
        cy.get('a[data-test-nav="members"]').click()
        
    })
})