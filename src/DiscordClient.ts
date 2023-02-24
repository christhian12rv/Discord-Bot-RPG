import * as path from 'path';
import * as fs from 'fs';
import { Client, REST, Routes } from 'discord.js';
import config from './config/config';
import logger from './config/logger';
import loadListeners from './listeners';
import CommandInterface from './interfaces/Command.interface';

class DiscordClient extends Client {
	private commands: CommandInterface[];
	private static instance: DiscordClient;
	
	constructor(options) {
		super(options);
		this.commands = [];
		this.connect();
	}

	public static getInstance(options: object | undefined = undefined): DiscordClient {
		if (!DiscordClient.instance && !!options)
			DiscordClient.instance = new DiscordClient(options);

		return DiscordClient.instance;
	}

	private async connect(): Promise<void> {
		const { botToken, } = config;

		await this.loadCommands();
		await this.resetCommands();

		loadListeners();

		this.login(botToken);
	}

	private async loadCommands(): Promise<void> {
		const commandsPath = path.join(__dirname, 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = await import(filePath);

			this.commands.push(command);
		}
	}

	private async resetCommands(): Promise<void> {
		const { botToken, clientId, guildId, } = config;

		const rest = new REST({ version: '10', }).setToken(botToken || '');

		try {
			logger.info('Resetting commands...');
	
			await rest.put(
				Routes.applicationGuildCommands(clientId || '', guildId || ''),
				{ body: this.commands.map(c => c.data), }
			);
	
			logger.info('Commands successfully reset');
		} catch (error) {
			logger.error(error);
		}
	}

	public getCommands(): CommandInterface[] {
		return this.commands;
	}
}

export default DiscordClient;