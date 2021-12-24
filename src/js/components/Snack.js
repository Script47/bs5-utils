import Bs5Utils from "../Bs5Utils";

export default class Snack {
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

        snack.classList.add('toast', 'align-items-center', 'border-1', 'border-dark');
        style.main.forEach(value => {
            snack.classList.add(value);
        });
        snack.setAttribute('id', `snack-${this.#count}`);
        snack.setAttribute('role', 'alert');
        snack.setAttribute('aria-live', 'assertive');
        snack.setAttribute('aria-atomic', 'true');
        snack.innerHTML = `<div class="d-flex">
                        <div class="toast-body">${title}</div>
                        ${dismissible ? `<button type="button" class="btn-close ${btnCloseStyle} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>` : ''}
                      </div>`;

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
            autohide: (delay > 0 && typeof delay === 'number'),
        };

        if (delay > 0 && typeof delay === 'number') {
            opts['delay'] = delay;
        }

        const bsSnack = new bootstrap.Toast(snack, opts);

        bsSnack.show();

        return bsSnack;
    }
}