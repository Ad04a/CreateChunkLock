ItemEvents.rightClicked(event => {
  let { player, item } = event
  const server = player.level.getServer()

  if (!player) return

  if (item.id == "kubejs:blueprint") {

    player.cooldowns.addCooldown("kubejs:blueprint", 200);

    const currentPosition = player.position();
    const oldPos = {
      x: player.persistentData.getDouble("bp_previous_dimension_coords_x"),
      y: player.persistentData.getDouble("bp_previous_dimension_coords_y"),
      z: player.persistentData.getDouble("bp_previous_dimension_coords_z")
    };
    const oldDim = player.persistentData.getString("bp_previous_dimension");
    const oldHealth = player.persistentData.getDouble("bp_previous_health");
    const oldHunger = player.persistentData.getDouble("bp_previous_hunger");
    const oldXpLevel = player.persistentData.getInt("bp_previous_xp_level");
    const oldXpProgress = player.persistentData.getFloat("bp_previous_xp_progress");

    player.persistentData.putDouble("bp_previous_health", player.health);
    player.persistentData.putDouble("bp_previous_hunger", player.foodData.getFoodLevel());
    player.persistentData.putInt("bp_previous_xp_level", player.experienceLevel);
    player.persistentData.putFloat("bp_previous_xp_progress", player.experienceProgress);

    player.persistentData.putDouble("bp_previous_dimension_coords_x", currentPosition.x());
    player.persistentData.putDouble("bp_previous_dimension_coords_y", currentPosition.y());
    player.persistentData.putDouble("bp_previous_dimension_coords_z", currentPosition.z());
    player.persistentData.putString("bp_previous_dimension", player.level.dimension)

    server.runCommandSilent("effect clear " + player.name.getString());
       
    
    if (player.level.dimension == "bl:blueprint_dimension") 
    {
        player.teleportTo(oldDim, oldPos.x, oldPos.y, oldPos.z,0,0);
        server.runCommandSilent("gamemode survival " + player.name.getString());
        player.health = oldHealth;
        player.foodData.setFoodLevel(oldHunger);
        player.experienceLevel = oldXpLevel;
        player.experienceProgress = oldXpProgress;
    }
    else
    {
        player.teleportTo("bl:blueprint_dimension", oldPos.x, oldPos.y, oldPos.z,0,0);
        server.runCommandSilent("gamemode creative " + player.name.getString());
    }
}
})

ServerEvents.recipes(event => {
  event.shaped(
    'kubejs:blueprint', // output
    [
      'AAA',
      'ABA',
      'AAA'
    ],
    {
      A: 'minecraft:blue_wool',
      B: 'minecraft:paper'
    }
  );
});

ServerEvents.loaded(event => {
  const server = event.server;
  server.tell('Blueprint Dimension script loaded!');
  const world = server.getLevel('bl:blueprint_dimension'); // your dimension id

    // server.tell(world.toString()+'Blueprint Dimension loaded!');

  if (world) {
        world.runCommandSilent('tellraw @a {"text":"Welcome to the Blueprint Dimension!","color":"aqua","bold":true}');
    // Stop weather cycle
    world.runCommandSilent('gamerule doWeatherCycle false');
    // Stop day/night cycle
    world.runCommandSilent('gamerule doDaylightCycle false');
    // Optional: set fixed time
    world.runCommandSilent('time set noon');
  }
  else
  {
    server.tell('Error: Blueprint Dimension not found!');
  }
});

BlockEvents.rightClicked(event => {
  const { block, player, level } = event;

  // Check if it's an ender chest
  if (block.id !== 'minecraft:ender_chest') return;

  // Check if player is in blueprint dimension
  if (level.dimension === 'bl:blueprint_dimension') {
    event.cancel(); // cancel the interaction
    player.tell("Ender chests are disabled in this dimension!");
  }
});