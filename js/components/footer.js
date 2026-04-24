export function renderFooter() {
    return `
        <footer role="contentinfo">
            <div class="footer-container">
                <div class="footer-section footer-nav">
                    <h3>Navegação</h3>
                    <ul>
                        <li><a href="#produtos">Produtos</a></li>
                        <li><a href="#sobre">Sobre Nós</a></li>
                        <li><a href="#contato">Contato</a></li>
                        <li><a href="#blog">Blog</a></li>
                    </ul>
                </div>

                <div class="footer-section footer-contact">
                    <h3>Contato</h3>
                    <p>📧 contato@expl.com.br</p>
                    <p>📱 (11) 98765-4321</p>
                    <p>🏢 (11) 3456-7890</p>
                </div>

                <div class="footer-section">
                    <h3>Redes Sociais</h3>
                    <div class="footer-social">
                        <a href="https://instagram.com/expl" target="_blank" rel="noopener" class="social-link" aria-label="Instagram" title="Instagram">
                            📷
                        </a>
                        <a href="https://facebook.com/expl" target="_blank" rel="noopener" class="social-link" aria-label="Facebook" title="Facebook">
                            📘
                        </a>
                        <a href="https://linkedin.com/company/expl" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn" title="LinkedIn">
                            💼
                        </a>
                        <a href="https://twitter.com/expl" target="_blank" rel="noopener" class="social-link" aria-label="Twitter" title="Twitter">
                            🐦
                        </a>
                    </div>
                </div>

                <div class="footer-section footer-legal">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="#privacidade">Política de Privacidade</a></li>
                        <li><a href="#termos">Termos de Uso</a></li>
                        <li><a href="#cookies">Política de Cookies</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 EXPL Company. Todos os direitos reservados. | Desenvolvido com 💥 e energia</p>
            </div>
        </footer>
    `;
}
