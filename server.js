const WebSocket = require('ws');
const https = require('https');
const url = 'https://codjango.com/api/dia.php?r='

const wss = new WebSocket.Server({ port: 8080 });

startServer();
function startServer() {
    wss.on('connection', ws => {

        console.log('Cliente conectado');

    
        function buscaApiData(ws, message) {

            setInterval(() => {
                const requestAPI = https.get(url + message, (res) => {
                    let data = '';

                    // Recebe os dados da resposta
                    res.on('data', (chunk) => { data += chunk });

                    // Quando todos os dados forem recebidos
                    res.on('end', () => {
                        if (ws.readyState === WebSocket.OPEN) {
                            console.log('Enviando Dados! ' + message);
                            ws.send(data);
                        }
                    });
                });
            }, 1000);
        }

        const requestWs = ws.on('message', message => {
            buscaApiData(ws, message)
        });

        ws.removeListener('message', () => requestWs);

        ws.on('close', () => {
            console.log('Cliente desconectado');
        });

        wss.on('error', error => {
            console.error('Erro no servidor WebSocket:', error);
            wss.close();
            setTimeout(startServer, 1000);
        });
    });

    console.log('Servidor WebSocket iniciado na porta 8080');
}

