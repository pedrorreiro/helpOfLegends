import React from "react";
import { useState, useEffect } from "react";
import { getDadosCampeao, getCampeoes, getDadosItem } from "../tools";
import "./HistoricoFolha.css";
import axios from "axios";
import moment from "moment";
import { Spin, Tooltip } from "antd";

const api_key = process.env.REACT_APP_API_KEY;

export default function Historico(props) {
  const [champsCarregados, setChampsCarregados] = useState(false);
  const [partidas, setPartidas] = useState([]);
  const [partidasCarregadas, setPartidasCarregadas] = useState(false);

  var champList = [];

  const getPartidas = async (puuid) => {
    axios
      .get(
        "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
        puuid +
        "/ids?start=0&count=7",
        {
          params: {
            api_key: api_key,
          },
        }
      )
      .then(async (response) => {
        try {
          const matchesId = response.data;

          console.log(matchesId);

          const partidas = await Promise.all(
            matchesId.map(async (id) => {
              return await getPartida(id);
            })
          );

          setPartidas(partidas);

          setPartidasCarregadas(true);

          console.log("Partidas carregadas");
        } catch (e) {
          console.log("erro ao pegar partidas");
          console.log(e);
        }
      });
  };

  useEffect(() => {
    getCampeoes().then((champs) => {
      champList = champs;
      getPartidas(props.puuid);
      setChampsCarregados(true);
      console.log("Campeões carregados");
    });
  }, [props.puuid]);

  const renderBuildLine = (items) => {

    return (
      <div className="grupo">

        {items.map((item, i) => {

          if(item.name === "") return <div className="item vazio" key={i}></div>

          return (
            <Tooltip title={
              <div class="item-info">
                <h2>{item.name}</h2>
                <p>Gold: <strong>{item.price}</strong></p>
                <p><strong>{item.plaintext}</strong></p>
                <p>{item.description}</p>
              </div>

            }
            >
              <img
                className="item"
                alt="item"
                src={item.img}
              ></img>
            </Tooltip>
          );
        })}

      </div>
    )
  };

  const tempoPartida = (timestamp) => {
    // retorna diferença de tempo do fim da partida até agora
    var jogo = new Date(timestamp);

    var atual = new Date();

    const dayDiff = moment(atual).diff(moment(jogo), "days");
    const horaDif = moment(atual).diff(moment(jogo), "hours");
    const minDif = moment(atual).diff(moment(jogo), "minutes");

    if (dayDiff > 0) {
      return dayDiff + " dia(s)";
    }

    if (horaDif > 0) {
      return horaDif + " horas(s)";
    }

    if (minDif > 0) {
      return minDif + " minutos(s)";
    }
  };

  const getPartida = async (codigo) => {
    return axios
      .get(
        "https://americas.api.riotgames.com/lol/match/v5/matches/" + codigo,
        {
          params: {
            api_key: api_key,
          },
        }
      )
      .then(async (response) => {
        try {
          var partida = response.data;

          partida.tempoDiff = tempoPartida(partida.info.gameEndTimestamp);

          var jogador = getDadosChampPartida(partida);

          if (jogador.length === 0) return;

          jogador = jogador[0];

          var kills = jogador.kills;
          var deaths = jogador.deaths;
          var assists = jogador.assists;

          var conquista = "";

          if (jogador.pentaKills > 0) conquista = "PentaKill";
          else if (jogador.quadraKills > 0) conquista = "QuadraKill";
          else if (jogador.doubleKills > 0) conquista = "DoubleKill";
          else if (jogador.firstBloodKill) conquista = "FirstBlood";
          else if (deaths - kills > 4) conquista = "Feeder";
          else if (kills > 10 && deaths < 2) conquista = "Carry";

          var cor = "black";

          if (jogador.win) {
            cor = "#005a00";
          } else {
            cor = "rgb(145 0 0)";
          }

          var gameMode = partida.info.gameMode;

          const dados = await getDadosCampeao(jogador.championId, champList);

          var img = dados.imgCampeao;

          var farm = jogador.totalMinionsKilled + jogador.neutralMinionsKilled;

          // var farmPorMinuto = (farm / partida.info.gameDuration) * 60;

          var itensIds = [
            jogador.item0,
            jogador.item1,
            jogador.item2,
            jogador.item3,
            jogador.item4,
            jogador.item5,
            jogador.item6,
          ];

          var items = await Promise.all(
            itensIds.map(async (id) => {
              return await getDadosItem(id);
            })
          );

          items.forEach((item) => {
            if (item === 0) {
              item.img = "";
            }
          });

          jogador.items = items;

          jogador.imgChamp = img;
          jogador.farm = farm;
          jogador.assists = assists;
          jogador.conquista = conquista;

          partida.me = jogador;
          partida.cor = cor;
          partida.gameMode = gameMode;

          return partida;

        } catch (e) {
          console.log("erro ao pegar partida");
          console.log(e);
        }
      });
  };

  const getDadosChampPartida = (partida) => {
    var p = partida.info;
    const participants = p.participants;

    var jogador = participants.filter(
      (jogador) => jogador.puuid === props.puuid
    );

    return jogador;
  };

  return (
    <div className="content">
      <h2>Histórico</h2>

      {partidasCarregadas && champsCarregados ? (
        <div id="historico">
          {partidas.map((partida, i) => {
            /* Dados Jogador

            assists, baronKills, champLevel, championId, 
            championName, deaths, doubleKills, firstBloodKill,
            item0 até item6, kills, pentaKills, quadraKills, win 
            
            */

            // var gamemode = partida.info.gamemode;
            return (
              <div
                className="divPartida"
                key={i}
                style={{ backgroundColor: partida.cor }}
              >
                <p>Há {partida.tempoDiff}</p>

                <div id="info">
                  <p id="gameMode">{partida.gameMode}</p>
                </div>

                <div className="partida">
                  <div className="part1">
                    <img
                      id="imgChamp"
                      alt="teste"
                      src={partida.me.imgChamp}
                    ></img>

                    <div id="spells">
                      <img
                        className="spell"
                        alt="spell1"
                        src="https://opgg-static.akamaized.net/images/lol/spell/SummonerFlash.png?image=c_scale,q_auto,w_22&v=1635906101"
                      ></img>

                      <img
                        className="spell"
                        alt="spell2"
                        src="https://opgg-static.akamaized.net/images/lol/spell/SummonerDot.png?image=c_scale,q_auto,w_22&v=1635906101"
                      ></img>
                    </div>

                    <div id="frag">
                      <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {partida.me.kills}/{partida.me.deaths}/
                        {partida.me.assists}
                      </p>
                      <p style={{ fontSize: "13px", fontWeight: "bold" }}>
                        {partida.me.conquista}
                      </p>
                    </div>

                    <div id="moreInfo">
                      <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Nível {partida.me.champLevel}
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Farm: {partida.me.farm}
                      </p>
                    </div>
                  </div>
                  <div className="part2">
                    <div id="build">
                      {
                        renderBuildLine(
                          (partida.me.items).slice(0, 3)
                        )
                      }

                      {
                        renderBuildLine(
                          (partida.me.items).slice(3, 6)
                        )
                      }

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Spin size="medium" />
      )}
    </div>
  );
}
