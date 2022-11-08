import React from "react";
import "./HistoricoFolha.css";
import axios from "axios";

const api_key = process.env.REACT_APP_API_KEY;

export default class Historico extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      champs: [],
      champsCarregados: false,
      matchesId: [],
      partidas: [],
      partidasCarregadas: false,    
    }
  }

  componentDidMount() { // quando o DOM é carregado
    this.getPartidas(this.props.puuid);
    this.getCampeoes().then(champs => {
      this.setState(
        {champs: champs,
        champsCarregados: true
        });
      
    });
  
    //this.tempoPartida(1636169062766*1000)
 }

 getDadosCampeao = (champId, champs) => {

  for(let c in champs){    
    if(String(champs[c].key) === String(champId)){
      
      return {
        champName: c,
        imgCampeao: "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/champion/" + c + ".png"
      }
      
    };
  }
}

async getCampeoes (){

  return await axios.get('https://ddragon.leagueoflegends.com/cdn/12.2.1/data/en_US/champion.json')
  .then((response) => {

    const champs = response.data.data;

    return champs;

  });

}

 tempoPartida = (timestamp) => { // retorna diferença de tempo do fim da partida até agora
    //var jogo = new Date(timestamp);
    //console.log(jogo.toGMTString()+"\n"+jogo.toLocaleString());

    //var atual = new Date();
    //console.log(atual.toGMTString()+"\n"+atual.toLocaleString());
 }

 getPartidas(puuid){
    axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?start=0&count=4' 
    ,{
      params:{
        'api_key': api_key
    }}).then((response) => {

      try{
          this.setState({matchesId: response.data});
          //console.log(this.state.matchesId);

          for(let i = 0 ; i < this.state.matchesId.length ; i++){
            
            this.getPartida(this.state.matchesId[i]);
          }

      }catch(e){
        console.log("erro ao pegar partidas")
        console.log(e);
      }
      
    });
  }

  getPartida(codigo){

    axios.get('https://americas.api.riotgames.com/lol/match/v5/matches/' + codigo 
    ,{
      params:{
        'api_key': api_key
    }}).then((response) => {

      try{
        
          var partida = response.data;

          var partidas = this.state.partidas;
          partidas.push(partida);

          this.setState({
            partidas: partidas
          });

          if(this.state.partidas.length === this.state.matchesId.length) this.setState({partidasCarregadas: true});
          
      }catch(e){
        console.log("erro ao pegar partida")
      }
      
    });
  }

  getDadosChampPartida(num){
    var partida = this.state.partidas[num].info;
    var participants = partida.participants;

    var jogador = participants.filter((jogador) => (jogador.puuid === this.props.puuid));

    //console.log(jogador);

    return jogador;
  }

  handleChange = (event) => {
    //this.setState({invocador: event.target.value});
  }

  render(){
      return(
          <div id="content">
            <h2>Histórico</h2>

            {this.state.partidasCarregadas && this.state.champsCarregados &&
            
            <div id="historico">
          
                {(this.state.partidas).map((partida, i ) => {

                  /* Dados Jogador

                  assists, baronKills, champLevel, championId, 
                  championName, deaths, doubleKills, firstBloodKill,
                  item0 até item6, kills, pentaKills, quadraKills, win 
                  
                  */

                  var jogador = this.getDadosChampPartida(i);
                  jogador = jogador[0];
                  //console.log(jogador);

                  var kills = jogador.kills;
                  var deaths = jogador.deaths;
                  var assists = jogador.assists;

                  var conquista = "";

                  if(jogador.pentaKills > 0) conquista = "PentaKill";
                  else if(jogador.quadraKills > 0) conquista = "QuadraKill";
                  else if(jogador.doubleKills > 0) conquista = "DoubleKill";
                  else if(jogador.firstBloodKill) conquista = "FirstBlood";
                  else if( deaths - kills > 4) conquista = "Feeder";
                  else if( kills > 10 && deaths < 2) conquista = "Carry"
                  

                  var cor = "black";

                  if(jogador.win) {
                    cor = "green"}

                  else {
                    cor = "#ff1a1a"};

                  var gameMode = partida.info.gameMode;

                  var dados = this.getDadosCampeao(jogador.championId, this.state.champs);

                  //console.log(this.state.conquista);
                  //var champName =  dados.champName;
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

                  for( let i = 0 ; i < 6 ; i++){
                    if(jogador.item0 === 0) imgItens.item0 = ""
                    else if(jogador.item1 === 0) imgItens.item1 = ""
                    else if(jogador.item2 === 0) imgItens.item2 = ""
                    else if(jogador.item3 === 0) imgItens.item3 = ""
                    else if(jogador.item4 === 0) imgItens.item4 = ""
                    else if(jogador.item5 === 0) imgItens.item5 = ""
                  } 

                   // var gamemode = partida.info.gamemode;
                    return(
                        <div id="partida" key={i} style={{backgroundColor: cor}}>
                          
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
                                <p style={{fontSize:"13px", fontWeight: "bold"}}>{kills}/{deaths}/{assists}</p>
                                <p style={{fontSize: "13px",fontWeight: "bold"}}>{conquista}</p>
                            </div>

                            <div id="moreInfo">
                                <p style={{fontSize:"14px", fontWeight: "bold"}}>Nível {jogador.champLevel}</p>
                                <p style={{fontSize:"14px", fontWeight: "bold"}}>Farm: {farm}</p>
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
      
  
}
