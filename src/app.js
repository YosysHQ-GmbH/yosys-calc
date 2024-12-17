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

    h2 {
      color: #d6368f;
    }

    th {
      text-align: left;
    }

    td.machine-row {
      padding-left: 2em;
      padding-right: 2em;
    }
    @media (max-width: 600px) {
      td.machine-row {
        padding-left: 0.5em;
        padding-right: 0.5em;
      }
    }

    input[type='number'] {
      width: 3em;
    }

    button.remove-button {
      cursor: pointer;
      border: none;
      width: 20px;
      height: 20px;
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
      width: 32px;
      height: 32px;
      background-color: #0a0;
      color: white;
      background-color: black;
      -webkit-mask: url(icons/add.svg) no-repeat center;
      mask: url(icons/add.svg) no-repeat center;
      text-indent: -9999px;
    }
    button.add-machine:hover {
      background-color: #4b72b8;
    }

    .machine-details {
      display: flex;
    }

    .machine-details label {
      margin-right: 0.5em;
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

      <table>
        <colgroup>
          <col style="width: 8em;" />
          <col style="width: 17em;" />
        </colgroup>
        <tr>
          <th>Support credits:</th>
          <td>
            <input
              type="number"
              min="1"
              .value=${order.credits}
              @input=${(e) => {
                this.order.credits = parseInt(e.target.value);
                this.updatePrice();
              }}
            />
          </td>
          <td>${price.credits} €</td>
        </tr>
        <tr>
          <th>Machine types:</th>
        </tr>
        ${order.machines.map(
          (machine, index) => html`
            <tr>
              <td colspan="2" class="machine-row">
                <div class="machine-details">
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
                </div>
              </td>
              <td>${machine.price} €</td>
            </tr>
          `,
        )}

        <tr>
          <td colspan="2" class="machine-row">
            <button @click=${this.addMachine} type="button" class="add-machine" title="Add machine">
              Add machine
            </button>
          </td>
          <td></td>
        </tr>

        <tr>
          <th>Discount:</th>
          <td></td>
          <td>${price.discount} €</td>
        </tr>
        <tr>
          <th>Total:</th>
          <td></td>
          <td><strong>${price.total} € / month</strong></td>
        </tr>
      </table>
    `;
  }
}

customElements.define('yosys-calculator', CalculatorApp);
