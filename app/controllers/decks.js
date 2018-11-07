import Controller from '@ember/controller';
import { decode } from 'deckstrings';

export default Controller.extend({
	actions: {
		import() {
			const importString = this.get('importString');
			const decoded = decode(importString);
			//console.log('decoded', decoded);

			this.get('store').findRecord('card', decoded.heroes[0], { include : 'cardclass' }).then(card => {
				const cardclass = card.cardclass;
				const deck = this.get('store').createRecord('deck', {
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

		setDeckgroup(deckgroup) {
			this.get('store').findRecord('deckgroup', deckgroup).then(deckgroup => {
				this.get('deck').set('deckgroup', deckgroup);
			});
		},

		save() {
			const importedDeck = this.get('deck');
			importedDeck.save().then(deck => {
				importedDeck.deckcards.forEach((deckcard) => {
					deckcard.set('deck', deck);
					deckcard.save();
				});
			});
		}
	}
});
