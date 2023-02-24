import { GatewayIntentBits } from 'discord.js';
import DiscordClient from './DiscordClient';

class App {
	private discordClient: DiscordClient;

	constructor() {
		this.connectBot();
	}

	private async connectBot(): Promise<void> {
		const options = { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages], };
		this.discordClient = DiscordClient.getInstance(options);
	}

}

export default App;