import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js';
import { calculatePrice } from './calculator.js';

export class CalculatorApp extends LitElement {
  static properties = {
    order: { state: true },
    price: { state: true },
  };

  constructor() {
    super();
    this.order = {
      solo: false,
      credits: 1,
      machines: [{ quantity: 1, cores: 8, floating: false }],
    };

    this.price = {
      discount: 0,
      total: 0,
    };

    this.updatePrice();
  }

  updatePrice() {
    this.price = calculatePrice(this.order);
    this.requestUpdate();
  }

  addMachine() {
    this.order.machines.push({ quantity: 1, cores: 8, floating: false });
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
        min="1"
        .value=${order.credits}
        @input=${(e) => {
          this.order.credits = parseInt(e.target.value);
          this.updatePrice();
        }}
      />
      ${price.credits} €

      <div>
        <strong>Machines types:</strong>
        <div>
          ${order.machines.map(
            (machine, index) => html`
              <div>
                <label for="cores">Cores:</label>
                <input
                  type="number"
                  min="1"
                  style="width: 50px"
                  .value=${machine.cores}
                  @input=${(e) => {
                    machine.cores = parseInt(e.target.value);
                    this.updatePrice();
                  }}
                />
                <input
                  type="checkbox"
                  id="floating-${index}"
                  ?checked=${machine.floating}
                  @change=${(e) => {
                    machine.floating = e.target.checked;
                    this.updatePrice();
                  }}
                />
                <label for="floating-${index}">Floating</label>

                Quantity:
                <input
                  type="number"
                  min="1"
                  style="width: 50px"
                  .value=${machine.quantity}
                  @input=${(e) => {
                    machine.quantity = parseInt(e.target.value);
                    this.updatePrice();
                  }}
                />

                <button
                  @click=${() => {
                    this.order.machines.splice(index, 1);
                    this.updatePrice();
                  }}
                >
                  Remove
                </button>
                ${machine.price} €
              </div>
            `,
          )}
        </div>

        <div>
          <button @click=${this.addMachine} type="button">Add machine</button>
        </div>

        <hr />

        <div>Discount: ${price.discount} €</div>
        <div>Total: ${price.total} € / month</div>
      </div>
    `;
  }
}

customElements.define('yosys-calculator', CalculatorApp);
