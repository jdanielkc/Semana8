const ghostVersion = Cypress.env('GHOST_VERSION');

describe('Tester de funcionalidad Post', () => {
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

    it('E0018 Creando un nuevo post', () => {
        // Given: El usuario está autenticado y en la página de creación de posts
        cy.get('a[data-test-nav="posts"]').click()
        cy.wait(1500)
        cy.url().should('include', '/posts')

        cy.get('a[data-test-new-post-button]').click()
        cy.wait(1500)
        cy.url().should('include', '/editor/post')

        // When: El usuario crea un nuevo post
        cy.fixture('A-priori/page.json').then((post) => {
            const randomIndex = Math.floor(Math.random() * post.length);
            const postData = post[randomIndex];
            cy.get('textarea[data-test-editor-title-input]').type(postData.title)
            cy.get('div[data-lexical-editor="true"]').first().type(postData.Paragraphs)

            cy.get('button[data-test-button="publish-flow"]').first().click()
            cy.get('button[data-test-button="continue"]').click()
            cy.wait(500)
            cy.get('button[data-test-button="confirm-publish"]').click()
            cy.get('button[data-test-button="close-publish-flow"]').click()
            cy.wait(500)
            cy.url().should('include', '/posts')

            // Then: El nuevo post aparece en la lista de posts
            cy.contains('h3', postData.title).should('exist')
        })
    })

    it('E0019 Eliminando un post', () => {
        // Given: El usuario está autenticado y en la página de listado de posts
        cy.get('a[data-test-nav="posts"]').click()
        cy.wait(1500)
        cy.url().should('include', '/posts')

        // When: El usuario elimina un post
        cy.get('div.posts-list > div.gh-posts-list-item-group').then(($divs) => {
            const divsAntes = $divs.length
            cy.wrap(divsAntes).as('divsAntes')
        })

        cy.get('div.posts-list li.gh-posts-list-item').first().find('a.gh-list-data').first().click()
        cy.wait(500)

        cy.get('button[data-test-psm-trigger]').click()
        cy.get('button[data-test-button="delete-post"]').click()
        cy.get('button[data-test-button="delete-post-confirm"]').click()
        cy.get('a[data-test-nav="posts"]').click()
        cy.url().should('include', '/posts')

        // Then: La cantidad de posts disminuye en uno
        cy.get('div.posts-list > div.gh-posts-list-item-group').then(($divs) => {
            const divsDespues = $divs.length
            cy.wrap(divsDespues).as('divsDespues')
        })

        cy.get('@divsAntes').then((divsAntes) => {
            cy.get('@divsDespues').then((divsDespues) => {
                expect(divsDespues).to.equal(divsAntes - 1)
            })
        })
    })

    it('E0020 Editando un post', () => {
        // Given: El usuario está autenticado y en la página de listado de posts
        cy.get('a[data-test-nav="posts"]').click()
        cy.wait(1500)
        cy.url().should('include', '/posts')

        // When: El usuario edita un post
        cy.fixture('A-priori/page.json').then((post) => {
            const randomIndex = Math.floor(Math.random() * post.length);
            const postData = post[randomIndex];
            cy.get('div.posts-list li.gh-posts-list-item').first().find('a.gh-list-data').first().click()
            cy.wait(500)
            cy.get('textarea[data-test-editor-title-input]').clear().type(postData.title)

            cy.get('button[data-test-button="publish-save"]').first().click()
            cy.get('a[href="#/posts/"]').first().click()
            cy.wait(500)
            cy.url().should('include', '/posts')

            // Then: El post editado aparece en la lista de posts
            cy.contains('h3', postData.title).should('exist')
        })
    })

    it('E0021 Creando un post con un titulo mayor a 255 caracteres', () => {
        // Given: El usuario está autenticado y en la página de creación de posts
        cy.get('a[data-test-nav="posts"]').click()
        cy.wait(1500)
        cy.url().should('include', '/posts')

        cy.get('a[data-test-new-post-button]').click()
        cy.wait(1500)
        cy.url().should('include', '/editor/post')

        // When: El usuario crea un nuevo post
        cy.fixture('A-priori/page.json').then((post) => {
            const randomIndex = Math.floor(Math.random() * post.length);
            const postData = post[randomIndex];
            cy.get('div[data-lexical-editor="true"]').first().type(postData.Paragraphs)
            cy.get('textarea[data-test-editor-title-input]').type(postData.large_title)
            cy.get('div[data-lexical-editor="true"]').first().click()

            cy.get('button[data-test-button="publish-flow"]').first().click()

            // Then: El nuevo post aparece en la lista de posts
            cy.contains('div', "Validation failed: Title cannot be longer than 255 characters.").should('exist')
            
        })
    })

})