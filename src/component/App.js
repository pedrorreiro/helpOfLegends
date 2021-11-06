import React from "react";
import "./App.css";
import axios from "axios";
import Historico from "./Historico";

const api_key = "RGAPI-d37ebf6a-5115-4b0b-b36a-5cf0cb418b54";

export default class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      msgErro: "",
      msgErroStatus: "block",
      invocador: "Eu cuido do caso",
      invocadorId: "",
      puuid: "",
      level: "0",
      imgInvocador: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png",
      imgCampeao: "",
      imgMaestria: "",
      estadoDados: "none",
      qtdMaestria: 0,
      champId: "0",
      champLevel: 0,
      champName: "Name",
      freeWeek: [],
      freeWeekVisible: "normal"
      
    }
  }

  componentDidMount() { // quando o DOM é carregado
    this.freeWeek();
 }

  handleChange = (event) => {
    this.setState({invocador: event.target.value});
  }

  verificaMaiorMaestria = (champ) => {
  
    const { championPoints, championId, championLevel} = champ;
  
    const img = require(`../img/maestrias/m${championLevel}.png`);

    this.setState({
      qtdMaestria: championPoints.toLocaleString('en-US'),
      champId: championId.toString(),
      champLevel: championLevel,
      imgMaestria: img
    });
  }

  async getCampeoes (){

    return await axios.get('https://ddragon.leagueoflegends.com/cdn/11.22.1/data/en_US/champion.json')
    .then((response) => {

      const champs = response.data.data;

      return champs;

    });

  }

  getDados(nome) {

    if(!this.state.invocador){
      this.throwError();
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

        if(response.status === 200){console.log("deu bao")}
        else console.log("n deu");

        if (response.status.status_code === 404) console.log("n achou o role");

        this.setState({

          level: response.data.summonerLevel,

          imgInvocador: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/" +
            response.data.profileIconId + ".png",

          invocadorId: response.data.id,

          puuid: response.data.puuid,

          isReady: true

        });

        this.getMaestrias();

      });
    } catch (e) {
        this.throwError();
      }
  }

  throwError(){
    console.clear();
        this.setState({
          msgErro: "O jogador não existe!",
          estadoDados: "none",
          level: 0,
          imgInvocador: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png"
          
        })
  }

  getDadosCampeao = (champId, champs) => {

    for(let c in champs){    
      if(String(champs[c].key) === champId){
  
        return {
          champName: c,
          imgCampeao: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/" + c + ".png"
        }
        
      };
    }
  }

  getMaestrias = () => {
    axios.get('https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' 
    + this.state.invocadorId,{
      params:{
        'api_key': api_key
    }}).then((response) => {

      try{
        this.verificaMaiorMaestria(response.data[0]);

        this.getCampeoes().then((champs) => {
          
          const dados = this.getDadosCampeao(this.state.champId, champs);
              
          this.setState({
            champName: dados.champName,
            imgCampeao: dados.imgCampeao
          });
     
        });

        this.setState({
          estadoDados: "flex",
          msgErro: ""
        });

      }catch(e){
        console.log("erro ao pegar maestria")
        this.setState({
          estadoDados: "none",
          msgErro: "O jogador não possui maestrias",
          imgInvocador: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png"
        });
      }
      
    });
  }

  freeWeek = () => {
    axios.get('https://br1.api.riotgames.com/lol/platform/v3/champion-rotations', {
      params: {
        'api_key': api_key
      }
    }).then((response) => {

      try {

        var freeWeek = [];

        this.getCampeoes().then((allChamps) => {
          const ids = response.data['freeChampionIds'];
          const size = ids.length;

          for (let i = 0; i < size; i++) {

            let dadosChamp = this.getDadosCampeao(ids[i].toString(), allChamps);

            let name = dadosChamp.champName;

            freeWeek.push({
              id: ids[i],
              name: name
            })

          }

          this.setState({freeWeek: freeWeek});

        });

      } catch (e) {
        console.log("erro ao ler freeweek")

      }

    });
  }

  render(){
    return (
      <div className="component-app">
        <div id="content">
        
          <div id="divSummoner">
            <img id="iconeInvocador" alt="icone de invocador" src={this.state.imgInvocador} width="100px"></img>
            <h3 id="nivelInvocadorText">Nível de invocador</h3>
            <h1>{this.state.level}</h1>
          </div>

          <div id="middle">

            <div id="divBusca">
              <span style={{fontSize: 15+"px", fontWeight: "bold", marginBottom: "30px"}}>Nome de invocador</span><br/><br/>
              <input value={this.state.invocador} onChange={(event) => this.handleChange(event)}></input>
              <button onClick={() => this.getDados(this.state.invocador)}>Buscar</button>

              <div id="msgErro" style={{display: this.state.msgErroStatus}}>
                <p id="pErro">{this.state.msgErro}</p>
              </div>

            </div>

            <div id="cont">
              {this.state.isReady && 
              (
                <div id="divMaestria">
                    <h2 style={{marginBottom: "30px"}}>Campeão mais jogado</h2>
                    <h2>{this.state.champName}</h2>
                    <img id="iconeChamp" alt="icone de campeao" src={this.state.imgCampeao}></img>
                    <div id="maestria">
                      <img id="iconeMaestria" alt="maestria" src={this.state.imgMaestria}></img>
                      <h3>Maestria {this.state.champLevel}</h3>
                      <h3 style={{fontWeight:"bold"}}>Pontos {this.state.qtdMaestria}</h3>
                    </div>
                  </div>
              )
              }
                
                {this.state.isReady && (
                  <div id="historico">
                  <Historico nomeInvocador={this.state.invocador} puuid={this.state.puuid}></Historico>
                </div>
                )}
              
            </div>

            <div id="freeWeek">

              <details open>
    
              <summary>
                <span style={
                  {
                    fontSize: "16px",
                    fontWeight: "bold"
                  
                  }}>Rotação Grátis da Semana</span>
              </summary>

                <div id="champs" className={this.state.freeWeekVisible}>  

                  {(this.state.freeWeek).map((champ, i ) => {
                    let img = "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/" + champ.name + ".png"
                    
                    return(
                      <div className="champ" key={champ.name}>

                        <img 
                        className="champFreeWeek"
                        alt="campeao freeweek" 
                        src={img}/>

                        <br/>

                        <span
                        style={{
                          fontSize:"12px",
                          alignContent: "center",
                          fontWeight: "bold"
                        }}
                        >{champ.name}</span>
                      </div>
                    )
                  })}
            
                </div>

            </details>

            </div>
          
          </div>

        </div>
      </div>
    );
  }
}
