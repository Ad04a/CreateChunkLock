

ServerEvents.entityLootTables(event => {
  for(let [bossId, dropAmounts] of Object.entries(global.bossIds)) {
    event.modifyEntity(bossId, table => {
        table.addPool(pool => {
        pool.rolls = 1
        pool.addItem('kubejs:token')
            .count([dropAmounts[1], dropAmounts[1]])
        })
    })
  };
})