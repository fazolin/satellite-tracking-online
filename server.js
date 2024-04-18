const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
const axios = require("axios");
require("dotenv").config();

const sateliteId = [
  25544, 25338, 28654, 33591, 25994, 27424, 38771, 37849, 40967, 27607, 40069,
  36032, 53883, 43495, 43224, 49810, 58928, 54754, 42969, 42901, 42758, 40302,
  40115,
];

const predictedSeconds = 2400;
const urlN2yo = [];

for (var i = 0; i < sateliteId.length; i++) {
  urlN2yo[i] =
    "https://api.n2yo.com/rest/v1/satellite/positions/" +
    sateliteId[i] +
    "/0/0/0/" +
    predictedSeconds +
    "/&apiKey=" +
    process.env.N2Y0_API_KEY;
}

let satelite = [];

// Função para fazer a requisição e adicionar o JSON ao array satelite
const fetchJSON = async (url) => {
  try {
    const res = await axios.get(url);
    satelite.push(res.data);
  } catch (err) {
    console.log(err);
  }
};

// Rota para fazer a requisição ao servidor do N2YO
app.get("/buscarSatelites", async (req, res) => {
  try {
    await Promise.all(urlN2yo.map((url) => fetchJSON(url)));
    res.json(satelite); // Retorna os JSONs ao cliente que acessou a rota
    console.log("Dados enviados");
    console.log(satelite);
    console.log("************* fim dos dados *************");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao buscar satélites" });
  }
});

//rotas

// Define o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/hello", (req, res) => {
  res.send({ id: 1, nome: "caio" });
});

// Rota para renderizar a página HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
