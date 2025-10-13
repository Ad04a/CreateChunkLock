
ItemEvents.rightClicked(event => {
  let { player, item } = event
  const server = player.level.getServer()

  if (!player) return

  if (!(item.id === "kubejs:blueprint")) return

  if(!player.onGround() && player.level.dimension != "bl:blueprint_dimension") {
    player.tell("§cYou must not be in the air when using the blueprint.")
    return;
  }

  const lastDamageTime = parseInt(player.persistentData.getString("bp_last_damage_time"));
  const lastDamageCooldown = 30000; // 30 seconds in milliseconds
  const currentTime = Date.now();

  if ((currentTime - lastDamageTime) < lastDamageCooldown) {
    player.tell(`§cYou cannot use the Blueprint while in combat. Please wait ${parseInt((lastDamageCooldown-(currentTime - lastDamageTime))/1000)} seconds`);
    return;
  }

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
       
  if (player.level.dimension == "bl:blueprint_dimension") {
    player.teleportTo(oldDim, oldPos.x, oldPos.y, oldPos.z,0,0);
    server.runCommandSilent("gamemode survival " + player.name.getString());
    player.health = oldHealth;
    player.foodData.setFoodLevel(oldHunger);
    player.experienceLevel = oldXpLevel;
    player.experienceProgress = oldXpProgress;
  } else {
    player.teleportTo("bl:blueprint_dimension", oldPos.x, oldPos.y, oldPos.z,0,0);
    server.runCommandSilent("gamemode creative " + player.name.getString());
  }

  player.cooldowns.addCooldown(event.item,100);
});

ItemEvents.rightClicked(event => {
  const { player, item } = event

  if (!player)
    return;

  if (player.level.dimension == "bl:blueprint_dimension" && item.id == "minecraft:ender_pearl")
    event.cancel();
});

ServerEvents.recipes(event => {
  event.shapeless(
    'kubejs:blueprint',
    [
      'minecraft:blue_wool',
      'minecraft:paper'
    ]
  ).id('kubejs:blueprint');
});

BlockEvents.rightClicked(event => {
  const { block, player } = event;

  if (player.level.dimension === 'bl:blueprint_dimension') {
    if(block.id === "minecraft:ender_chest" || block.id.endsWith("bed")){
      event.cancel();
    }
  }
});

EntityEvents.hurt(event => {
  const { entity } = event;

  if (!entity.isPlayer()) return;

  const player = entity;
  player.persistentData.putString("bp_last_damage_time", Date.now().toString());
});

ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event
  
  event.register(
    Commands.literal('blgamemode')
    .then(Commands.literal('survival')
      .executes(c => {
        const player = c.source.player;

        if (player.level.dimension !== 'bl:blueprint_dimension') { 
          player.tell("§cYou can only use this command in the Blueprint Dimension");
          return 0;
        }

        player.runCommandSilent(`gamemode survival ${player.name.getString()}`);
        player.tell("§aGamemode set to survival");
        return 1;
      })
    ).then(Commands.literal('creative')
      .executes(c => {
        const player = c.source.player;

        if (player.level.dimension !== 'bl:blueprint_dimension') { 
          player.tell("§cYou can only use this command in the Blueprint Dimension");
          return 0;
        }

        player.runCommandSilent(`gamemode creative ${player.name.getString()}`);
        player.tell("§aGamemode set to creative");
        return 1;
      })
    )
  )
});

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal('bltp')
      .then(Commands.argument('pos', Arguments.BLOCK_POS.create(event))
      .executes(c => {
        const player = c.source.player;
        if (!player) return 0;

        if(player.level.dimension !== 'bl:blueprint_dimension') {
          player.tell("§cYou can only use this command in the Blueprint Dimension");
          return 0;
        }

        const pos = Arguments.BLOCK_POS.getResult(c, 'pos');

        player.runCommandSilent(`tp ${player.name.getString()} ${pos.x} ${pos.y} ${pos.z}`);
        player.tell(`§aTeleported to X:${pos.x} Y:${pos.y} Z:${pos.z}`);
        return 1;
      }
  )));
});

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal("blfill")
      .then(Commands.argument("from", Arguments.BLOCK_POS.create(event))
      .then(Commands.argument("to", Arguments.BLOCK_POS.create(event))
      .then(Commands.argument("block", Arguments.BLOCK_STATE.create(event))
      .executes(c => {
        const player = c.source.player;

        if (player.level.dimension !== "bl:blueprint_dimension") {
          player.tell("§cYou can only use this command in the Blueprint Dimension!");
          return 0;
        }

        const from = Arguments.BLOCK_POS.getResult(c, "from");
        const to = Arguments.BLOCK_POS.getResult(c, "to");
        const blockState = Arguments.BLOCK_STATE.getResult(c, "block");

        const prefix = "Block{";
        const blockId = blockState.getState().getBlock().toString().slice(prefix.length, -1);
        const fillCmd = `execute in bl:blueprint_dimension run fill ${from.x} ${from.y} ${from.z} ${to.x} ${to.y} ${to.z} ${blockId}`;

        c.source.server.runCommandSilent(fillCmd);
        return 1;
      }
    ))))
  );
});

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal('blkill')
      .then(Commands.argument('radius', Arguments.INTEGER.create(event))
      .executes( c=>{
        const player = c.source.player;

        if (player.level.dimension !== 'bl:blueprint_dimension') { 
          player.tell("§cYou can only use this command in the Blueprint Dimension");
          return 0;
        }

        const radius = Arguments.INTEGER.getResult(c, 'radius');

        if(radius<1||radius>30) {
          player.tell("§cRadius must be within [1-30] blocks");
          return 0;
        }

        c.source.server.runCommandSilent(`execute at ${player.name.getString()} run kill @e[type=!player,distance=..${radius}]`)
        return 1;
      }))
  );
});

ServerEvents.commandRegistry(event => {
  const { commands: Commands } = event;

  const giveableItems = [
    "minecraft:barrier",
    "minecraft:structure_block",
    "minecraft:structure_void",
    "minecraft:debug_stick",
    "minecraft:jigsaw"
  ];

  function createGiveCommand(itemId) {
    const itemName = itemId.split(":")[1];
    return Commands.literal(itemName)
      .executes(c => {
        const player = c.source.player;

        if (player.level.dimension !== 'bl:blueprint_dimension') {
          player.tell("§cYou can only use this command in the Blueprint Dimension");
          return 0;
        }

        player.server.runCommandSilent(`give ${player.name.getString()} ${itemId}`);
        player.tell(`§aGave you 1x ${itemId}`);
        return 1;
      });
  }

  let root = Commands.literal("blgive");
  for (const item of giveableItems) {
    root = root.then(createGiveCommand(item));
  }

  event.register(root);
});


ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal("tpa")
      .then(Commands.argument("receiver", Arguments.PLAYER.create(event))
      .executes(c => {
        const sender = c.source.player;
        const receiver = Arguments.PLAYER.getResult(c, "receiver");

        if(sender.level.dimension != "bl:blueprint_dimension" || receiver.level.dimension != "bl:blueprint_dimension") {
          sender.tell("§cYou send /tpa when you or your target is in the blueprint dimension!");
          return 0;
        }

        if (sender.name.toString() === receiver.name.toString()) {
            sender.tell("§cYou cannot send a TPA request to yourself!");
            return 0;
        }

        const lastTpaTime = parseInt(sender.persistentData.getString("bl_last_tpa_call_time"));
        const tpaCooldown = 30000; // 30 seconds in milliseconds
        const currentTime = Date.now();

        if ((currentTime - lastTpaTime) < tpaCooldown) {
          sender.tell(`§cYou cannot use /tpa. Please wait ${parseInt((tpaCooldown-(currentTime - lastTpaTime))/1000)} seconds`);
          return 0;
        }

        receiver.persistentData.putString("bl_last_tpa_requester",sender.name.getString())
        sender.persistentData.putString("bl_last_tpa_call_time",Date.now().toString())

        sender.tell(`§aTeleport request sent to ${receiver.name.getString()}`);
        receiver.tell(`§e${sender.name.getString()} has requested to teleport to you. Type /tpaaccept to accept.`);

        return 1;
      }))
  );

  event.register(
    Commands.literal("tpaccept")
      .executes(c=>{
        const acceptor = c.source.player;
        const server = acceptor.server;

        if (acceptor.persistentData.getString("bl_last_tpa_requester")=="") {
          acceptor.tell("§cNo pending tpa requests");
          return 0;
        }

        const requestor = server.playerList.getPlayerByName(acceptor.persistentData.getString("bl_last_tpa_requester"));

        if(acceptor.level.dimension != "bl:blueprint_dimension" || requestor.level.dimension != "bl:blueprint_dimension") {
          sender.tell("§cYou send /tpa when you or your target is in the blueprint dimension!");
          return 0;
        }

        server.runCommandSilent(`tp ${requestor.name.getString()} ${acceptor.name.getString()}`)
        acceptor.tell(`Teleporting ${requestor.name.getString()} to you`)
        requestor.tell(`Teleporting you to ${requestor.name.getString()}`)
        acceptor.persistentData.putString("bl_last_tpa_requester","")

        return 1;
      })
  );

  event.register(
    Commands.literal("tpadeny")
      .executes(c => {
        const denier = c.source.player;
        const server = denier.server;

        if (denier.persistentData.getString("bl_last_tpa_requester")=="") {
          denier.tell("§cNo pending tpa requests");
          return 0;
        }

        const deniee = server.playerList.getPlayerByName(denier.persistentData.getString("bl_last_tpa_requester"));
        denier.tell(`Denied /tpa to ${deniee.name.getString()}`);
        deniee.tell(`${denier.name.getString()} denied your /tpa request`);

        denier.persistentData.putString("bl_last_tpa_requester","")
        return 1;
      })
  );
});