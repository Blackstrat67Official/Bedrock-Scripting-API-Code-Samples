/**
 * Pseudo JSON file
 *
 * This file replaces a traditional .json file.
 * It contains static data that can be imported
 * by other scripts at runtime.
 */

export const GameConfig = {
    server: {
        name: "ExampleServer",
        environment: "production",
        debug: false
    },

    economy: {
        startingMoney: 100,
        maxBalance: 50000
    },

    permissions: {
        admin: ["*"],
        moderator: ["kick", "mute", "warn"],
        player: ["chat", "trade"]
    },

    items: [
        {
            id: "diamond_sword",
            price: 1500,
            stackable: false
        },
        {
            id: "gold_ingot",
            price: 50,
            stackable: true
        }
    ]
};
