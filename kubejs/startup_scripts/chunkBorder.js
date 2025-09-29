StartupEvents.registry('block', event => {
    event.create('chunk_border').material('glass').hardness(1.5).displayName('Chunk Border')
    .tag("minecraft:glass");
})