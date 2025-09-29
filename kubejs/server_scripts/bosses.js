const bossIds = [
  "galosphere:berserker",
  "minecraft:creeper",
  "minecraft:warden",
  "minecraft:wither"
]

ServerEvents.entityLootTables(event => {
  for(let bossId of bossIds) {
    event.addEntity(bossId, table => {
        table.addPool(pool => {
        pool.rolls = 1
        pool.addItem('kubejs:token')
        })
    })
  };
})