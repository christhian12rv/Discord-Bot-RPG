import logger from '../config/logger';
import DiscordClient from '../DiscordClient';

export default (): void => {
	const client = DiscordClient.getInstance();
	client.on('ready', (c) => {
		logger.info(`Ready! Logged in as ${c.user.tag}`);
	});
};