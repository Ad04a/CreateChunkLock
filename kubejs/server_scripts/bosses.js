
ServerEvents.loaded(event => {
  /*let data = event.server.persistentData;
  if(!data.DifficultyScaling)
  {
    data.DifficultyScaling = 0;
  }*/

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
  
  //event.server.tell("Level: " + event.entity.entityData.);
  /*if (event.entity.type in global.bossIds && event.level.dimension != "bl:blueprint_dimension") {
    let data = event.server.persistentData;
    data.DifficultyScaling = (data.DifficultyScaling || 0) + Math.floor((global.bossIds[event.entity.type][0] + global.bossIds[event.entity.type][1])/2);
  }*/
});

EntityEvents.spawned(event => {
    //event.server.tell("Spawned Level: " + event.entity.persistentData);

  /*if (event.entity.type in global.bossIds) {
    let DifficultyScaling = event.server.persistentData.DifficultyScaling || 0;

    let newHealth = Math.floor(event.entity.maxHealth * (1 + DifficultyScaling*0.02));
    event.entity.maxHealth = newHealth;
    event.entity.health = newHealth;
  }*/
});