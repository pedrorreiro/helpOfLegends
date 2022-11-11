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

export const getChampionDataByName = async (champName) => {
  const version = await getVersion();

  return await axios
    .get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/champion/${champName}.json`
    )
    .then((response) => {
      const champ = response.data.data[champName];

      // spells

      const spells = champ.spells;

      const spellsData = [];

      spells.forEach((spell) => {
        spellsData.push({
          name: spell.name,
          description: removeTags(spell.description),
          image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`,
        });
      });

      const lore = removeTags(champ.lore);
      const blurb = removeTags(champ.blurb);

      champ.spells = spellsData;
      champ.lore = lore;
      champ.blurb = blurb;

      return champ;
    });
}

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
              `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/` +
              itemId +
              ".png",
          };
        }
      }
    });
};

export const getDadosSummoner = async (spellId) => {
  const version = await getVersion();

  return axios
    .get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/pt_BR/summoner.json`
    )
    .then((response) => {
      const spells = response.data.data;

      for (let s in spells) {
        if (String(spells[s].key) === String(spellId)) {
          return {
            name: spells[s].name,
            description: spells[s].description,
            img:
              `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/` +
              spells[s].image.full,
          };
        }
      }
    });
}

export const getMap = async (mapId) => {
  
  return axios
    .get(
      `https://static.developer.riotgames.com/docs/lol/maps.json`
    )
    .then((response) => {
      const maps = response.data;
    
      for (let m in maps) {

        if (String(maps[m].mapId) === String(mapId)) {
          return maps[m].mapName;
        }
      }
    });
}
