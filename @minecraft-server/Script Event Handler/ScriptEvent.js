import { system, world, ScriptEventSource } from "@minecraft/server";

/**
 * ScriptEvent handler for: prefix:say
 */
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "prefix:say") return;

    const message = event.message?.trim();
    if (!message) return;

    let originInfo = "Unknown source";

    switch (event.sourceType) {

        case ScriptEventSource.Entity:
            if (event.sourceEntity) {
                originInfo = `Entity: ${event.sourceEntity.typeId}`;
            }
            break;

        case ScriptEventSource.Block:
            if (event.sourceBlock) {
                const loc = event.sourceBlock.location;
                originInfo = `Block: ${event.sourceBlock.typeId} @ ${loc.x} ${loc.y} ${loc.z}`;
            }
            break;

        case ScriptEventSource.NPCDialogue:
            if (event.initiator) {
                originInfo = `NPC Initiator: ${event.initiator.typeId}`;
            }
            break;

        default:
            originInfo = "Unknown source type";
            break;
    }

    world.sendMessage(`[ScriptEvent] ${message}`);
    world.sendMessage(`[Source] ${originInfo}`);

    if (event.sourceEntity) {
        event.sourceEntity.sendMessage("ScriptEvent processed successfully.");
    }
});
