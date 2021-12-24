import Bs5Utils from "../Bs5Utils";

export default class Modal {
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
             type,
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

        modal.setAttribute('id', `modal-${this.#count}`)
        modal.setAttribute('tabindex', '-1');
        modal.classList.add('modal');

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

        modal.innerHTML = ` <div class="modal-dialog ${centered} ${fullscreen} ${size}">
                                <div class="modal-content border-0">
                                  ${title.length ? `<div class="modal-header border-0 ${style.main.join(' ')}">
                                    <h5 class="modal-title">${title}</h5>
                                    ${dismissible ? `<button type="button" class="btn-close ${btnCloseStyles}" data-bs-dismiss="modal" aria-label="Close"></button>` : ``}
                                  </div>` : ``}
                                  ${content.length ? `<div class="modal-body">${content}</div>` : ``}
                                  ${footerHtml}
                                </div>
                              </div>`;

        document.body.appendChild(modal);

        modal.addEventListener('hidden.bs.modal', function (e) {
            e.target.remove();
        });

        buttonIds.forEach(value => {
            document.getElementById(value.id).addEventListener('click', value.handler)
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