const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pauses the current song"),
	execute: async ({ client, interaction }) => {
		// Fila do server
		const queue = client.player.getQueue(interaction.guildId)

		// Checa se estiver vazia
		if (!queue) {
			await interaction.reply("There are no songs in the queue")
			return;
		}

		// Pausa a música atual
		queue.setPaused(true);

		await interaction.reply("Player has been paused.")
	},
}
