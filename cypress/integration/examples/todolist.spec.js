describe('Старт', function() {
  beforeEach(() => {
    cy.visit('/')
  })
  const typedText = 'Buy a bread'
   it('Приложение загружается и фокус на инпуте нового задания', function() {
     cy.focused()
      .should('have.class', 'main-input')
   })

   it('В инпут что-то вводится', () => {
     cy.get('.main-input')
      .type(typedText)
      .should('have.value', typedText)
   })

   context('Инициализация заданий', () => {
     it('Новое задание добавляется', () => {
        cy.get('.main-input')
          .type(typedText)
          cy.get('.add-task').click()

        cy.get('.main-input')
          .should('have.value', '')

        cy.get('.main-tasks_list')
          .should('have.length', 1)
          .and('contain', typedText)
     })

     it('Если поле ввода нового задания пустое выведи алерт с ошибкой', () => {
      const stub = cy.stub()
      cy.on('window:alert', stub)
      cy
        .get('.main-input')
          .invoke('val', '')
        cy.get('.add-task').click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('You tried add empty value to the field. Please, type something.')
        })
      })

      it('Задания сохраняются в локал сторе после обновления страницы', () => {
        cy
          .get('.main-input')
            .type(typedText)
            .get('.add-task').click()
          .reload()
          .get('.main-tasks_list')
            .should('have.length', 1)
            .and('contain', typedText)
     })
   })
   context('Работа с заданием', () => {
    it('Добавить и удалить задание', () => {
      cy
        .get('.main-input')
          .type(typedText)
          cy.get('.add-task').click()
        .get('.delete-task').click()
        .get('.main-tasks_list')
          .should('be.empty')
     })
    
    it('Добавить и изменить текст задания', () => {
      cy
        .get('.main-input')
          .type(typedText)
          .get('.add-task').click()
        .get('.edit-task-false').click()
          .get('.edit-task-true')
            .type('1')
          .should('have.value', typedText + '1')
        .get('.main-input').click()
    })
   })
 })