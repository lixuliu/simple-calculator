class Calculator {
  constructor() {
    this.previousOperand = "";
    this.currentOperand = "0";
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.isScientificMode = false;

    this.initializeEventListeners();
    this.updateDisplay();
  }

  initializeEventListeners() {
    // Mode toggle
    document.getElementById("mode-toggle").addEventListener("click", () => {
      this.toggleMode();
    });

    // Number buttons
    document.querySelectorAll("[data-number]").forEach((button) => {
      button.addEventListener("click", () => {
        this.appendNumber(button.dataset.number);
      });
    });

    // Operator buttons
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;

        switch (action) {
          case "add":
            this.chooseOperation("+");
            break;
          case "subtract":
            this.chooseOperation("−");
            break;
          case "multiply":
            this.chooseOperation("×");
            break;
          case "divide":
            this.chooseOperation("÷");
            break;
          case "equals":
            this.compute();
            break;
          case "clear":
            this.clear();
            break;
          case "delete":
            this.delete();
            break;
          // Scientific functions
          case "sqrt":
            this.squareRoot();
            break;
          case "power":
            this.square();
            break;
          case "percent":
            this.percent();
            break;
          case "inverse":
            this.inverse();
            break;
        }
      });
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      this.handleKeyboard(e);
    });
  }

  toggleMode() {
    this.isScientificMode = !this.isScientificMode;
    const scientificButtons = document.getElementById("scientific-buttons");
    const modeIndicator = document.getElementById("mode-indicator");
    
    console.log("Mode switched to:", this.isScientificMode ? "Scientific" : "Standard");
    console.log("Scientific buttons element:", scientificButtons);
    
    if (this.isScientificMode) {
      scientificButtons.style.display = "grid";
      modeIndicator.textContent = "SCI";
      modeIndicator.style.background = "rgba(123, 31, 162, 0.1)";
      modeIndicator.style.color = "#7b1fa2";
      modeIndicator.style.borderColor = "rgba(123, 31, 162, 0.2)";
      console.log("Scientific buttons should now be visible");
    } else {
      scientificButtons.style.display = "none";
      modeIndicator.textContent = "STD";
      modeIndicator.style.background = "rgba(25, 118, 210, 0.1)";
      modeIndicator.style.color = "#1976d2";
      modeIndicator.style.borderColor = "rgba(25, 118, 210, 0.2)";
      console.log("Scientific buttons should now be hidden");
    }
  }

  handleKeyboard(e) {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
      this.appendNumber(e.key);
    } else if (e.key === "+" || e.key === "-") {
      this.chooseOperation(e.key);
    } else if (e.key === "*") {
      this.chooseOperation("×");
    } else if (e.key === "/") {
      e.preventDefault();
      this.chooseOperation("÷");
    } else if (e.key === "Enter" || e.key === "=") {
      this.compute();
    } else if (e.key === "Escape") {
      this.clear();
    } else if (e.key === "Backspace") {
      this.delete();
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      this.toggleMode();
    }
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = "";
      this.shouldResetScreen = false;
    }

    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }

    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.shouldResetScreen = false;

    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "−":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          this.currentOperand = "Error";
          this.updateDisplay();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;

    this.updateDisplay();
  }

  // Scientific functions
  squareRoot() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current) || current < 0) {
      this.currentOperand = "Error";
    } else {
      this.currentOperand = Math.sqrt(current).toString();
    }
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  square() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) {
      this.currentOperand = "Error";
    } else {
      this.currentOperand = (current * current).toString();
    }
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  percent() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) {
      this.currentOperand = "Error";
    } else {
      this.currentOperand = (current / 100).toString();
    }
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  inverse() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current) || current === 0) {
      this.currentOperand = "Error";
    } else {
      this.currentOperand = (1 / current).toString();
    }
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;

    this.updateDisplay();
  }

  delete() {
    if (this.currentOperand === "0") return;

    this.currentOperand = this.currentOperand.toString().slice(0, -1);

    if (this.currentOperand === "") {
      this.currentOperand = "0";
    }

    this.updateDisplay();
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    const currentOperandElement = document.getElementById("current-operand");
    const previousOperandElement = document.getElementById("previous-operand");

    currentOperandElement.textContent = this.getDisplayNumber(
      this.currentOperand
    );

    if (this.operation != null) {
      previousOperandElement.textContent = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      previousOperandElement.textContent = "";
    }
  }
}

// Initialize calculator when page loads
document.addEventListener("DOMContentLoaded", () => {
  new Calculator();
});
