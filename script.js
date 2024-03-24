
const regiao = location.search.replaceAll("?r=", "");
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Enviando: ' + regiao);
    socket.send(regiao);
  };

// Quando uma mensagem é recebida do servidor WebSocket
socket.addEventListener('message', function (event) {
    const dadosRecebidos = JSON.parse(event.data);
    document.getElementById('dados-pais').innerText = "País: " + JSON.stringify(dadosRecebidos.REGIAO).replaceAll('"', "");
    document.getElementById('dados-recebidos').innerText = "Hora: " + JSON.stringify(dadosRecebidos.HORA).replaceAll('"', "");
});