const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let receiver = null;
let sender = null;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if(data.type === 'receiver-ready') {
      receiver = ws;
      console.log('Receiver conectado');
      ws.isReceiver = true;
    } 
    else if(data.type === 'offer') {
      sender = ws;
      console.log('Sender conectado');
      if(receiver) {
        receiver.send(JSON.stringify({ type: 'offer', offer: data.offer }));
      }
    }
    else if(data.type === 'answer') {
      if(sender) {
        sender.send(JSON.stringify({ type: 'answer', answer: data.answer }));
      }
    }
    else if(data.type === 'candidate') {
      if(ws.isReceiver && sender) {
        sender.send(JSON.stringify({ type: 'candidate', candidate: data.candidate }));
      } else if (!ws.isReceiver && receiver) {
        receiver.send(JSON.stringify({ type: 'candidate', candidate: data.candidate }));
      }
    }
  });

  ws.on('close', () => {
    if(ws.isReceiver) receiver = null;
    else sender = null;
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket rodando na porta 8080');
