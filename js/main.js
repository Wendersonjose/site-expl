import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { initContactButton } from './modules/contact.js';

document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = renderHeader();
    }

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = renderFooter();
    }

    initContactButton();
});
