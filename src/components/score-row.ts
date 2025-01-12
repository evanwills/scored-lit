import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { sumScores } from '../utils/general-utils';

export const clickToEditScore = (
  handler : CallableFunction,
  score : number,
  index : number,
  _id : string,
  _min : number|undefined = undefined,
  _max: number|undefined = undefined,
) : TemplateResult|number =>
  html`
    ${score}
    <button @click=${handler} class="click-to-edit">
      Click to edit score for round ${(index + 1)}
    </button>`;

export const submitScore = (
  handler : CallableFunction,
  score : number,
  index : number,
  id : string,
  min : number|undefined = undefined,
  max: number|undefined = undefined,
) : TemplateResult|number => {
  const _id = `player--${id}-${index}`;
  return html`
    <label for="${_id}">Update score for round ${(index + 1)}</label>
    <input type="number" id="${_id}" .min=${ifDefined(min)} .max=${ifDefined(max)} .value="${score}" />
    <button @click=${handler} class="editing">Save</button>`;
}

export const nonEditableScore = (
  _handler : CallableFunction,
  score : number,
  _index : number,
  _id : string,
  _min : number|undefined = undefined,
  _max: number|undefined = undefined,
) : TemplateResult|number => score

@customElement('score-row')

export class ScoreRow extends LitElement {
  @property({ type: Boolean })
  canEdit: boolean = true;

  @property({ type: Number })
  index: number = -1;

  @property({ type: Number })
  max: number = 98765;

  @property({ type: Number })
  min: number = 98765;

  @property({ type: Boolean })
  new: boolean = false;

  @property({ type: Array<Number> })
  scores: number[] = [];

  @property({ type: String })
  userID: string = '';

  @state()
  editing : boolean = false;

  @state()
  _max : number|undefined = undefined;

  @state()
  _min : number|undefined = undefined;

  handleEditClick() : void {
    if (this.editing === false) {
      this.editing = true;
    } else {
      this.editing = false;
    }
  }

  static styles: CSSResult = css`
    td, th {
      border-top: 0.05rem solid #fff;
      border-left: 0.05rem solid #fff;
    }

    td:first-child, th:first-child {
      border-left: none;
    }

    thead td, thead th {
      border-top: none;;
    }
  `;

  connectedCallback() : void {
    super.connectedCallback()

    if (this.max !== 98765) {
      this._max = this.max;
    }
    if (this.min !== 98765) {
      this._min = this.min;
    }
  }

  render() : TemplateResult {

    let sum : string|number = 0;
    let scoreTmpl = nonEditableScore;

    if (this.new === true) {
      scoreTmpl = submitScore;
      sum = '';
    } else {
      if (this.canEdit === true) {
        scoreTmpl = (this.editing === false)
          ? clickToEditScore
          : submitScore
      }

      sum = sumScores(this.scores, this.index);
    }


    return html`
      <tr id="score-row--${this.userID}--${this.index}">
        <td headers="roundScore">${scoreTmpl(
          this.handleEditClick,
          this.scores[this.index],
          this.index,
          this.userID,
          this._min,
          this._max,
        )}</td>
        <td headers="sumScore">${sum}</td>
      </tr>`;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'score-row': ScoreRow;
  }
}
