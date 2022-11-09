import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../component/App.css";
import axios from "axios";
import Historico from "../component/Historico";
import { getCampeoes, getDadosCampeao } from "../tools";

const api_key = process.env.REACT_APP_API_KEY || "RGAPI-358bb2a2-afea-4842-aa31-699bb3b04fc8";

export default function Invocador() {

  const [invocador, setInvocador] = useState({
    nome: "",
    level: "",
    img: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png",
    puuid: "",
  });

  const [msgErro, setMsgErro] = useState("");
 
  const [campeaoMaisJogado, setCampeaoMaisJogado] = useState({
    imgMaestria: require(`../img/maestrias/m1.png`),
  });
  const [isReady, setIsReady] = useState(false);

  const busca = useParams().busca.replace("+", " ");

  useEffect(() => {
    console.log("getdados");
    getDados(busca);
  }, [busca]);

  const getDados = (nome) => {

    if (!invocador) {
      throwError();
      return 0;
    }

    try {
      axios.get('https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nome, {
        params: {
          'api_key': api_key
        },
        headers: {

        }
      }).then((response) => {
        if (response.status === 200) { console.log("deu bao") }
        else throwError();

        if (response.status.status_code === 404) throwError();

        setInvocador({
          nome: response.data.name,
          level: response.data.summonerLevel,
          img: "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/profileicon/" + response.data.profileIconId + ".png",
          puuid: response.data.puuid,
        })

        getMaestrias(response.data.id);

        setIsReady(true);

      }).catch((e) => {
        throwError();
        console.log("Erro: " + e);
      
        return 0;
      });
    } catch (error) { throwError() }
  }

  const throwError = () => {
    console.clear();

    setMsgErro("Invocador não encontrado");

    setInvocador({
      ...invocador,
      level: 0,
      img: "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/profileicon/0.png",
    });

  }

  const getMaestrias = async (invocadorId) => {
    axios.get('https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'
      + invocadorId, {
      params: {
        'api_key': api_key
      }
    }).then(async (response) => {

      try {

        const maiorMaestria = response.data[0];

        // console.log(maiorMaestria);

        const allChamps = await getCampeoes();

        const dados = getDadosCampeao(maiorMaestria.championId.toString(), allChamps);

        // console.log(dados);
      
        const img = require(`../img/maestrias/m${maiorMaestria.championLevel}.png`);

        setCampeaoMaisJogado({
          name: dados.champName,
          maestria: maiorMaestria.championPoints.toLocaleString('en-US'),
          imgMaestria: img,
          level: maiorMaestria.championLevel,
          img: dados.imgCampeao
        })

        setMsgErro("");

      } catch (e) {
        console.log("erro ao pegar maestria");

        setMsgErro("Invocador não possui maestrias");

        setInvocador({
          ...invocador,
          img: "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/profileicon/0.png",
        });

      }

    });
  }

  return (
    <div className="component-app">
      <div className="content">

        <h1>{invocador.nome}</h1>

        <div id="divSummoner">
          <img id="iconeInvocador" alt="icone de invocador" title="Ícone de Invocador" src={invocador.img} width="100px"></img>
          <h3 id="nivelInvocadorText">Nível de invocador</h3>
          <h1>{invocador.level}</h1>
        </div>

        <div id="middle">

          <div id="cont">
            {isReady &&
              (
                <div id="divMaestria">
                  <h2 style={{ marginBottom: "30px" }}>Campeão mais jogado</h2>
                  <h2>{campeaoMaisJogado.name}</h2>
                  <img id="iconeChamp" alt="icone de campeao" title="Campeão" src={campeaoMaisJogado.img}></img>
    
                  <div id="maestria">
                    <img id="iconeMaestria" alt="maestria" src={campeaoMaisJogado.imgMaestria.default}/>
                    <h3>Maestria {campeaoMaisJogado.level}</h3>
                    <h3 style={{ fontWeight: "bold" }}>Pontos {campeaoMaisJogado.maestria}</h3>
                  </div>
                </div>
              )
            }

            {isReady && (
              <div id="historico">
                <Historico nomeInvocador={invocador.nome} puuid={invocador.puuid}></Historico>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );

}             