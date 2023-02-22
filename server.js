const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const binance = require('node-binance-api');
const axios = require('axios');

app.use(cors());
app.use(bodyParser.json());

const apiKey = 'SUA_API_KEY';
const secretKey = 'SUA_SECRET_KEY';

// inicializa a conexão com a API da Binance

if (!apiKey || !secretKey) {
    console.error('API Key ou Secret Key não fornecidos');
    process.exit(1);
  }
  

// endpoint para obter informações da conta
app.get('/account', async (req, res) => {
    try {
      const accountInfo = await binance.accountInfo();
      res.json(accountInfo);
    } catch (err) {
      console.error(err);
      if (err.message === 'Invalid HMAC') {
        res.status(401).json({ error: 'API Key ou Secret Key inválidos' });
      } else {
        res.status(500).json({ error: 'Erro ao obter informações da conta' });
      }
    }
  });
  

// endpoint para obter informações de um determinado ativo
app.get('/asset/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const assetInfo = await binance.prices(symbol);
    res.json(assetInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erro ao obter informações do ativo ${symbol}` });
  }
});

// endpoint para criar uma ordem de compra
// Endpoint para criar uma ordem de compra
app.post('/buy', async (req, res) => {
    const { symbol, quantity, price } = req.body;
    if (!symbol || !quantity || !price) {
      return res.status(400).json({ error: 'Símbolo, quantidade e preço são obrigatórios' });
    }
    try {
      const order = await axios.post('https://api.binance.com/api/v3/order', {
        symbol,
        quantity,
        price,
        side: 'BUY',
        type: 'LIMIT',
        timeInForce: 'GTC',
      }, {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });
      res.json(order.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `Erro ao criar ordem de compra para o ativo ${symbol}` });
    }
  });
  
  // Endpoint para criar uma ordem de venda
  app.post('/sell', async (req, res) => {
    const { symbol, quantity, price } = req.body;
    if (!symbol || !quantity || !price) {
      return res.status(400).json({ error: 'Símbolo, quantidade e preço são obrigatórios' });
    }
    try {
      const order = await axios.post('https://api.binance.com/api/v3/order', {
        symbol,
        quantity,
        price,
        side: 'SELL',
        type: 'LIMIT',
        timeInForce: 'GTC',
      }, {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });
      res.json(order.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `Erro ao criar ordem de venda para o ativo ${symbol}` });
    }
  });

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    res.on('finish', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Response: ${JSON.stringify(res.body)}`);
    });
    next();
  });

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
  });