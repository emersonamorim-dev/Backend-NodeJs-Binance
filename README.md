# Backend-NodeJs-Binance

Codificação de Backend em NodeJs de Exchange Binance com uso de framework Express para facilitar a implementação dos principais Endpoints para consulta 
e requisição via Postman.


Requisições via Postman:

GET endpoint para obter informações da conta
http://localhost:3000/account

GET endpoint para obter informações de um determinado ativo
http://localhost:3000/asset/:symbol

POST Endpoint para criar uma ordem de compra
http://localhost:3000/buy

POST Endpoint para criar uma ordem de venda
http://localhost:3000/sell


# Execute o contêiner do Docker:
docker run -p 3000:3000 backend-nodejs-binance
