import Bs5Utils from "../Bs5Utils";

export default class Toast {
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
    show({
             type,
             icon = '',
             title,
             subtitle = '',
             content = '',
             buttons = [],
             delay = 0,
             dismissible = true
         }) {
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
        borderStyles.forEach(value => {
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

        toast.innerHTML = `<div class="toast-header ${style.main.join(' ')}">
                            ${icon}
                            <strong class="me-auto">${title}</strong>
                            <small>${subtitle}</small>
                            ${dismissible ? `<button type="button" class="btn-close ${btnCloseStyles}" data-bs-dismiss="toast" aria-label="Close"></button>` : ''}
                        </div>
                        <div class="toast-body">
                            ${content}
                            ${buttonsHtml}
                        </div>`;

        if (!Bs5Utils.defaults.toasts.stacking) {
            document.querySelectorAll(`#${Bs5Utils.defaults.toasts.container} .toast`).forEach((toast) => {
                toast.remove();
            });
        }

        document.querySelector(`#${Bs5Utils.defaults.toasts.container}`).appendChild(toast);

        toast.addEventListener('hidden.bs.toast', function (e) {
            e.target.remove();
        });

        buttonIds.forEach(value => {
            document.getElementById(value.id).addEventListener('click', value.handler)
        });

        const opts = {
            autohide: (delay > 0 && typeof delay === 'number'),
        };

        if (delay > 0 && typeof delay === 'number') {
            opts['delay'] = delay;
        }

        const bsToast = new bootstrap.Toast(toast, opts);

        bsToast.show();

        return bsToast;
    }
}