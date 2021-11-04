import React from "react";
import "./App.css";
import axios from "axios";

export default class App extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      msgErro: "msg de erro",
      msgErroStatus: "block",
      invocador: "Eu cuido do caso",
      invocadorId: "",
      level: "0",
      imgInvocador: "http://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/0.png",
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

    axios.get('http://ddragon.leagueoflegends.com/cdn/11.22.1/data/en_US/champion.json')
    .then((response) => {

      const champs = response.data.data;

      for(let c in champs){

        if(String(champs[c].key) === this.state.champId){
          this.setState({
            champName: c,
            imgCampeao: "http://ddragon.leagueoflegends.com/cdn/11.22.1/img/champion/" + c + ".png"
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
          'api_key': 'RGAPI-e067f75c-3ae1-4c19-9c87-62c3c824937b'
        },
        headers: {

      }
      }).then((response) => {

        if(response.status === 200){console.log("deu bao")}
        else console.log("n deu");

        if (response.status.status_code === 404) console.log("n achou o role");

        this.setState({

          level: response.data.summonerLevel,

          imgInvocador: "http://ddragon.leagueoflegends.com/cdn/11.22.1/img/profileicon/" +
            response.data.profileIconId + ".png",

          invocadorId: response.data.id

        });

        this.getMaestrias();

      });
    } catch (e) {console.log("das")}
  }

  getMaestrias = () => {
    axios.get('https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' 
    + this.state.invocadorId,{
      params:{
        'api_key':'RGAPI-e067f75c-3ae1-4c19-9c87-62c3c824937b'
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
          msgErro: "O jogador não possui maestrias"
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
            <h3>Nível de invocador: {this.state.level}</h3>
          </div>

          <span style={{fontSize: 15+"px", fontWeight: "bold"}}>Nome de invocador</span><br/><br/>
          <input value={this.state.invocador} onChange={(event) => this.handleChange(event)}></input>
          <button onClick={() => this.getDados(this.state.invocador)}>Pesquisar</button>

          <div id="msgErro" style={{display: this.state.msgErroStatus}}>
            <p>{this.state.msgErro}</p>
          </div>

          <hr/>

          <div id="divMaestria" style={{display:this.state.estadoDados}}>
            <h2>Campeão mais jogado</h2>
            <h3>{this.state.champName}</h3>
            <img id="iconeChamp" alt="icone de campeao" src={this.state.imgCampeao} width="100px"></img>
            <div id="maestria">
              <img id="iconeMaestria" alt="maestria" src={this.state.imgMaestria} width="100px"></img>
              <h3>Maestria {this.state.champLevel}</h3>
              <h3>Pontos {this.state.qtdMaestria}</h3>
            </div>

          </div>

        </div>
      </div>
    );
  }
}
