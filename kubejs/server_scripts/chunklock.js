ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event;

  event.register(
    Commands.literal('clearDisplayEntities')
      .executes( c=>{
        const player = c.source.player;
        const server = player.server;

        server.runCommandSilent(`execute as ${player.name.getString()} at @s run kill @e[type=minecraft:item_display,distance=..3]`);
        server.runCommandSilent(`execute as ${player.name.getString()} at @s run kill @e[type=minecraft:text_display,distance=..3]`);

        return 1;
      })
  );
});