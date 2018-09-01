import Controller from '@ember/controller';
import { decode } from 'deckstrings';

export default Controller.extend({
	actions: {
		import() {
			const importString = this.get('importString');
			const decoded = decode(importString);

			//const hero = this.get('store').findRecord('card', decoded.heroes[0]);
			this.get('store').query('cardclass', { card: decoded.heroes[0] }).then(cardclasses => {
				const cardclass = cardclasses.firstObject;
				const deck = this.get('store').createRecord('deck', {
					name: 'Aggro Mech (TopDecks budget)',
					url: 'https://www.hearthstonetopdecks.com/decks/budget-mech-warrior-deck-list-guide/',
					cardclass: cardclass
				});

				let deckcard;
				decoded.cards.forEach((decodedcard) => {
					this.get('store').findRecord('card', decodedcard[0]).then(card => {
						deckcard = this.get('store').createRecord('deckcard', {
							card: card,
							number: decodedcard[1]
						});
						deck.deckcards.pushObject(deckcard);
					})
				});
				this.set('deck', deck);

				this.set('showDeck', true);
			});
		},

		save() {
			this.get('deck').save().then(deck => {
				this.get('deck').deckcards.forEach((deckcard) => {
					deckcard.set('deck', deck);
					deckcard.save();
				})
			});
		}
	}
});
