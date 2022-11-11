import axios from "axios";
import './Freeweek.css';
import { useState, useEffect } from "react";
import { getCampeoes, getDadosCampeao, getChampionDataByName } from "../tools";
import { Tooltip } from "antd";

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

              let dadosCompletos = await getChampionDataByName(name);

              freeWeek.push({
                id: ids[i],
                name: name,
                lore: dadosCompletos.lore,
                blurb: dadosCompletos.blurb,
                spells: dadosCompletos.spells,

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

                <Tooltip title={
                  <div className="champion-details">
                    <h3><strong>{champ.name}</strong></h3>
                    <p>{champ.blurb}</p>
                    <h3>Habilidades</h3>
                    <div className="spells">
                      {champ.spells.map((spell, i) => {
                        return (
                          <div className="spell" key={spell.name}>
                            <Tooltip title={
                              <div className="spell-details">
                                <h3><strong>{spell.name}</strong></h3>
                                <p>{spell.description}</p>
                              </div>
                            } placement="bottom">
                                <img src={spell.image} alt={spell.name} />

                            </Tooltip>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                }>
                  <img
                    className="champFreeWeek"
                    alt="campeao freeweek"
                    src={img}
                    title={champ.name} />
                </Tooltip>
                {/* <img
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
                >{champ.name}</span> */}
              </div>
            )
          })}

        </div>

      </details>

    </div>
  );
}