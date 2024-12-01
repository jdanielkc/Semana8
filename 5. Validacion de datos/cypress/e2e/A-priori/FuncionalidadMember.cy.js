const ghostVersion = Cypress.env('GHOST_VERSION');

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

    it('E0007 Añadiendo usuario administrativo como miembro', () => {
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('button[data-test-button="add-yourself"]').click()
        cy.wait(1500)

        //verificar creación
        cy.fixture('userLogin.json').then((user) => {
            cy.contains('h3', user.userLoginName).should('exist')
        })
        cy.get('button[data-test-button="close-notification"]').click()
        cy.wait(500)
    })

    it('E0008 Creando un nuevo miembro', () => {
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('a:contains("New member")').click()
        cy.wait(1000)
        cy.url().should('include', '/members/new')
        cy.fixture('A-priori/Member.json').then((member) => {
            const randomIndex = Math.floor(Math.random() * member.length);
            const SelectedMember = member[randomIndex];
            cy.get('input[data-test-input="member-name"]').type(SelectedMember.full_name, { force: true })
            cy.get('input[data-test-input="member-email"]').type(SelectedMember.email, { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(SelectedMember.word + '{enter}', { force: true })

            cy.get('button[data-test-button="save"]').click()
            cy.get('a[data-test-nav="members"]').click()
            cy.wait(1500)
            //verificar creación
            cy.contains('h3', SelectedMember.full_name).should('exist')

        })
    })

    // ingresando email no valido
    it('E0009 Creando un nuevo miembro con email no valido', () => {
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('a:contains("New member")').click()
        cy.wait(1000)
        cy.url().should('include', '/members/new')
        cy.fixture('A-priori/Member.json').then((member) => {
            const randomIndex = Math.floor(Math.random() * member.length);
            const SelectedMember = member[randomIndex];
            cy.get('input[data-test-input="member-name"]').type(SelectedMember.full_name, { force: true })
            cy.get('input[data-test-input="member-email"]').type(SelectedMember.invalid_email, { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(SelectedMember.word + '{enter}', { force: true })

            cy.get('button[data-test-button="save"]').click()

            //verificar mensaje error
            cy.contains('p', "Invalid Email.").should('exist')
        })
    })

    it('E0010 Creando un nuevo miembro con campo nota mayor a 500 caracteres', () => {
        cy.get('a[data-test-nav="members"]').click()
        cy.wait(1500)
        cy.url().should('include', '/members')

        cy.get('a:contains("New member")').click()
        cy.wait(1000)
        cy.url().should('include', '/members/new')
        cy.fixture('A-priori/Member.json').then((member) => {
            const randomIndex = Math.floor(Math.random() * member.length);
            const SelectedMember = member[randomIndex];
            cy.get('input[data-test-input="member-name"]').type(SelectedMember.full_name, { force: true })
            cy.get('input[data-test-input="member-email"]').type(SelectedMember.email, { force: true })
            cy.get('input.ember-power-select-trigger-multiple-input').type(SelectedMember.word + '{enter}', { force: true })
            cy.get('#member-note').type(SelectedMember.large_note, { force: true })
            cy.get('button[data-test-button="save"]').click()

            //verificar mensaje error
            cy.contains('p', "Note is too long.").should('exist')
        })
    })

    it('E0011 Eliminando un miembro', () => {
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
    })


    it('E0012 Eliminando miembro administrador', () => {

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

    })

})
