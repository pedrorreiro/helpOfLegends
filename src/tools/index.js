import axios from "axios";

export const getCampeoes = async () => {

    return await axios.get('https://ddragon.leagueoflegends.com/cdn/12.2.1/data/en_US/champion.json')
      .then((response) => {

        const champs = response.data.data;

        return champs;

      });

}

export const getDadosCampeao = (champId, champs) => {

    for (let c in champs) {
      
      if (String(champs[c].key) === String(champId)) {
    
        return {
          champName: c,
          imgCampeao: "https://ddragon.leagueoflegends.com/cdn/12.2.1/img/champion/" + c + ".png"
        }

      };
    }

  }