
// const regiao = location.search.replaceAll("?r=", "");
// const socket = new WebSocket('ws://localhost:8080');

// socket.onopen = () => {
//     console.log('Enviando: ' + regiao);
//     socket.send(regiao);
//   };

// // Quando uma mensagem é recebida do servidor WebSocket
// socket.addEventListener('message', function (event) {
//     const dadosRecebidos = JSON.parse(event.data);
//     document.getElementById('dados-pais').innerText = "País: " + JSON.stringify(dadosRecebidos.REGIAO).replaceAll('"', "");
//     document.getElementById('dados-recebidos').innerText = "Hora: " + JSON.stringify(dadosRecebidos.HORA).replaceAll('"', "");
// });

const regiao = location.search.replaceAll("?r=", "");
// const socket = new WebSocket('ws://127.0.0.1:8080');
const socket = new WebSocket('wss://puzzled-simplistic-emu.glitch.me');

// Evento de conexão aberta
socket.onopen = () => {
    console.log('Enviando: ' + regiao);
    socket.send(regiao);
};

// Evento de erro de conexão
socket.onerror = (error) => {
    console.error('Erro no WebSocket:', error);
    // Exibir uma mensagem de erro na interface ou tomar alguma ação
    document.getElementById('dados-pais').innerText = "Erro ao conectar ao WebSocket";
};

// Quando uma mensagem é recebida do servidor WebSocket
socket.addEventListener('message', function (event) {
    try {
        const dadosRecebidos = JSON.parse(event.data);
        document.getElementById('dados-pais').innerText = "País: " + JSON.stringify(dadosRecebidos.REGIAO).replaceAll('"', "");
        document.getElementById('dados-recebidos').innerText = "Hora: " + JSON.stringify(dadosRecebidos.HORA).replaceAll('"', "");
    } catch (error) {
        console.error('Erro ao processar mensagem recebida:', error);
        document.getElementById('dados-pais').innerText = "Erro ao processar dados";
    }
});
