describe('Smoke tests', () => {
  beforeEach(() => {
    cy.request('GET', '/api/todos')
      .its('body')
      .each(todo =>
        cy.request('DELETE', `/api/todos/${todo.id}`));
  });

  context('With no todos', () => {
    it('Saves new todos', () => {
      const items = [
        { text: 'Buy milk', expectedLength: 1 },
        { text: 'Buy eggs', expectedLength: 2 },
        { text: 'Buy bread', expectedLength: 3 },
      ];
      cy.visit('/');
      cy.server();
      cy.route('POST', '/api/todos')
        .as('req');

      cy.wrap(items)
        .each(item => {
          cy.focused()
            .type(item.text)
            .type('{enter}');

          cy.wait('@req');
          cy.get('.todo-list li')
            .should('have.length', item.expectedLength);
        });
    });
  });

  context('With active todos', () => {
    beforeEach(() => {
      cy.fixture('todos')
        .each(todo => {
          const newTodo = Cypress._.merge(todo, { isComplete: false });
          cy.request('POST', '/api/todos', newTodo);
        });
      cy.visit('/');
    });

    it('loads existing data from the DB', function() {
      cy.get('.todo-list li')
        .should('have.length', 4);
    });

    it('deletes todos', function() {
      cy.server();
      cy.route('DELETE', '/api/todos/*')
        .as('delete');
      cy.get('.todo-list li')
        .each($el => {
          cy.wrap($el)
            .find('.destroy')
            .invoke('show')
            .click();
          cy.wait('@delete');
        })
        .should('not.exist');
    });

    it('toggles todos ', function() {
      const clickAndWait = ($el) => {
        cy.wrap($el)
          .as('item')
          .find('.toggle')
          .click();
        cy.wait('@update');
      }
      cy.server();
      cy.route('PUT', '/api/todos/*')
        .as('update');
      cy.get('.todo-list li')
        .each($el => {
          clickAndWait($el);
          cy.get('@item')
            .should('have.class', 'completed');
        })
        .each($el => {
          clickAndWait($el);
          cy.get('@item')
            .should('not.have.class', 'completed');
        })
    });
  });
});