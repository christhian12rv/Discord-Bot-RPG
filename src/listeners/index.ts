import interactionCreateListener from './interactionCreate.listener';
import ready from './ready';

export default ():void => {
	ready();
	interactionCreateListener();
};