const WebSocket = require('ws');
const https = require('https');
const url = 'https://codjango.com/api/dia.php?r=';

// const wss = new WebSocket.Server({ port: 8080 });
const wss = new WebSocket.Server({ port: process.env.PORT || 8080, host: '0.0.0.0' });

startServer();

function startServer() {
    wss.on('connection', ws => {
        console.log('Cliente conectado');

        // Variável para armazenar o intervalo e evitar múltiplas execuções
        let intervalId;

        function buscaApiData(message) {
            // Limpando qualquer intervalo existente para evitar sobreposição
            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = setInterval(() => {
                https.get(url + message, (res) => {
                    let data = '';

                    // Recebendo dados da API
                    res.on('data', chunk => {
                        data += chunk;
                    });

                    // Quando todos os dados são recebidos
                    res.on('end', () => {
                        if (ws.readyState === WebSocket.OPEN) {
                            console.log('Enviando Dados! ' + message);
                            ws.send(data);
                        }
                    });
                }).on('error', err => {
                    console.error('Erro na requisição API:', err.message);
                });
            }, 1000);
        }

        // Listener de mensagens WebSocket
        ws.on('message', message => {
            if (message !== '') {
                buscaApiData(message);
            } else {
                console.log('Parâmetro inválido!');
                ws.close();
            }
        });

        // Quando o cliente se desconectar, parar o intervalo
        ws.on('close', () => {
            console.log('Cliente desconectado');
            clearInterval(intervalId);
        });
    });

    // Tratamento de erro no servidor WebSocket
    wss.on('error', error => {
        console.error('Erro no servidor WebSocket:', error);
        wss.close();
        setTimeout(startServer, 1000); // Tentativa de reinício após erro
    });

    console.log('Servidor WebSocket iniciado na porta 8080');
}
