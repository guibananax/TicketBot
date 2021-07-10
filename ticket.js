module.exports = {
    name: "Ticket",
    aliases: [],
    permissions: [],
    description: "Abra um ticket!",
    async execute(message, args, cmd, client, discord) {
      const channel = await message.guild.channels.create(`ticket: ${message.author.tag}`);
      
      channel.setParent("861300979251806209");
  
      channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGE: false,
        VIEW_CHANNEL: false,
      });
      channel.updateOverwrite(message.author, {
        SEND_MESSAGE: true,
        VIEW_CHANNEL: true,
      });
  
      const reactionMessage = await channel.send("Obrigado!");
  
      try {
        await reactionMessage.react("🔒");
        await reactionMessage.react("⛔");
      } catch (err) {
        channel.send("Ocorreu um erro! :(");
        throw err;
      }
  
      const collector = reactionMessage.createReactionCollector(
        (reaction, user) => message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
        { dispose: true }
      );
  
      collector.on("collect", (reaction, user) => {
        switch (reaction.emoji.name) {
          case "🔒":
            channel.updateOverwrite(message.author, { SEND_MESSAGES: false });
            break;
          case "⛔":
            channel.send("Apagando o canal de texto em 5 segundos!");
            setTimeout(() => channel.delete(), 5000);
            break;
        }
      });
  
      message.channel
        .send(`Moderadores chegarão em breve! ${channel}`)
        .then((msg) => {
          setTimeout(() => msg.delete(), 7000);
          setTimeout(() => message.delete(), 3000);
        })
        .catch((err) => {
          throw err;
        });
    },
  };
  