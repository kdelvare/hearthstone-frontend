import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	queryParams: ['cardset'],
	cardset: null,

	deckstats: computed('model.{deckgroups,decks}', function() {
		let deckstats = [];
		this.get('model.deckgroups').forEach(deckgroup => {
			deckgroup.decks.forEach(deck => {
				let owned = 0;
				let dust = 0;
				let color = [180, 50, 80];
				const deckcards = deck.get('deckcards');
				if (deckcards) {
					owned = deckcards.reduce((total, deckcard) => {
						let userCollection = deckcard.card.get('collections').filter(collection => {
							return collection.user.get('id') === this.get('model.user.id');
						}).firstObject;
						return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
					}, 0);
					//color[1] = 3 * owned;
					dust = deckcards.reduce((total, deckcard) => {
						let userCollection = deckcard.card.get('collections').filter(collection => {
							return collection.user.get('id') === this.get('model.user.id');
						}).firstObject;
						return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('creationDust');
					}, 0);
					const missingDust = deck.get('dust') ? (deck.get('dust') - dust) / deck.get('dust') : 0;
					color[0] = 80 + 60 * Math.log2(1 + 7 * missingDust);
				}
				deckstats[deck.id] = {
					owned: owned,
					dust: dust,
					color: deck.name ? `${color[0]}, ${color[1]}%, ${color[2]}%` : '180, 100%, 100%'
				};
			})
		});
		this.get('model.decks').forEach(deck => {
			let owned = 0;
			let dust = 0;
			let color = [180, 50, 80];
			const deckcards = deck.get('deckcards');
			if (deckcards) {
				owned = deckcards.reduce((total, deckcard) => {
					let userCollection = deckcard.card.get('collections').filter(collection => {
						return collection.user.get('id') === this.get('model.user.id');
					}).firstObject;
					return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
				}, 0);
				//color[1] = 3 * owned;
				dust = deckcards.reduce((total, deckcard) => {
					let userCollection = deckcard.card.get('collections').filter(collection => {
						return collection.user.get('id') === this.get('model.user.id');
					}).firstObject;
					return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('creationDust');
				}, 0);
				const missingDust = deck.get('dust') ? (deck.get('dust') - dust) / deck.get('dust') : 0;
				color[0] = 80 + 60 * Math.log2(1 + 7 * missingDust);
			}
			deckstats[deck.id] = {
				owned: owned,
				dust: dust,
				color: deck.name ? `${color[0]}, ${color[1]}%, ${color[2]}%` : '180, 100%, 100%'
			};
		});
		return deckstats;
	}),

	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		filterCardclass(cardclass, deck) {
			return deck.cardclass.get('id') === cardclass.id;
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
			wanteddeck.get('wantedcards').then(wantedcards => {
				wantedcards.forEach(wantedcard => {
					wantedcard.get('card').then(card => {
						card.wantedcards.removeObject(wantedcard);
					});
					wantedcard.deleteRecord();
					wantedcard.save();
				});
			});
			wanteddeck.get('deck').then(deck => {
				deck.wanteddecks.removeObject(wanteddeck);
			});
			wanteddeck.deleteRecord();
			wanteddeck.save();
		},

		createDeck(cardclass) {
			const deck = this.get('store').createRecord('deck', {
				name: 'Nouveau',
				cardclass: cardclass,
				user: this.get('model.user')
			});
			deck.save().then(savedDeck => {
				this.transitionToRoute('user.decks.deck', this.get('model.user.id'), savedDeck.id);
			});
		}
	}
});
