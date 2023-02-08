const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        // Checa se a fila estiver vazia
        if (!queue) {
            await interaction.reply("No songs in the queue");
            return;
        }

        // Retira a pausa :)
        queue.setPaused(false);

        await interaction.reply("Player has been resumed.")
    },
}
