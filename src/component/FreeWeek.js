import axios from "axios";
import { useState, useEffect } from "react";
import { getCampeoes, getDadosCampeao } from "../tools";

export default function FreeWeek(props) {

    const api_key = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const getFreeWeek = () => {
            axios.get('https://br1.api.riotgames.com/lol/platform/v3/champion-rotations', {
              params: {
                'api_key': api_key
              }
            }).then((response) => {
      
              try {
      
                var freeWeek = [];
      
                getCampeoes().then(async (allChamps) => {
                  const ids = response.data['freeChampionIds'];
                  const size = ids.length;
      
                  for (let i = 0; i < size; i++) {
      
                    let dadosChamp = await getDadosCampeao(ids[i].toString(), allChamps);
      
                    let name = dadosChamp.champName;
      
                    freeWeek.push({
                      id: ids[i],
                      name: name
                    })
      
                  }
      
                  setFreeWeek(freeWeek);
      
                });
      
              } catch (e) {
                console.log("erro ao ler freeweek")
      
              }
      
            });
        }

        getFreeWeek();
    }, [api_key]);

    

    const [freeWeek, setFreeWeek] = useState([]);
    const [freeWeekVisible, setFreeWeekVisible] = useState("normal");

    return (
        <div id="freeWeek">

            <details open>

              <summary>
                <span style={
                  {
                    fontSize: "16px",
                    fontWeight: "bold"

                  }}>Rotação Grátis da Semana</span>
              </summary>

              <div id="champs" className={freeWeekVisible}>

                {(freeWeek).map((champ, i) => {
                  let img = "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/champion/" + champ.name + ".png"

                  return (
                    <div className="champ" key={champ.name}>

                      <img
                        className="champFreeWeek"
                        alt="campeao freeweek"
                        src={img}
                        title={champ.name} />

                      <br />

                      <span
                        style={{
                          fontSize: "12px",
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
    );
}