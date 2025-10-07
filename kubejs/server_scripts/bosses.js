

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