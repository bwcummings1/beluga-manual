describe("Beluga Main User Flow", () => {
    it("should allow a user to ask a question and receive an answer", () => {
      cy.visit("/")
      cy.get('input[placeholder="Ask a question"]').type("What is the capital of France?")
      cy.get("button").contains("Ask").click()
      cy.get(".answer").should("contain", "Paris")
    })
  
    it("should allow a user to start a new chat", () => {
      cy.visit("/")
      cy.get("button").contains("New Chat").click()
      cy.get('input[placeholder="Ask a question"]').should("be.empty")
    })
  
    it("should display chat history", () => {
      cy.visit("/")
      cy.get('input[placeholder="Ask a question"]').type("What is the capital of France?")
      cy.get("button").contains("Ask").click()
      cy.get(".chat-history").should("contain", "What is the capital of France?")
    })
  })
  
  