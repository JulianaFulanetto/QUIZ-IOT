//importar do pacote mqtt-paho a classe client
import { Client } from "paho-mqtt"

let client; //variavel global para guardar a instancia do cliente MQTT


export const connectMQTT = ( onMessageReceived) => {

    //Usar wss na porta 8884 para conexao segura
    client = new Client("broker.hivemq.com",8884, "/mqtt","reactClient" + Math.random()*123); // cria um cliente aleatorio, para nn dar interferencia com outros clientes ja existentes

    //define o handler para quando perder a conexão
    client.onConnectionLost = (responseObject) => {
        console.log("Conexão perdida", responseObject);

};

//define o handler para quando receber uma mensagem
client.onConnectionLost = (message) => {
    //Ao receber a mensagem, repassa para seu callback o topico e o payload
    onMessageReceived(message.destinationName, message.payloadString);
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
