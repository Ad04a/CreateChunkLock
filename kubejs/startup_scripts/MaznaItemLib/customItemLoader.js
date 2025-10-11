// Load and parse all JSONs in the folder
function loadJsonFile(path) {

  let objects = []
 
    let json = JsonIO.read(path)
    if (json) objects.push(json)
  
  return objects
}

//ServerEvents.highPriorityData(event => {
  // Load new items
  let newItems = loadJsonFile("kubejs/data/mazna_item_lib/new_items.json")
  let overrides = loadJsonFile("kubejs/data/mazna_item_lib/overriden_items.json")

  //Item's Type, Tier, Texture( and StackCount )are immutable once the item is in the registry
  //That means that vanilla items are totaly untouchable in that aspect
  //and this 4 attributes can be changed only on items added via the dinamic loader

  // Register new items
  newItems.forEach(data => {
    StartupEvents.registry('item', e => {
        e.create(data.id.split(':')[1]) // after namespace
        //.displayName(data.display_name)
        //.maxDamage(data.durability || 0)
        .texture(data.texture || null)

    
    })
  })

  // Add attributes to both new and overridden items
  ItemEvents.modification(event => {
    newItems.concat(overrides).forEach(data => {
      event.modify(data.id, item => {
        if(data.display_name)   item.setName(data.display_name)
        if(data.rarity)         item.setRarity(data.rarity)
        if(data.lore)           item.appendHoverText(data.lore)
        if(data.durability)     item.setMaxDamage(data.durability)
        if(data.fireproof)      item.setFireResistant(data.fireproof)
        if(data.container_item) item.setCraftingRemainder(data.container_item)
                                
        if(data.stack_size)     item.setMaxStackSize(data.stack_size)
        
        //if(data.food) item.setFoodProperties(food = >);

        if (data.attributes) {
          data.attributes.forEach(attr => {
            item.addAttribute(
              attr.attribute,
              attr.name,
              attr.amount,
              attr.operation,
              attr.slot
            )
          })
        }
      })
    })
  })

  // Register recipes
  ServerEvents.recipes(e => {
    newItems.forEach(data => {
      if (data.recipe) {
        e.custom(data.recipe)
      }
    })
  })
//})