import Toast from "./components/Toast";
import Snack from "./components/Snack";
import Modal from "./components/Modal";

class Bs5Utils {
    /**
     * Default config options
     * @type {{toasts: {container: string, position: string, stacking: boolean}}}
     */
    static defaults = {
        toasts: {
            position: 'top-right',
            container: 'toast-container',
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
            }
        }
    }

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
            containerEl.setAttribute('aria-live', 'polite');
            containerEl.setAttribute('aria-atomic', 'true');
            containerEl.innerHTML = `<div id="${Bs5Utils.defaults.toasts.container}" class="toast-container position-fixed pb-1 ${positionToClass[Bs5Utils.defaults.toasts.position] || positionToClass['top-right']}"></div>`;

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
            throw 'The styles parameter must be an object when you register component style.'
        }

        Bs5Utils.defaults.styles[key] = styles;
    }
}

export {
    Bs5Utils as default
};