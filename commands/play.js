const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { NewMessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song from YouTube.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song and plays it")
                .addStringOption(option =>
                    option.setName("searchterms").setDescription("search keywords").setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Plays a playlist from YT")
                .addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription("Plays a single song from YT")
                .addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
        ),
    execute: async ({ client, interaction }) => {
        // Aviso caso o usuário não esteja em um voice channel
        if (!interaction.member.voice.channel) return interaction.reply("You need to be in a Voice Channel to play a song.");

        // Criar uma fila para o server
        const queue = await client.player.createQueue(interaction.guild);

        // Aguardar sua conexão no voice channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new NewMessageEmbed()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")

            // Busca da música
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // End se não encontrar a música
            if (result.tracks.length === 0)
                return interaction.reply("No results")

            // Adicionar a track na fila
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })

        }
        else if (interaction.options.getSubcommand() === "playlist") {

            // Procurar playlist
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.reply(`No playlists found with ${url}`)

            // Adicionar as tracks a fila -2
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)

        }
        else if (interaction.options.getSubcommand() === "search") {

            // Procurar a musica pelo URl
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // End se não encontrar a música
            if (result.tracks.length === 0)
                return interaction.editReply("No results")

            // Adiciona a fila
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }

        // Dar play no som
        if (!queue.playing) await queue.play()

        await interaction.reply({
            embeds: [embed]
        })
    },
}
