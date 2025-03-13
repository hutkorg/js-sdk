import styles from './acs_styles.js'

export default (data) => `
${styles(data)}
<div class="hutko-modal-wrapper">
    <div class="hutko-modal">
        <div class="hutko-modal-header">
            <a href="javascript:void(0)" class="hutko-modal-close"></a>
            <div class="hutko-modal-title">
                ${data.messages.modalHeader}
                <a href='javascript:void(0)'>${data.messages.modalLinkLabel}</a>
            </div>
        </div>
        <div class="hutko-modal-content">
            <iframe src="about:blank" class="hutko-modal-iframe" frameborder="0" allowtransparency="true"></iframe>
        </div>
    </div>
</div>
`
