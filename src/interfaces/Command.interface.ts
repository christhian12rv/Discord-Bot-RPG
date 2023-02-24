import { CacheType, Interaction } from 'discord.js';

interface Command {
	data: {
		name: string
		description: string
		toJSON: () => object
	}
	execute: (interaction: Interaction<CacheType>) => any
}

export default Command;