const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { NewMessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),

    execute: async ({ client, interaction }) => {

        const queue = client.player.getQueue(interaction.guildId)

        // Se não tiver nada na fila
        if (!queue) {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        const currentSong = queue.current

        // Skip, simples
        queue.skip()

        // Retorna um aviso que a música foi skippada
        await interaction.reply({
            embeds: [
                new NewMessageEmbed()
                    .setDescription(`${currentSong.title} has been skipped!`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    },
}
