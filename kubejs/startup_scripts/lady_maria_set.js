

ItemEvents.modification(event => {
  // Replace with actual armor item IDs
    event.modify('fantasy_armor:lady_maria_helmet', item => {
        item.armorProtection = 3.0      // example protection value
        item.armorToughness = 2.0       // example toughness
        //item.maxDamage = 750       // example durability
        // any additional attribute modifiers?
    })

    event.modify('fantasy_armor:lady_maria_chestplate', item => {
        item.armorProtection = 3.0      // example protection value
        item.armorToughness = 2.0       // example toughness
        //item.maxDamage = 750       // example durability
        // any additional attribute modifiers?
    })

    event.modify('fantasy_armor:lady_maria_leggings', item => {
        item.armorProtection = 3.0      // example protection value
        item.armorToughness = 2.0       // example toughness
        //item.maxDamage = 750       // example durability
        // any additional attribute modifiers?
    })

    event.modify('fantasy_armor:lady_maria_boots', item => {
        item.armorProtection = 3.0      // example protection value
        item.armorToughness = 2.0       // example toughness
        //item.maxDamage = 750       // example durability
        // any additional attribute modifiers? MAAAAAAAAAAAN FUCK FANTASY ARMOR
    })

    event.modify('minecraft:iron_boots', item => {
        item.armorProtection = 7.0      // example protection value
        item.armorToughness = 7.0       // example toughness
        //item.maxDamage = 750       // example durability
        // any additional attribute modifiers?
    })
})