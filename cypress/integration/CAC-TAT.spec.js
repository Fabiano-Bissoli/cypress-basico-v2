/// <reference types="Cypress" />

//Dicas:
// quando usado o "it.only" em un caso de teste, somente ele é executado.

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios da aplicação', function() {
        const longText = 'Teste, teste, teste teste, teste, teste, teste,teste, teste, teste, teste, teste, teste,'

        cy.get('#firstName').type('Fabiano')
        cy.get('#lastName').type('Bissoli')
        cy.get('#email').type('fabiano@teste.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('preenche os campos obrigatórios da aplicação com o email inválido', function() {
        const longText = 'Teste, teste, teste teste, teste, teste, teste,teste, teste, teste, teste, teste, teste,'

        cy.get('#firstName').type('Fabiano')
        cy.get('#lastName').type('Bissoli')
        cy.get('#email').type('fabiano@teste,com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valores não numéricos', function() {
        cy.get('#phone')
            .type('abcdefgh')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o campo telefone se torna obrigatório e não for preenchido', function() {
        const longText = 'Teste, teste, teste teste, teste, teste, teste,teste, teste, teste, teste, teste, teste,'

        cy.get('#firstName').type('Fabiano')
        cy.get('#lastName').type('Bissoli')
        cy.get('#email').type('fabiano@teste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        const longText = 'Teste, teste, teste teste, teste, teste, teste,teste, teste, teste, teste, teste, teste,'

        cy.get('#firstName')
            .type('Fabiano')
            .should('have.value', 'Fabiano')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Bissoli')
            .should('have.value', 'Bissoli')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('fabiano@teste.com')
            .should('have.value', 'fabiano@teste.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('34999586987')
            .should('have.value', '34999586987')
            .clear()
            .should('have.value', '')
        cy.get('#open-text-area')
            .type(longText, { delay: 0 })
            .should('have.value', longText)
            .clear()
            .should('have.value', '')
    })

    it('exibe a mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('digitando em campos e clicando em elementos', function() {
        cy.get('#firstName').type('Fabiano')
        cy.get('#lastName').type('Bissoli')
        cy.get('#email').type('fabiano@teste.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click() //-> Neste exemplo usei o seeletor genérico "button" que contem o texto "Enviar"

        cy.get('.success').should('be.visible')
    })

    it('selecione o produto {YouTube} pelo seu texto', function() {
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })

    it('selecione o produto {Mentoria} pelo seu valor', function() {
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')
    })

    it('selecione o produto {Blog} pelo seu índice', function() {
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')
    })

    //Selecionar o radio button
    it('marcar o tipo de atendimento "Feedback"', function() {
        cy.get('input[type=radio][value=feedback]')
          .check()
          .should('have.value', 'feedback')
    })

    it('marcar cada tipo de atendimento', function() {
        cy.get('input[type="radio"]') // Seleciona todos os elemento radio
          .should('have.length', 3) // Valida que são três elementos do tipo radio
          .each(function($radio) { // Nessa função ele marcar o primeiro e verica se foi narcado, fazendo isso para o segundo e o terceiro.
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
          })
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]') // Seleciona todos os seletores genéricos do tipo "checkbox"
          .check() // marca todos os seletores do tipo "checkbox"
          .last() //seleciona o último checkbox
          .uncheck() // desmarca o último checkbox
          .should('not.be.checked') // Valida que o último seletor do tipo "checkbox" esteja desmarcado
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]') // Seleciona o botão "Escolher arquivo"
          .should('not.have.value') // Valida que não há nenhum arquivo selecionado 
          .selectFile('./cypress/fixtures/example.json') //Seleciona o arquivo na pasta "fixtures" do projeto
          .should(function($input) { // Valida se o arquivo selecionado é de fato o arquivo escolhido através de uma função
            console.log($input) // Verifica através do log os elementos do "$input" no console através do jQuery mostrando os seus parametros   
            expect($input[0].files[0].name).to.equal('example.json') //Validando o índice do arquivo e o seu nome
          })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]') // Seleciona o botão "Escolher arquivo"
          .should('not.have.value') // Valida que não há nenhum arquivo selecionado 
          .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop'}) //Seleciona o arquivo simulando o arrasto de uma arquivo em uma pasta para o campo da tela
          .should(function($input) { // Valida se o arquivo selecionado é de fato o arquivo escolhido através de uma função
            console.log($input) // Verifica através do log os elementos do "$input" no console através do jQuery mostrando os seus parametros   
            expect($input[0].files[0].name).to.equal('example.json') //Validando o índice do arquivo e o seu nome
          })
    })

    it('seleciona um arquivo utilizando uma fixture para qual foi dada uma alias', function() {
        cy.fixture('example.json').as('sampleFile') // Cria um alias da pasta "fixture"
        cy.get('input[type="file"]') // Seleciona o botão "Escolher arquivo"
          .selectFile('@sampleFile') //Seleciona o arquivo através do alias
          .should(function($input) { // Valida se o arquivo selecionado é de fato o arquivo escolhido através de uma função
            expect($input[0].files[0].name).to.equal('example.json') //Validando o índice do arquivo e o seu nome
          })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank') // Verifiva que o link abra em outra aba 
    })

    it.only('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a') // Seleciona o elemento do link "Política de privacidade"
          .invoke('removeAttr', 'target') // Remove o target fazendo com que link abra na mesma aba e permitindo a validação do mesmo
          .click() // Clica no link "Política de privacidade"

        cy.contains('Talking About Testing').should('be.visible') // Valida se a página está habilitada e sendo exibida corretamente
    })

})
  