// priority: 0

// Visit the wiki for more info - https://kubejs.com/

console.info('Hello, World! (Loaded server scripts)')

const bossIds = [
  "galosphere:berserker",
  "minecraft:creeper",
  "minecraft:warden",
  "minecraft:wither"
]

ServerEvents.entityLootTables(event => {
  // Replace the ENTIRE loot table of the boss

  for(let bossId of bossIds) {
    event.addEntity(bossId, table => {
        table.addPool(pool => {
        pool.rolls = 1
        pool.addItem('kubejs:token')
        })
    })
  };
})

EntityEvents.spawned(event => {
    event.entity.runCommand("say a")
    bossIds.forEach(bossId => {
        if (event.entity.type === bossId) 
        {
            event.entity.runCommandSilent(`
      execute as @s at @s run function chunklock:chunk_items/unlock_nearest_chunks`)
                event.entity.runCommand("say mazna")
        }
    })
})