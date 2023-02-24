import * as path from 'path';
import * as fs from 'fs';
import { Client, REST, Routes } from 'discord.js';
import config from './config/config';
import logger from './config/logger';
import listeners from './listeners';
import CommandInterface from './interfaces/Command.interface';

class DiscordClient extends Client {
	private commands: CommandInterface[];
	private static instance: DiscordClient;
	
	constructor(options) {
		super(options);
		this.commands = [];
		this.loadCommands();
	}

	public static getInstance(options: object | undefined = undefined): DiscordClient {
		if (!DiscordClient.instance && !!options)
			DiscordClient.instance = new DiscordClient(options);

		return DiscordClient.instance;
	}

	async loadCommands(): Promise<void> {
		const { botToken, clientId, guildId, } = config;

		const commandsPath = path.join(__dirname, 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(filePath);

			this.commands.push(command);
		}

		const rest = new REST({ version: '10', }).setToken(botToken || '');

		try {
			logger.info('Resetando comandos...');
	
			await rest.put(
				Routes.applicationGuildCommands(clientId || '', guildId || ''),
				{ body: this.commands.map(c => c.data), }
			);
	
			logger.info('Comandos registrados com sucesso');
		} catch (error) {
			logger.error(error);
		}

		this.on('ready', () => {
			logger.info('Conectado!');
		});

		listeners();

		this.login(botToken);
	}

	public getCommands(): CommandInterface[] {
		return this.commands;
	}
}

export default DiscordClient;