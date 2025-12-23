import { system, world, ScriptEventSource } from "@minecraft/server";

/**
 * Apply lore to the item held by the player
 */
function setItemLore(player, loreArray) {
    if (!Array.isArray(loreArray)) return false;

    const inventory = player.getComponent("minecraft:inventory");
    if (!inventory) return false;

    const container = inventory.container;
    const slot = player.selectedSlot;
    const item = container.getItem(slot);

    if (!item) return false;

    item.setLore(loreArray.map(line => String(line)));
    container.setItem(slot, item);

    return true;
}

/**
 * ScriptEvent handler for: prefix:setLore
 */
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "prefix:setLore") return;

    if (event.sourceType !== ScriptEventSource.Entity) return;
    const player = event.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;

    let payload;
    try {
        payload = JSON.parse(event.message);
    } catch {
        player.sendMessage("Invalid JSON payload.");
        return;
    }

    const success = setItemLore(player, payload.lore);

    if (success) {
        player.sendMessage("Item lore updated successfully.");
    } else {
        player.sendMessage("Failed to set item lore.");
    }
});
