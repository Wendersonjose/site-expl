export function initContactButton() {
    const btnContato = document.getElementById('btnContato');
    
    if (btnContato) {
        btnContato.addEventListener('click', function() {
            alert('Entraremos em contato em breve!');
        });
    }
}
