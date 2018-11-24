import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	queryParams: ['cardset'],
	cardset: null,

	deckstats: computed('model.deck', function() {
		const deck = this.get('model.deck');

		let owned = 0;
		let dust = 0;
		const deckcards = deck.get('deckcards');
		if (deckcards) {
			owned = deckcards.reduce((total, deckcard) => {
				let userCollection = deckcard.card.get('collections').filter(collection => {
					return collection.user.get('id') === this.get('model.user.id');
				}).firstObject;
				return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
			}, 0);
			dust = deckcards.reduce((total, deckcard) => {
				let userCollection = deckcard.card.get('collections').filter(collection => {
					return collection.user.get('id') === this.get('model.user.id');
				}).firstObject;
				return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('creationDust');
			}, 0);
			const missingDust = (deck.get('dust') - dust) / deck.get('dust');
		}

		return {
			owned: owned,
			dust: dust
		};
	}),

	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		addWanteddeck(deck) {
			const wanteddeck = this.get('store').createRecord('wanteddeck', {
				user: this.get('model.user'),
				deck: deck
			});
			wanteddeck.save().then(wanteddeck => {
				deck.deckcards.forEach(deckcard => {
					let userCollection = deckcard.card.get('collections').filter(collection => {
						return collection.user.get('id') === this.get('model.user.id');
					}).firstObject;
					if (userCollection) {
						const missingNumber = deckcard.number - userCollection.number;
						if (missingNumber > 0) {
							const wantedcard = this.get('store').createRecord('wantedcard', {
								user: this.get('model.user'),
								card: deckcard.card,
								wanteddeck: wanteddeck,
								number: missingNumber
							});
							wantedcard.save();
						}
					} else {
						const wantedcard = this.get('store').createRecord('wantedcard', {
							user: this.get('model.user'),
							card: deckcard.card,
							wanteddeck: wanteddeck,
							number: deckcard.number
						});
						wantedcard.save();
					}
				});
			});
		},

		removeWanteddeck(wanteddeck) {
			wanteddeck.get('deck').then(deck => {
				deck.wanteddecks.removeObject(wanteddeck);
			});
			wanteddeck.deleteRecord();
			wanteddeck.save();
		}
	}
});