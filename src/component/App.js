import React from "react";
import "./App.css";
import axios from "axios";

const api_key = "RGAPI-7cab5dd9-8d71-410c-8d9c-fe6f8235e646";

export default class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      msgErro: "",
      msgErroStatus: "block",
      invocador: "Eu cuido do caso",
      invocadorId: "",
      level: "0",
      imgInvocador: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png",
      imgCampeao: "",
      imgMaestria: "",
      estadoDados: "none",
      qtdMaestria: 0,
      champId: "0",
      champLevel: 0,
      champName: "Name"
      
    }
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

  getCampeao = () => {

    axios.get('https://ddragon.leagueoflegends.com/cdn/11.22.1/data/en_US/champion.json')
    .then((response) => {

      const champs = response.data.data;

      for(let c in champs){

        if(String(champs[c].key) === this.state.champId){
          this.setState({
            champName: c,
            imgCampeao: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/" + c + ".png"
          })
          break;
        };
      }
    });

  }

  async getDados(nome) {
    try {
      await axios.get('https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nome, {
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

          invocadorId: response.data.id

        });

        this.getMaestrias();

      });
    } catch (e) {
        console.clear();
        this.setState({
          msgErro: "O jogador não existe!",
          estadoDados: "none",
          level: 0,
          imgInvocador: "https://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png"
          
        })
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
        this.getCampeao();

        this.setState({
          estadoDados: "inline-block",
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

  render(){
    return (
      <div className="component-app">
        <div id="content">
        
          <div id="divSummoner">
            <img id="iconeInvocador" alt="icone de invocador" src={this.state.imgInvocador} width="100px"></img>
            <h3 id="nivelInvocadorText">Nível de invocador</h3>
            <h1>{this.state.level}</h1>
          </div>

          <div id="left">
            <span style={{fontSize: 15+"px", fontWeight: "bold", marginBottom: "30px"}}>Nome de invocador</span><br/><br/>
            <input value={this.state.invocador} onChange={(event) => this.handleChange(event)}></input>
            <button onClick={() => this.getDados(this.state.invocador)}>Pesquisar</button>

            <div id="msgErro" style={{display: this.state.msgErroStatus}}>
              <p id="pErro">{this.state.msgErro}</p>
            </div>

            <div id="divMaestria" style={{display:this.state.estadoDados}}>
              <h2 style={{marginBottom: "30px"}}>Campeão mais jogado</h2>
              <h2>{this.state.champName}</h2>
              <img id="iconeChamp" alt="icone de campeao" src={this.state.imgCampeao}></img>
              <div id="maestria">
                <img id="iconeMaestria" alt="maestria" src={this.state.imgMaestria}></img>
                <h3>Maestria {this.state.champLevel}</h3>
                <h3 style={{fontWeight:"bold"}}>Pontos {this.state.qtdMaestria}</h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
