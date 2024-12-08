import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js';
import { calculatePrice } from './calculator.js';

export class CalculatorApp extends LitElement {
  static properties = {
    order: { state: true },
    price: { state: true },
    newMachine: { state: true },
  };

  constructor() {
    super();
    this.order = {
      solo: false,
      credits: 1,
      machines: [],
    };

    this.price = {
      discount: 0,
      total: 0,
    };

    this.newMachine = {
      cores: '',
      floating: false,
    };
    this.updatePrice();
  }

  updatePrice() {
    this.price = calculatePrice(this.order);
    this.requestUpdate();
  }

  addMachine() {
    if (this.newMachine.cores === '' || this.newMachine.cores <= 0) {
      return;
    }

    this.order.machines.push({ ...this.newMachine });
    this.newMachine = { cores: 2, floating: false };
    this.updatePrice();
  }

  render() {
    const { order, price } = this;

    return html`
      <h2>About you</h2>

      Are you a freelancer / 1 person company?

      <input
        type="radio"
        id="solo-yes"
        name="solo"
        .checked=${order.solo}
        @change=${() => {
          this.order.solo = true;
          this.updatePrice();
        }}
      />
      <label for="solo-yes">Yes</label>

      <input
        type="radio"
        id="solo-no"
        name="solo"
        .checked=${!order.solo}
        @change=${() => {
          this.order.solo = false;
          this.updatePrice();
        }}
      />
      <label for="solo-no">No</label>

      <h2>What you need</h2>

      Support credits:
      <input
        type="number"
        .value=${order.credits}
        @input=${(e) => {
          this.order.credits = parseInt(e.target.value);
          this.updatePrice();
        }}
      />
      ${price.credits} €

      <div>
        <strong>Machines:</strong> ${price.nodes} €
        <div>
          ${order.machines.map(
            (machine, index) => html`
              <div>
                Machine ${index + 1}: ${machine.cores} cores${machine.floating ? ' (floating)' : ''}
                <button
                  @click=${() => {
                    this.order.machines.splice(index, 1);
                    this.updatePrice();
                  }}
                >
                  Remove
                </button>
              </div>
            `,
          )}
        </div>

        <div>
          <label for="cores">Cores:</label>
          <input
            type="number"
            id="cores"
            .value=${this.newMachine.cores}
            @input=${(e) => {
              this.newMachine.cores = parseInt(e.target.value);
            }}
          />
          <input
            type="checkbox"
            id="floating"
            checked=${this.newMachine.floating}
            @change=${(e) => {
              this.newMachine.floating = e.target.checked;
            }}
          />
          <label for="floating">Floating</label>

          <button @click=${this.addMachine} type="button">Add</button>
        </div>

        <hr />

        <div>Discount: ${price.discount} €</div>
        <div>Total: ${price.total} € / month</div>
      </div>
    `;
  }
}

customElements.define('yosys-calculator', CalculatorApp);
