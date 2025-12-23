import { world } from "@minecraft/server";

/**
 * Lore damage schema.
 * {damage} will be parsed as a number.
 *
 * Example lore line:
 * §r§9+12 damage per hit
 */
const damageLineSchema = "§r§9+{damage} damage per hit";

/**
 * Extract damage value from a lore line using the schema
 */
function extractDamageFromLore(loreLine) {
    const regexPattern = damageLineSchema
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace("\\{damage\\}", "(\\d+(?:\\.\\d+)?)");

    const regex = new RegExp(`^${regexPattern}$`);
    const match = loreLine.match(regex);

    if (!match) return null;
    return Number(match[1]);
}

/**
 * Get custom damage from the item held by the player
 */
function getWeaponDamageFromLore(player) {
    const inventory = player.getComponent("minecraft:inventory");
    if (!inventory) return null;

    const container = inventory.container;
    const item = container.getItem(player.selectedSlot);
    if (!item) return null;

    const lore = item.getLore();
    if (!lore || lore.length === 0) return null;

    for (const line of lore) {
        const damage = extractDamageFromLore(line);
        if (damage !== null) {
            return damage;
        }
    }

    return null;
}

/**
 * Entity hit handler
 */
world.afterEvents.entityHitEntity.subscribe((event) => {
    const attacker = event.damagingEntity;
    const target = event.hitEntity;

    if (!attacker || attacker.typeId !== "minecraft:player") return;
    if (!target || !target.isValid()) return;

    const loreDamage = getWeaponDamageFromLore(attacker);
    if (loreDamage === null) return;

    const appliedDamage = event.damage;
    if (typeof appliedDamage !== "number") return;

    const extraDamage = loreDamage - appliedDamage;
    if (extraDamage <= 0) return;

    target.applyDamage(extraDamage, {
        cause: "entityAttack",
        damagingEntity: attacker
    });
});
