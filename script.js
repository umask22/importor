// --- DATOS DEL JUEGO ---
const PALABRAS_SECRETAS = [
    "Avión", "Doctor", "Piscina", "Bosque", "Hamburguesa",
    "Guitarra", "Universo", "Diamante", "Volcán", "Cafetera", ​"Asado", "Colectivo", "Fernet", "Obelisco", "Chori", "Laburo", "Siesta", "Boliche", "Mate", "Vereda", "Bondi", "Gauchada", "Pibe", "Quilombo", "Truco", "Facturas", "Subte", "Guita", "Milanesa", "Chabón", "Birra", "Quiosco", "Rancho", "Flechazo", "Cachengue", "Quincho", "Picada", "Chamuyo", "Gamba", "Boludo", "Alfajor", "Patio", "Zarpado", "Cancha", "Gira", "Manaos", "Empanada", "Tacho", "Bombilla", "Pelotero", "Sifón", "Posta", "Facha", "Morfi", "Laberinto", "Bondiola", "Chorra", "Fiaca", "Piola", "Trucho", "Peaje", "Pelopincho", "Remise", "Tereré", "Minuta", "Yaguareté", "Carancho", "Carpincho", "Hornero", "Mulita", "Yacaré", "Gato", "Perro", "Pichicho", "Loro", "Cotorra", "Tero", "Vizcacha", "Guanaco", "Puma", "Ñandú", "Pingüino", "Ballena", "Yegua", "Ternero", "Ciruja", "Kiosquero", "Canillita", "Trapito", "Changuito", "Sánguche", "Salamín", "Pastafrola", "Churros", "Medialunas", "Vigilante", "Bola de fraile", "Torta frita", "Mate cocido", "Soda", "Gaseosa", "Pinta", "Previa", "Bailanta", "Potrero", "Pelota", "Botines", "Casaca", "Arquero", "Patovica"
];

let jugadores = [];
let palabraSecreta = "";
let impostorIndex = -1;
let jugadorActualIndex = 0;
let tiempoRestante = 300; // 5 minutos en segundos
let temporizadorInterval;

// --- FUNCIONES DE CONTROL DE PANTALLA ---

function mostrarPantalla(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
}

// --- PANTALLA 1: INICIO Y CONFIGURACIÓN ---

function configurarJuego() {
    const listaJugadoresTexto = document.getElementById('lista-jugadores').value;
    
    // 1. Limpiar y validar la lista de jugadores
    jugadores = listaJugadoresTexto
        .split(',')
        .map(nombre => nombre.trim())
        .filter(nombre => nombre.length > 0);

    if (jugadores.length < 3) {
        alert("Necesitas al menos 3 jugadores para jugar.");
        return;
    }

    // 2. Elegir la palabra secreta y el impostor
    const palabraAleatoria = Math.floor(Math.random() * PALABRAS_SECRETAS.length);
    palabraSecreta = PALABRAS_SECRETAS[palabraAleatoria];
    
    impostorIndex = Math.floor(Math.random() * jugadores.length);

    // 3. Pasar a la pantalla de asignación de roles
    jugadorActualIndex = 0;
    document.getElementById('jugador-actual').textContent = `¡Hola, ${jugadores[jugadorActualIndex]}!`;
    mostrarPantalla('asignacion');
}

// --- PANTALLA 2: ASIGNACIÓN DE ROLES ---

function mostrarPalabra() {
    const esImpostor = jugadorActualIndex === impostorIndex;
    const rol = esImpostor ? "¡ERES EL IMPOSITOR!" : palabraSecreta;
    
    document.getElementById('rol-palabra-display').textContent = rol;
    document.getElementById('mostrar-btn').classList.add('hidden');
    document.getElementById('contenido-rol').classList.remove('hidden');
}

function siguienteJugador() {
    // Restaurar botones para el siguiente jugador
    document.getElementById('mostrar-btn').classList.remove('hidden');
    document.getElementById('contenido-rol').classList.add('hidden');

    jugadorActualIndex++;

    if (jugadorActualIndex < jugadores.length) {
        // Asignar al siguiente jugador
        document.getElementById('jugador-actual').textContent = `¡Hola, ${jugadores[jugadorActualIndex]}!`;
    } else {
        // Todos tienen su rol, iniciar el debate
        iniciarDebate();
    }
}

// --- PANTALLA 3: JUEGO Y DEBATE ---

function actualizarTemporizador() {
    tiempoRestante--;
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    document.getElementById('temporizador').textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;

    if (tiempoRestante <= 0) {
        clearInterval(temporizadorInterval);
        alert("¡Tiempo agotado! Es hora de votar.");
        mostrarResultados();
    }
}

function iniciarDebate() {
    // 1. Mostrar la lista de jugadores
    const listaDebate = document.getElementById('lista-jugadores-debate');
    listaDebate.innerHTML = jugadores.map(nombre => `<li>${nombre}</li>`).join('');

    // 2. Iniciar el temporizador
    tiempoRestante = 300; // 5 minutos
    actualizarTemporizador();
    temporizadorInterval = setInterval(actualizarTemporizador, 1000);

    // 3. Mostrar la pantalla
    mostrarPantalla('juego');
}

function detenerTemporizador() {
    clearInterval(temporizadorInterval);
    alert("¡VOTACIÓN! Discutan y voten en voz alta por quién creen que es el impostor. Luego revelen el resultado.");
    mostrarResultados();
}

// --- PANTALLA 4: RESULTADOS ---

function mostrarResultados() {
    const nombreImpostor = jugadores[impostorIndex];
    const impostorRevelado = document.getElementById('impostor-revelado');

    impostorRevelado.innerHTML = `
        <p>El juego ha terminado. Ahora es el momento de revelar sus votos.</p>
        <p>La palabra secreta era: <strong>${palabraSecreta}</strong></p>
        <p>El Impostor era: <strong>${nombreImpostor}</strong></p>
        <p>¡Decidan si los jugadores ganaron al acertar o si el Impostor ganó!</p>
    `;

    mostrarPantalla('resultados');
}

// Inicializar mostrando la primera pantalla
document.addEventListener('DOMContentLoaded', () => {
    mostrarPantalla('inicio');
});
