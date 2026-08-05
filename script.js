document.addEventListener('DOMContentLoaded', () => {
    const botonesSaludo = document.querySelectorAll('.btn-saludo');

    botonesSaludo.forEach((boton) => {
        boton.addEventListener('click', function () {
            const nombre = this.getAttribute('data-name');
            alert(`¡Hola! Soy ${nombre}, gracias por visitar nuestra landing page.`);
        });
    });
});
