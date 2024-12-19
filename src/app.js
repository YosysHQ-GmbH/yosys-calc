import {
  css,
  html,
  LitElement,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js';
import { calculatePrice } from './calculator.js';

export class CalculatorApp extends LitElement {
  static styles = css`
    :host {
      font-family: Lato, sans-serif;
      font-size: 14.67px;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    h2 {
      color: #d6368f;
    }

    .machine-row {
      padding-left: 2em;
      padding-right: 2em;
    }
    @media (max-width: 600px) {
      .machine-row {
        padding-left: 0.5em;
        padding-right: 0.5em;
      }
    }

    input[type='number'] {
      width: 4em;
      height: 28px;
    }
    @media (max-width: 600px) {
      input[type='number'] {
        width: 3em;
      }
    }

    .grid-span-row {
      grid-column: span 3;
    }

    .grid-separator {
      margin-top: 0.5em;
      grid-column: 1 / -1;
      border-top: 1px solid #000;
    }

    .grid-container {
      display: inline-grid;
      grid-template-columns: 1fr 2.5fr 1fr;
      gap: 1em 1em;
      align-items: center;
    }

    .grid-container > summary {
      display: grid;
      grid-column: 1/-1;
      grid-template-columns: subgrid;
      background-color: #f0f0f0;
      padding: 0.5em 0;
    }

    .grid-header {
      font-weight: bold;
    }

    button.remove-button {
      cursor: pointer;
      border: none;
      width: 28px;
      height: 28px;
      margin-right: 0.5em;
      background-color: black;
      -webkit-mask: url(icons/remove.svg) no-repeat center;
      mask: url(icons/remove.svg) no-repeat center;
      text-indent: -9999px;
    }
    button.remove-button:hover {
      background-color: #a00;
    }

    button.add-machine {
      cursor: pointer;
      border: none;
      width: 28px;
      height: 28px;
      background-color: #0a0;
      color: white;
      background-color: black;
      -webkit-mask: url(icons/add.svg) no-repeat center;
      mask: url(icons/add.svg) no-repeat center;
      text-indent: -9999px;
      background-color: #4b72b8;
    }
    button.add-machine:hover {
      background-color: #6ecbd7;
    }

    .machine-details {
      display: flex;
    }

    .machine-details label {
      margin-right: 0.5em;
      line-height: 28px;
    }

    .machine-details input {
      margin-right: 1em;
    }
    .machine-details input[type='checkbox'] {
      margin-right: 0.5em;
    }
  `;

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

      Are you a freelancer or a 1 person company?

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

      <div class="grid-container">
        <div class="grid-header">Support credits:</div>
        <div>
          <input
            type="number"
            min="1"
            .value=${order.credits}
            @input=${(e) => {
              this.order.credits = parseInt(e.target.value);
              this.updatePrice();
            }}
          />
        </div>
        <div>${price.credits} €</div>

        <div class="grid-header grid-span-row">Machine types:</div>

        ${order.machines.map(
          (machine, index) => html`
            <div class="machine-row machine-details" style="grid-column: span 2;">
              <button
                class="remove-button"
                title="Remove"
                @click=${() => {
                  this.order.machines.splice(index, 1);
                  this.updatePrice();
                }}
              >
                Remove
              </button>

              <label for="quantity-${index}">Qty:</label>
              <input
                id="quantity-${index}"
                type="number"
                min="1"
                .value=${machine.quantity}
                @input=${(e) => {
                  machine.quantity = parseInt(e.target.value);
                  this.updatePrice();
                }}
              />

              <label for="cores-${index}">Cores:</label>
              <input
                id="cores-${index}"
                type="number"
                min="1"
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
            </div>
            <div>${machine.price} €</div>
          `,
        )}

        <div class="machine-row grid-span-row">
          <button @click=${this.addMachine} type="button" class="add-machine" title="Add machine">
            Add machine
          </button>
        </div>

        <div class="grid-separator"></div>

        <div class="grid-header">Discount:</div>
        <div>${price.bundle?.name}</div>
        <div>${price.discount} €</div>

        <summary>
          <div class="grid-header">Total:</div>
          <div></div>
          <div><strong>${price.total} € / month</strong></div>
        </summary>
      </div>
    `;
  }
}

customElements.define('yosys-calculator', CalculatorApp);
