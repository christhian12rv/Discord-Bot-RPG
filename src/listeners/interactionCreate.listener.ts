import { Events } from 'discord.js';
import logger from '../config/logger';
import DiscordClient from '../DiscordClient';

export default (): void => {
	const client = DiscordClient.getInstance();
	client.on(Events.InteractionCreate, async (interaction: any) => {
		if (!interaction.isChatInputCommand())
			return;

		const command = client.getCommands().find(c => interaction.commandName === c.data.name);

		if (!command) {
			logger.error(`Não existe um comando com nome ${interaction.commandName}.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			logger.error(error);
			await interaction.reply({ content: 'Houve um erro ao executar esse comando!', ephemeral: true, });
		}
	});
};