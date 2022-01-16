'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Toast {
  /**
   * A counter for the Toasts
   * @type {number}
   */
  #count = 0;

  /**
   * Display a toast for alerts
   * @param type - the theme of the snack
   * @param icon - Set an icon in the top-left corner, you can pass HTML directly
   * @param title - the title of the of the toast
   * @param subtitle - the subtitle of the toast
   * @param content - the content of the toast
   * @param buttons - the action buttons of the toast
   * @param delay - in ms, if specified the snack will autohide after the specified amount
   * @param dismissible - set whether the dismiss button should show
   */
  show({ type, icon = '', title, subtitle = '', content = '', buttons = [], delay = 0, dismissible = true }) {
    this.#count++;

    const style = Bs5Utils.defaults.styles[type],
      btnCloseStyles = style.btnClose.join(' '),
      borderStyles = style.border,
      toast = document.createElement('div');

    toast.setAttribute('id', `toast-${this.#count}`);
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.classList.add('toast', 'align-items-center');
    borderStyles.forEach((value) => {
      toast.classList.add(value);
    });

    let buttonsHtml = ``,
      buttonIds = [];

    if (Array.isArray(buttons) && buttons.length) {
      buttonsHtml += `<div class="d-flex justify-content-center mt-2 pt-2 border-top ${borderStyles.join(' ')}">`;

      buttons.forEach((button, key) => {
        const type = button.type || 'button';

        switch (type) {
          case 'dismiss':
            buttonsHtml += `<button type="button" class="${button.class}" data-bs-dismiss="toast">${button.text}</button>&nbsp;`;
            break;

          default:
            let id = `toast-${this.#count}-button-${key}`;

            buttonsHtml += `<button type="button" id="${id}" class="${button.class}">${button.text}</button>&nbsp;`;

            if (button.hasOwnProperty('handler') && typeof button.handler === 'function') {
              buttonIds.push({
                id,
                handler: button.handler
              });
            }
        }
      });

      buttonsHtml += `</div>`;
    }

    toast.innerHTML = `
      <div class="toast-header ${style.main.join(' ')}">
          ${icon}
          <strong class="me-auto">${title}</strong>
          <small>${subtitle}</small>
          ${
            dismissible
              ? `<button type="button" class="btn-close ${btnCloseStyles}" data-bs-dismiss="toast" aria-label="Close"></button>`
              : ''
          }
      </div>
      <div class="toast-body">
          ${content}
          ${buttonsHtml}
      </div>
    `;

    if (!Bs5Utils.defaults.toasts.stacking) {
      document.querySelectorAll(`#${Bs5Utils.defaults.toasts.container} .toast`).forEach((toast) => {
        toast.remove();
      });
    }

    document.querySelector(`#${Bs5Utils.defaults.toasts.container}`).appendChild(toast);

    toast.addEventListener('hidden.bs.toast', function (e) {
      e.target.remove();
    });

    buttonIds.forEach((value) => {
      document.getElementById(value.id).addEventListener('click', value.handler);
    });

    const opts = {
      autohide: delay > 0 && typeof delay === 'number'
    };

    if (delay > 0 && typeof delay === 'number') {
      opts['delay'] = delay;
    }

    const bsToast = new bootstrap.Toast(toast, opts);

    bsToast.show();

    return bsToast;
  }
}

class Snack {
  /**
   * A counter for the Snacks
   * @type {number}
   */
  #count = 0;

  /**
   * Display a lightweight toast
   * @param type - the theme of the snack
   * @param title - the title of the of the snack
   * @param delay - in ms, if specified the snack will autohide after the specified amount
   * @param dismissible - set whether the dismiss button should show
   */
  show(type, title, delay = 0, dismissible = true) {
    this.#count++;

    const style = Bs5Utils.defaults.styles[type],
      btnCloseStyle = style.btnClose.join(' '),
      snack = document.createElement('div');

    snack.classList.add('toast', 'align-items-center', 'border-0');
    style.main.forEach((value) => {
      snack.classList.add(value);
    });
    snack.setAttribute('id', `snack-${this.#count}`);
    snack.setAttribute('role', 'alert');
    snack.setAttribute('aria-live', 'assertive');
    snack.setAttribute('aria-atomic', 'true');
    snack.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${title}</div>
        ${
          dismissible
            ? `<button type="button" class="btn-close ${btnCloseStyle} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>`
            : ''
        }
      </div>
    `;

    if (!Bs5Utils.defaults.toasts.stacking) {
      document.querySelectorAll(`#${Bs5Utils.defaults.toasts.container} .toast`).forEach((toast) => {
        toast.remove();
      });
    }

    document.querySelector(`#${Bs5Utils.defaults.toasts.container}`).appendChild(snack);

    snack.addEventListener('hidden.bs.toast', function (e) {
      e.target.remove();
    });

    const opts = {
      autohide: delay > 0 && typeof delay === 'number'
    };

    if (delay > 0 && typeof delay === 'number') {
      opts['delay'] = delay;
    }

    const bsSnack = new bootstrap.Toast(snack, opts);

    bsSnack.show();

    return bsSnack;
  }
}

class Modal {
  /**
   * A counter for the Modals
   * @type {number}
   */
  #count = 0;

  /**
   * Display a modal
   * @param type - the theme of the snack
   * @param title - the title of the modal, if omitted, the modal-header element is removed
   * @param content - the content of the modal, if omitted, the modal-body element is removed
   * @param buttons - any action buttons, if omitted, the the modal-footer element  is removed
   * @param centered - set whether the modal is centered
   * @param dismissible - set whether the dismiss button should show
   * @param backdrop - set the type of backdrop: true, false, static
   * @param keyboard - set whether the escape key closes the modal
   * @param focus - set whether the modal is autofocussed when initialized
   * @param fullscreen - set whether the modal is fullscreen
   * @param modalSize - set the size of the modal: sm, lg, xl by default, it's an empty string
   */
  show({
    type = 'default',
    title = '',
    content = '',
    buttons = [],
    centered = false,
    dismissible = true,
    backdrop = dismissible ? true : 'static',
    keyboard = dismissible,
    focus = true,
    fullscreen = false,
    size = ''
  }) {
    this.#count++;

    size = ['sm', 'lg', 'xl'].includes(size) ? `modal-${size}` : '';
    fullscreen = fullscreen ? 'modal-fullscreen' : '';
    centered = centered ? 'modal-dialog-centered modal-dialog-scrollable' : '';

    const style = Bs5Utils.defaults.styles[type],
      btnCloseStyles = style.btnClose.join(' '),
      borderStyles = style.border,
      modal = document.createElement('div');

    modal.setAttribute('id', `modal-${this.#count}`);
    modal.setAttribute('tabindex', '-1');
    modal.classList.add('modal');
    if (Bs5Utils.defaults.toasts.namespace.length > 0) {
      modal.classList.add(Bs5Utils.defaults.toasts.namespace);
    }

    let footerHtml = '',
      buttonIds = [];

    if (Array.isArray(buttons) && buttons.length) {
      footerHtml += `<div class="modal-footer ${borderStyles.join(' ')}">`;

      buttons.forEach((button, key) => {
        const type = button.type || 'button';

        switch (type) {
          case 'dismiss':
            footerHtml += `<button type="button" class="${button.class}" data-bs-dismiss="modal">${button.text}</button>`;
            break;

          default:
            let id = `modal-${this.#count}-button-${key}`;

            footerHtml += `<button type="button" id="${id}" class="${button.class}">${button.text}</button>`;

            if (button.hasOwnProperty('handler') && typeof button.handler === 'function') {
              buttonIds.push({
                id,
                handler: button.handler
              });
            }
        }
      });

      footerHtml += `</div>`;
    }

    modal.innerHTML = `
      <div class="modal-dialog ${centered} ${fullscreen} ${size}">
        <div class="modal-content border-0">
          ${
            title.length
              ? `<div class="modal-header border-0 ${style.main.join(' ')}"><h5 class="modal-title">${title}</h5>
            ${
              dismissible
                ? `<button type="button" class="btn-close ${btnCloseStyles}" data-bs-dismiss="modal" aria-label="Close"></button>`
                : ``
            }
                </div>`
              : ``
          }
          ${content.length ? `<div class="modal-body">${content}</div>` : ``}
          ${footerHtml}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('hidden.bs.modal', function (e) {
      e.target.remove();
    });

    buttonIds.forEach((value) => {
      document.getElementById(value.id).addEventListener('click', value.handler);
    });

    const opts = {
      backdrop,
      keyboard,
      focus
    };

    const bsModal = new bootstrap.Modal(modal, opts);

    bsModal.show();

    return bsModal;
  }
}

class Bs5Utils {
  /**
   * Default config options
   * @type {{toasts: {container: string, position: string, stacking: boolean}}}
   */
  static defaults = {
    toasts: {
      position: 'top-right',
      container: 'toast-container',
      namespace: '',
      stacking: true
    },

    styles: {
      secondary: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-secondary'],
        border: ['border-secondary']
      },
      light: {
        btnClose: [],
        main: ['text-dark', 'bg-light', 'border-bottom', 'border-dark'],
        border: ['border-dark']
      },
      white: {
        btnClose: [],
        main: ['text-dark', 'bg-white', 'border-bottom', 'border-dark'],
        border: ['border-dark']
      },
      dark: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-dark'],
        border: ['border-dark']
      },
      info: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-info'],
        border: ['border-info']
      },
      primary: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-primary'],
        border: ['border-primary']
      },
      success: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-success'],
        border: ['border-success']
      },
      warning: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-warning'],
        border: ['border-warning']
      },
      danger: {
        btnClose: ['btn-close-white'],
        main: ['text-white', 'bg-danger'],
        border: ['border-danger']
      },
      default: {
        btnClose: [],
        main: ['border-bottom'],
        border: []
      }
    }
  };

  constructor() {
    this.#createToastContainer();

    this.Toast = new Toast();
    this.Snack = new Snack();
    this.Modal = new Modal();
  }

  #createToastContainer() {
    let containerEl = document.querySelector(`#${Bs5Utils.defaults.toasts.container}`);

    if (!containerEl) {
      const positionToClass = {
        'top-left': 'top-0 start-0 ms-1 mt-1',
        'top-center': 'top-0 start-50 translate-middle-x mt-1',
        'top-right': 'top-0 end-0 me-1 mt-1',
        'middle-left': 'top-50 start-0 translate-middle-y ms-1',
        'middle-center': 'top-50 start-50 translate-middle p-3',
        'middle-right': 'top-50 end-0 translate-middle-y me-1',
        'bottom-left': 'bottom-0 start-0 ms-1 mb-1',
        'bottom-center': 'bottom-0 start-50 translate-middle-x mb-1',
        'bottom-right': 'bottom-0 end-0 me-1 mb-1'
      };

      containerEl = document.createElement('div');
      containerEl.classList.add('position-relative');
      if (Bs5Utils.defaults.toasts.namespace.length > 0) {
        containerEl.classList.add(Bs5Utils.defaults.toasts.namespace);
      }
      containerEl.setAttribute('aria-live', 'polite');
      containerEl.setAttribute('aria-atomic', 'true');
      containerEl.innerHTML = `<div id="${
        Bs5Utils.defaults.toasts.container
      }" class="toast-container position-fixed pb-1 ${
        positionToClass[Bs5Utils.defaults.toasts.position] || positionToClass['top-right']
      }"></div>`;

      document.body.appendChild(containerEl);
    }
  }

  /**
   * Register a style for the components
   * @param key - To reference your style
   * @param styles - The style object
   */
  static registerStyle(key, styles) {
    if (typeof styles !== 'object' && Array.isArray(styles)) {
      throw 'The styles parameter must be an object when you register component style.';
    }

    Bs5Utils.defaults.styles[key] = styles;
  }
}

exports["default"] = Bs5Utils;
//# sourceMappingURL=Bs5Utils.js.map
