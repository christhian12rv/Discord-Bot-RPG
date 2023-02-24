import { SlashCommandBuilder } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Lançar um ou mais dados aleatórios com ou sem modificador. Exemplo: /d 2d20+4')
		.addStringOption(option =>
			option
				.setName('dices')
				.setDescription('Número de dados/d/dado/modificador')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('advantage')
				.setDescription('Vantagem ou Desvantagem ao rolar os dados')
				.addChoices(
					{ name: 'Vantagem', value: 1, },
					{ name: 'Desvantagem', value: 2, }
				)
				.setRequired(false))
		.addIntegerOption(option =>
			option
				.setName('difficulty')
				.setDescription('Se o resultado for >= SUCESSO, senão FALHA')
				.setRequired(false)),
		
	async execute(interaction): Promise<void> {
		const dicesStr = interaction.options.getString('dices');
		const advantage = interaction.options.getInteger('advantage');
		const difficulty = interaction.options.getInteger('difficulty');

		const regexDices = /(^| )((\d*)d(\d+|F)((?:\+|-|\/|\*)(\d+))?( desv| vent)?)(,|$)/g;
		if (!regexDices.test(dicesStr)) {
			await interaction.reply('Dados incorretos');
			return;
		}

		const numberOfDices = parseInt(dicesStr.substr(0, dicesStr.indexOf('d')));
		const dicesModifierStr = dicesStr.substring(dicesStr.search(/[+|-|*|/]/), dicesStr.search(/[+|-|*|/]/) + 1);
		const dicesModifier = parseInt(dicesStr.substr(dicesStr.search(/[+|-|*|/]/) + 1));
		let dicesType = 0;

		if (dicesModifierStr)
			dicesType = parseInt(dicesStr.substring(dicesStr.indexOf('d') + 1, dicesStr.search(/[+|-|*|/]/)));
		else
			dicesType = parseInt(dicesStr.substring(dicesStr.indexOf('d') + 1));

		let value = 0;
		let valueStr = '(';

		if (!advantage) {
			for (let i = 0; i < numberOfDices; i++) {
				const randomDice = Math.floor(Math.random() * dicesType) + 1;

				if (i != (numberOfDices - 1))
					valueStr += randomDice + ' + ';
				else
					valueStr += randomDice + ')';
			}
		} else {
			for (let i = 0; i < numberOfDices; i++) {
				const randomDice = Math.floor(Math.random() * dicesType) + 1;
				const randomDice2 = Math.floor(Math.random() * dicesType) + 1;
				let result = 0;

				if (advantage === 1)
					result = Math.max(randomDice, randomDice2);
				else
					result = Math.min(randomDice, randomDice2);

				if (i != (numberOfDices - 1))
					valueStr += result + ' + ';
				else
					valueStr += result + ')';
			}
		}

		if (dicesModifierStr)
			valueStr += ' ' + dicesModifierStr + ' ' + dicesModifier;

		value = eval(valueStr);

		let str = '```arm\n' + dicesStr + ' = ' + value + '\n' + valueStr;

		if (advantage)
			str += advantage == 1 ? '\nVantagem' : '\nDesvantagem';

		if (difficulty) {
			str += '\nDificuldade = ' + difficulty + ' - ';
			if (value >= difficulty)
				str += 'SUCESSO';
			else
				str += 'FALHA';
		}

		str += '\n```';

		await interaction.reply({ content: str, });
	},
};