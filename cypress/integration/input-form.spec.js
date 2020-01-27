describe('Input form', function() {
  beforeEach(() => {
    cy.seedAndVisit([]);
  });

  it('focuses input on load ', function() {

    cy.focused().should('have.class', 'new-todo');
  });

  it('accepts input', function() {
    const typedText = 'Buy Milk';
    cy.get('.new-todo').type(typedText).should('have.value', typedText);
  });

  context('Form submission', () => {
    beforeEach(() => {
      cy.server();
    })
    it('Adds new todo on submit', () => {
      const itemText = 'Buy eggs';
      cy.route('POST', '/api/todos', {
        name: itemText,
        id: 1,
        isComplete: false,
      });
      cy.get('.new-todo').
        type(itemText).
        type('{enter}').
        should('have.value', '');
      cy.get('.todo-list li').should('have.length', 1).and('contain', itemText);
    });

    it('shows an error message on a failed submission', function() {
      cy.route({
        url: '/api/todos',
        method: 'POST',
        status: 500,
        response: {}
      });

      cy.get('.new-todo')
        .type('test{enter}')
      cy.get('.todo-list li').should('not.exist');
      cy.get('.error').should('be.visible');
    });
  });
});