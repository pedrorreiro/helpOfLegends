import React from "react";
import { useState, useEffect } from "react";
import { getDadosCampeao, getCampeoes } from "../tools";
import "./HistoricoFolha.css";
import axios from "axios";
import moment from "moment";

const api_key = process.env.REACT_APP_API_KEY || "RGAPI-358bb2a2-afea-4842-aa31-699bb3b04fc8";

export default function Historico(props) {
  const [champs, setChamps] = useState([]);
  const [champsCarregados, setChampsCarregados] = useState(false);
  const [partidas, setPartidas] = useState([]);
  const [partidasCarregadas, setPartidasCarregadas] = useState(false);

  var matchesId = [];

  const getPartidas = async (puuid) => {
   
    axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?start=0&count=7'
      , {
        params: {
          'api_key': api_key
        }
      }).then((response) => {

        try {

          matchesId = response.data;

          for (let i = 0; i < matchesId.length; i++) {
            
            getPartida(matchesId[i]);
          }

        } catch (e) {
          console.log("erro ao pegar partidas")
          console.log(e);
        }

      });
  }

  useEffect(() => {

    getPartidas(props.puuid);
    getCampeoes().then(champs => {
     
      setChamps(champs);
      setChampsCarregados(true);

    });

  }, [props.puuid]);



  const tempoPartida = (timestamp) => { // retorna diferença de tempo do fim da partida até agora
    var jogo = new Date(timestamp);

    var atual = new Date();

    const dayDiff = moment(atual).diff(moment(jogo), 'days');
    const horaDif = moment(atual).diff(moment(jogo), 'hours');
    const minDif = moment(atual).diff(moment(jogo), 'minutes');


    if (dayDiff > 0) {
      return dayDiff + " dia(s)";
    }

    if (horaDif > 0) {
      return horaDif + " horas(s)";
    }

    if (minDif > 0) {
      return minDif + " minutos(s)";
    }

  }

  const getPartida = (codigo) => {

    axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/' + codigo
      , {
        params: {
          'api_key': api_key
        }
      }).then((response) => {

        try {

          var partida = response.data;

          // console.log(partida);

          partida.tempoDiff = tempoPartida(partida.info.gameEndTimestamp);

          var p  = partidas;
          p.push(partida);

          setPartidas(p);

          if (p.length === matchesId.length) setPartidasCarregadas(true);

        } catch (e) {
          console.log("erro ao pegar partida")
        }

      });
  }

  const getDadosChampPartida = (num) => {

    var partida = partidas[num].info;
    var participants = partida.participants;

    var jogador = participants.filter((jogador) => (jogador.puuid === props.puuid));

    

    return jogador;
  }

  const handleChange = (event) => {
    //this.setState({invocador: event.target.value});
  }


  return (
    <div className="content">
      <h2>Histórico</h2>

      {partidasCarregadas && champsCarregados &&

        <div id="historico">

          {(partidas).map((partida, i) => {

            /* Dados Jogador

            assists, baronKills, champLevel, championId, 
            championName, deaths, doubleKills, firstBloodKill,
            item0 até item6, kills, pentaKills, quadraKills, win 
            
            */

            var jogador = getDadosChampPartida(i);

            if(jogador.length === 0) return; 

            jogador = jogador[0];
            // console.log(jogador);

            var kills = jogador.kills;
            var deaths = jogador.deaths;
            var assists = jogador.assists;

            var conquista = "";

            if (jogador.pentaKills > 0) conquista = "PentaKill";
            else if (jogador.quadraKills > 0) conquista = "QuadraKill";
            else if (jogador.doubleKills > 0) conquista = "DoubleKill";
            else if (jogador.firstBloodKill) conquista = "FirstBlood";
            else if (deaths - kills > 4) conquista = "Feeder";
            else if (kills > 10 && deaths < 2) conquista = "Carry"


            var cor = "black";

            if (jogador.win) {
              cor = "green"
            }

            else {
              cor = "#ff1a1a"
            };

            var gameMode = partida.info.gameMode;
     
            var dados = getDadosCampeao(jogador.championId, champs);
          
            var img = dados.imgCampeao;
      
            var farm = jogador.totalMinionsKilled + jogador.neutralMinionsKilled;

            var imgItens = {
              item0: "https://opgg-static.akamaized.net/images/lol/item/" + jogador.item0 + ".png?image=q_auto:best&v=1635906101",
              item1: "https://opgg-static.akamaized.net/images/lol/item/" + jogador.item1 + ".png?image=q_auto:best&v=1635906101",
              item2: "https://opgg-static.akamaized.net/images/lol/item/" + jogador.item2 + ".png?image=q_auto:best&v=1635906101",
              item3: "https://opgg-static.akamaized.net/images/lol/item/" + jogador.item3 + ".png?image=q_auto:best&v=1635906101",
              item4: "https://opgg-static.akamaized.net/images/lol/item/" + jogador.item4 + ".png?image=q_auto:best&v=1635906101",
              item5: "https://opgg-static.akamaized.net/images/lol/item/" + jogador.item5 + ".png?image=q_auto:best&v=1635906101",
            }

            for (let i = 0; i < 6; i++) {
              if (jogador.item0 === 0) imgItens.item0 = ""
              else if (jogador.item1 === 0) imgItens.item1 = ""
              else if (jogador.item2 === 0) imgItens.item2 = ""
              else if (jogador.item3 === 0) imgItens.item3 = ""
              else if (jogador.item4 === 0) imgItens.item4 = ""
              else if (jogador.item5 === 0) imgItens.item5 = ""
            }

            // var gamemode = partida.info.gamemode;
            return (
              <div id="partida" key={i} style={{ backgroundColor: cor }}>

                <p>há {partida.tempoDiff}</p>

                <div id="info">
                  <p id="gameMode">{gameMode}</p>
                </div>

                <img id="imgChamp" alt="teste" src={img}></img>

                <div id="spells">

                  <img className="spell" alt="spell1"
                    src="https://opgg-static.akamaized.net/images/lol/spell/SummonerFlash.png?image=c_scale,q_auto,w_22&v=1635906101"></img>

                  <img className="spell" alt="spell2"
                    src="https://opgg-static.akamaized.net/images/lol/spell/SummonerDot.png?image=c_scale,q_auto,w_22&v=1635906101"></img>

                </div>

                <div id="frag">
                  <p style={{ fontSize: "13px", fontWeight: "bold" }}>{kills}/{deaths}/{assists}</p>
                  <p style={{ fontSize: "13px", fontWeight: "bold" }}>{conquista}</p>
                </div>

                <div id="moreInfo">
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>Nível {jogador.champLevel}</p>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>Farm: {farm}</p>
                </div>

                <div id="build">
                  <div className="grupo">
                    <img className="item" alt="item" src={imgItens.item0}></img>
                    <img className="item" alt="item" src={imgItens.item1}></img>
                    <img className="item" alt="item" src={imgItens.item2}></img>
                  </div>

                  <div className="grupo">
                    <img className="item" alt="item" src={imgItens.item3}></img>
                    <img className="item" alt="item" src={imgItens.item4}></img>
                    <img className="item" alt="item" src={imgItens.item5}></img>
                  </div>
                </div>
              </div>
            )
          })}

        </div>}
    </div>
  );
}

