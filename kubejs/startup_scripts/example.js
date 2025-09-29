// priority: 0

// Visit the wiki for more info - https://kubejs.com/

console.info('Hello, World! (Loaded startup scripts)')

StartupEvents.registry('item', event => {
    event.create('token').displayName('Chunk unlock token')
})

StartupEvents.registry('block', event => {
    event.create('chunk_border').material('glass').hardness(1.5).displayName('Chunk Border')
    .tag("minecraft:glass");
})