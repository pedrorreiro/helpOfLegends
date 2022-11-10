import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../component/App.css";
import axios from "axios";
import Historico from "../component/Historico";
import { getCampeoes, getDadosCampeao } from "../tools";
import { Spin } from 'antd';

const api_key = process.env.REACT_APP_API_KEY;

export default function Invocador() {

  const [invocador, setInvocador] = useState({
    nome: "",
    level: "",
    img: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png",
    puuid: "",
  });

  const [msgErro, setMsgErro] = useState("");
  const [loading, setLoading] = useState(false);

  const [campeaoMaisJogado, setCampeaoMaisJogado] = useState({
    imgMaestria: require(`../img/maestrias/m1.png`),
  });
  const [isReady, setIsReady] = useState(false);

  const busca = useParams().busca.replace("+", " ");

  useEffect(() => {
    console.log("getdados");
    getDados(busca);
  }, [busca]);

  const resetInvocador = () => {
    setInvocador({
      nome: "",
      level: "",
      img: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png",
      puuid: "",
    });
  }

  const getDados = (nome) => {

    if (!invocador) {
      throwError();
      return 0;
    }

    setLoading(true);

    try {
      axios.get('https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nome, {
        params: {
          'api_key': api_key
        },
        headers: {

        }
      }).then((response) => {
        if (response.status === 200) {

          setInvocador({
            nome: response.data.name,
            level: response.data.summonerLevel,
            img: "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/profileicon/" + response.data.profileIconId + ".png",
            puuid: response.data.puuid,
          })

          getMaestrias(response.data.id);

          setIsReady(true);

        }
        else throwError();

        if (response.status.status_code === 404) throwError();


      }).catch((e) => {
        throwError();
        console.log("Erro: " + e);

        return 0;
      }).finally(() => {
        setLoading(false);
      });
    } catch (error) { throwError() }
  }

  const throwError = () => {
    console.clear();

    setMsgErro("Invocador não encontrado");

    resetInvocador();

    setIsReady(false);

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

        const dados = await getDadosCampeao(maiorMaestria.championId.toString(), allChamps);

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

        resetInvocador();

      }

    });
  }

  return (
    <div className="component-app">

      {loading ? <Spin size="large"/> 
      :

        <div className="content">
     
          <h1>{msgErro !== "" ? msgErro : null}</h1>
          <h1>{invocador.nome}</h1>

          <div id="divSummoner">
            <img id="iconeInvocador" alt="icone de invocador" title="Ícone de Invocador" src={invocador.img} width="100px"></img>
            <h3 id="nivelInvocadorText"><strong>Nível de invocador</strong></h3>
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
                      <img id="iconeMaestria" alt="maestria" src={campeaoMaisJogado.imgMaestria.default} />
                      <h3>Maestria {campeaoMaisJogado.level}</h3>
                      <h3 style={{ fontWeight: "bold" }}>{campeaoMaisJogado.maestria}</h3>
                    </div>
                  </div>
                )
              }

              {isReady && (
                <div id="historico">
                  <Historico nomeInvocador={invocador.nome} puuid={invocador.puuid} background={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${campeaoMaisJogado.name}_0.jpg`}></Historico>
                </div>
              )}

            </div>

          </div>

        </div>

      }

    </div>
  );

}             