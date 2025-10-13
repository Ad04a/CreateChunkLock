const MapItem = Java.loadClass("net.minecraft.world.item.MapItem")
const MapDecoration = Java.loadClass("net.minecraft.world.level.saveddata.maps.MapDecoration")
const MapDecoration$Type = Java.loadClass("net.minecraft.world.level.saveddata.maps.MapDecoration$Type")

ServerEvents.recipes(event=>{
  event.shaped(Item.of("minecraft:map",8),
    [
      'AAA',
      'ABA',
      'AAA'
    ],
    {
      A: 'minecraft:paper',
      B: 'minecraft:ink_sac'
    }
  );
})

const StructureData = {
  ANCIENT_STRONGHOLD: {
    bmId:"boss_maps:ancient_stronghold",
    iconBanner: MapDecoration$Type.BANNER_ORANGE,
    scrollItemId:"kubejs:ancient_stronghold_scroll",
  },
  MOSSY_TEMPLE: {
    bmId:"boss_maps:mossy_temple",
    iconBanner: MapDecoration$Type.BANNER_MAGENTA,
    scrollItemId:"kubejs:mossy_temple_scroll",
  },
  CLOUDY_TEMPLE: {
    bmId:"boss_maps:cloudy_temple",
    iconBanner: MapDecoration$Type.BANNER_LIGHT_BLUE,
    scrollItemId:"kubejs:cloudy_temple_scroll",
  },
  RUINED_PYRAMID: {
    bmId:"boss_maps:ruined_pyramid",
    iconBanner: MapDecoration$Type.BANNER_YELLOW,
    scrollItemId:"kubejs:ruined_pyramid_scroll",
  },
  FROSTBITTEN_TEMPLE: {
    bmId:"boss_maps:frostbitten_temple",
    iconBanner: MapDecoration$Type.BANNER_LIME,
    scrollItemId:"kubejs:frostbitten_temple_scroll",
  },
  ABANDONED_CRYPT: {
    bmId:"boss_maps:abandoned_crypt",
    iconBanner: MapDecoration$Type.BANNER_PINK,
    scrollItemId:"kubejs:abandoned_crypt_scroll",
  },
  PINK_SALT_STRUCTURES: {
    bmId:"boss_maps:pink_salt_structures",
    iconBanner: MapDecoration$Type.BANNER_GRAY,
    scrollItemId:"kubejs:pink_salt_structures_scroll",
  },
  WROUGHT_CHAMBER: {
    bmId:"boss_maps:wrought_chamber",
    iconBanner: MapDecoration$Type.BANNER_LIGHT_GRAY,
    scrollItemId:"kubejs:wrought_chamber_scroll",
  },
  FROSTMAW_SPAWN: {
    bmId:"boss_maps:frostmaw_spawn",
    iconBanner: MapDecoration$Type.BANNER_CYAN,
    scrollItemId:"kubejs:frostmaw_spawn_scroll",
  },
  UMVUTHANA_GROVE: {
    bmId:"boss_maps:umvuthana_grove",
    iconBanner: MapDecoration$Type.BANNER_PURPLE,
    scrollItemId:"kubejs:umvuthana_grove_scroll",
  },
  MONASTERY: {
    bmId:"boss_maps:monastery",
    iconBanner: MapDecoration$Type.BANNER_BLUE,
    scrollItemId:"kubejs:monastery_scroll",
  },
  YETI_HIDEOUT: {
    bmId:"boss_maps:yeti_hideout",
    iconBanner: MapDecoration$Type.BANNER_BROWN,
    scrollItemId:"kubejs:yeti_hideout_scroll",
  },
  SANDWORM_NEST: {
    bmId:"boss_maps:sandworm_nest",
    iconBanner: MapDecoration$Type.BANNER_GREEN,
    scrollItemId:"kubejs:sandworm_nest_scroll",
  },
  DRAGON_TOWER: {
    bmId:"boss_maps:dragon_tower",
    iconBanner: MapDecoration$Type.BANNER_RED,
    scrollItemId:"kubejs:dragon_tower_scroll",
  },
  RANDOM_BOSS_STRUCTURE: {
    bmId:"boss_maps:random_boss_structure",
    iconBanner: MapDecoration$Type.MANSION,
    scrollItemId:"kubejs:random_boss_structure_scroll"
  }
}

function getBossMapData(player, mapItem)
{
  const mapId = mapItem.nbt?.map;
  if (!mapId) return;

  const mapData = player.level.getMapData(`map_${mapId}`);
  if (!mapData) return;

  const calculatedLevel = Math.round(Math.sqrt(Math.pow(mapData.centerX,2)+Math.pow(mapData.centerZ,2))/100);
  const decorationX = (parseFloat(mapItem.nbt.get("Decorations")[0].get("x")) - mapData.centerX) * 2;
  const decorationZ = (parseFloat(mapItem.nbt.get("Decorations")[0].get("z")) - mapData.centerZ) * 2;
  const decorationType = parseInt(mapItem.nbt.get("Decorations")[0].get("type"));

  return {
    mapCenterX: mapData.centerX,
    mapCenterZ: mapData.centerZ,
    decorationX: decorationX,
    decorationZ: decorationZ,
    decorationType: MapDecoration$Type.byIcon(decorationType),
    decorationLabel: `~ Lvl ${calculatedLevel}`
  }
}

function generateBossMap(player, server, scrollItem, bossStructure) {
  if(player.level.dimension != "minecraft:overworld") {
    player.tell("§cScrolls are only revealable in the overworld!");
    return;
  }

  server.runCommandSilent(`loot spawn ${player.x} 500 ${player.z} loot ${bossStructure.bmId}`);

  const mapItemEntity = player.level.getEntitiesWithin(AABB.of(
    player.x-16,450,player.z-16,
    player.x+16,550,player.z+16)
  )
  .filter(e=>
    e.type=="minecraft:item" && 
    e.item.nbt.get("bmInit").asString=="0b"
  )[0];

  const LootGeneratedMapData = getBossMapData(player, mapItemEntity.item);
  mapItemEntity.kill();

  const iconRotation = 8;
  const resultMap = MapItem.create(player.level,LootGeneratedMapData.mapCenterX,LootGeneratedMapData.mapCenterZ,0,true,true);
  MapItem.renderBiomePreviewMap(player.server.getLevel("minecraft:overworld"),resultMap);

  const decoration = new MapDecoration(
    LootGeneratedMapData.decorationType,
    LootGeneratedMapData.decorationX,
    LootGeneratedMapData.decorationZ,
    iconRotation,
    LootGeneratedMapData.decorationLabel
  );

  const resultMapData = player.level.getMapData(`map_${resultMap.nbt?.map}`);
  resultMapData.addClientSideDecorations([decoration]);
    
  player.give(resultMap);
  scrollItem.shrink(1);

  addGlobalCooldownForScrolls(server);
}

function addGlobalCooldownForScrolls(server) {
  server.players.forEach(serverPlayer=>{
    Object.values(StructureData).forEach(data => {
      serverPlayer.addItemCooldown(data.scrollItemId, 1200);
    });
  });
}

function registerScrollEvents() {
  Object.values(StructureData).forEach(data => {
    ItemEvents.rightClicked(data.scrollItemId,event=>{
      const {player, server, item} = event;
      generateBossMap(player,server,item, data);
    });
  });
}

registerScrollEvents();

BlockEvents.rightClicked(e => {
  if(e.block.id.includes("banner") && e.block.id != "minecraft:white_banner") {
    e.cancel()
  }
})

MoreJSEvents.villagerTrades(event => {
  const emeraldItem = new TradeItem("minecraft:emerald",32);
  const compassItem = new TradeItem("minecraft:compass",1);

  Object.values(StructureData).forEach(data => {
    event.addTrade("minecraft:cartographer", 2,[emeraldItem,compassItem],data.scrollItemId);
    event.addTrade("minecraft:cartographer", 4,[emeraldItem,compassItem],data.scrollItemId);
  });
});