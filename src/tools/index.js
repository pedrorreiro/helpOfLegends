import axios from "axios";
import { removeTags } from "../utils";

const getVersion = async () => {
  const response = await axios.get(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  return response.data[0];
};

export const getCampeoes = async () => {
  const version = await getVersion();

  return await axios
    .get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion.json`
    )
    .then((response) => {
      const champs = response.data.data;

      return champs;
    });
};

export const getDadosCampeao = async (champId, champs) => {
  const version = await getVersion();

  for (let c in champs) {
    if (String(champs[c].key) === String(champId)) {
      return {
        champName: c,
        imgCampeao:
          `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/` +
          c +
          ".png",
      };
    }
  }
};

export const getDadosItem = async (itemId) => {
  const version = await getVersion();

  return axios
    .get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/item.json`)
    .then((response) => {
      const items = response.data.data;
 
      for (let i in items) {

        if(itemId === 0){
          return {
            name: "",
            img: "",
          };
        }

        if (String(i) === String(itemId)) {
          
          return {
            name: items[i].name,
            plaintext: items[i].plaintext,
            description: removeTags(items[i].description),
            price: items[i].gold.total,
            img:
              `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/` +
              itemId +
              ".png",
          };
        }
      }
    });
};
