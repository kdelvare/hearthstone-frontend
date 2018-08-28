import Controller from '@ember/controller';
import { encode, decode, FormatType } from 'deckstrings';

export default Controller.extend({
	actions: {
		import() {
			const importString = "AAECAZICAA9AX/0C9wPmBcQGhQjVCOQIoM0CmNIChOYC4vgC3/sCv/0CAA=="; //this.get('importString');
			const decoded = decode(importString);
			this.set("hero", this.get('store').findRecord('card', decoded.heroes[0]));
			const cards = [];
			decoded.cards.forEach((card) => {
				cards.pushObject({
					card: this.get('store').findRecord('card', card[0]),
					number: card[1]
				})
			});
			this.set("cards", cards);

			this.set("showDeck", true);
		}
	}
});
