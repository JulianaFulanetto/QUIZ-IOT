//importar do pacote mqtt-paho a classe client
import { Client } from 'paho-mqtt'

let client;

export const connectMQTT = (onMessageReceived) => {
    
    //Usar wss na porta 8884
    client = new Client('broker.hievemq.com', 8884, '/mqtt', 'ractClient' + Math.random());

    //define o handler para perda de conexão
    client.onConnectionLost = (responseObject) => {
        console.log('Conexão perdida: ', responseObject);
    };

    //define o handler para a chegada de novas mensagens
    client.onMessageArrived = (message) => {
        console.log(message.destinationName, message.payloadString);
       
    };

    //inicia a conexão e subscreve nos topicos
    client.connect({
        useSSL: true,
        onSuccess: () => {
            console.log('MQTT conectado via WSS');
            client.subscribe("quizIoT-Juliana/resp_enviada");
            client.subscribe("quizIoT-Juliana/resultado");
            client.subscribe("quizIoT-Juliana/statusAluno");
        },
        onFailure: (err) => console.log('Erro MQTT: ', err),
    });
}

export const publishMessage = (topic, payload) => {
    if(!client) return;
    const message = new window.Paho.MQTT.Message(payload);
    message.destinationName = topic;
    client.send(message);
};
