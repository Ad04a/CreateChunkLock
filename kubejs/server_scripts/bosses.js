
ServerEvents.loaded(event => {
  let data = event.server.persistentData;
  if(!data.DifficultyScaling)
  {
    data.DifficultyScaling = 0;
  }

})

ServerEvents.entityLootTables(event => {
  for(let [bossId, dropAmounts] of Object.entries(global.bossIds)) {
    event.addEntity(bossId, table => {
        table.addPool(pool => {
        pool.rolls = 1
        pool.addItem('kubejs:token')
            .count([dropAmounts[0], dropAmounts[1]])
        })
    })
  };
})

EntityEvents.death(event => {
  if (event.entity.type in global.bossIds && event.level.dimension != "bl:blueprint_dimension") {
    let data = event.server.persistentData;
    data.DifficultyScaling = (data.DifficultyScaling || 0) + global.bossIds[event.entity.type][1];
    event.server.tell("creep " + event.level.dimension + "new difficulty: " + data.DifficultyScaling);
  }
});

// Scale zombie HP on spawn
EntityEvents.spawned(event => {
  /*if (event.entity.type == "minecraft:zombie") {
    let data = event.server.persistentData;
    let kills = data.zombieKills || 0;

    // base health = 20, +0.5 per kill
    let newHealth = 20 + (kills * 0.5);
    event.entity.maxHealth = newHealth;
    event.entity.health = newHealth;
  }*/
});