import Controller from '@ember/controller';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Controller.extend({
	queryParams: ['cardset', 'class'],
	cardset: null,
	class: null,

	sources: computed('model.{user,decks,deckgroups}', function() {
		let sources = this.get('model.deckgroups').toArray();
		sources.unshift(this.get('model.user'));
		let alldecks = this.get('model.deckgroups').reduce((decks, deckgroup) => {
			deckgroup.decks.forEach(deck => {
				deck.set('source', deckgroup);
				decks.push(deck);
			});
			return decks;
		}, this.get('model.decks').toArray());

		const user = this.get('model.user');
		alldecks.forEach(deck => {
			if (!deck.source) deck.set('source', user);
			deck.set('owned', 0);
			deck.set('ownedDust', 0);
			deck.set('color', [180, 50, 80]);
			const deckcards = deck.get('deckcards');
			if (deckcards) {
				deck.set('owned', deckcards.reduce((total, deckcard) => {
					let userCollection = deckcard.card.get('collections').filter(collection => {
						return collection.user.get('id') === user.id;
					}).firstObject;
					return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
				}, 0));
				deck.set('ownedDust', deckcards.reduce((total, deckcard) => {
					let userCollection = deckcard.card.get('collections').filter(collection => {
						return collection.user.get('id') === user.id;
					}).firstObject;
					return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('creationDust');
				}, 0));
				deck.set('missingDust', deck.get('dust') - deck.ownedDust);
				deck.color[0] = 80 + 60 * Math.log2(1 + 7 * deck.missingDust / deck.get('dust'));
			}
			deck.set('color', `${deck.color[0]}, ${deck.color[1]}%, ${deck.color[2]}%`);
		})

		return sources;
	}),

	deckclasses: computed('model.cardclasses', function() {
		return this.get('model.cardclasses').filter(cardclass => cardclass.id !== "12")
	}),

	actions: {
		toggleParam(name, value) {
			const param = this.get(name);
			if (param === value) {
				this.set(name, null);
			} else {
				this.set(name, value);
			}
		},

		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		addWanteddeck(deck) {
			const user = this.get('model.user')
			const wanteddeck = this.get('store').createRecord('wanteddeck', {
				user: user,
				deck: deck
			});
			this.set('lock', true);
			wanteddeck.save().then(wanteddeck => {
				let wantedcardPromises = [];
				deck.deckcards.forEach(deckcard => {
					let userCollection = deckcard.card.get('collections').filter(collection => {
						return collection.user.get('id') === user.id;
					}).firstObject;
					if (userCollection) {
						const missingNumber = deckcard.number - userCollection.number;
						if (missingNumber > 0) {
							const wantedcard = this.get('store').createRecord('wantedcard', {
								user: user,
								card: deckcard.card,
								wanteddeck: wanteddeck,
								number: missingNumber
							});
							wantedcardPromises.push(wantedcard.save());
						}
					} else {
						const wantedcard = this.get('store').createRecord('wantedcard', {
							user: user,
							card: deckcard.card,
							wanteddeck: wanteddeck,
							number: deckcard.number
						});
						wantedcardPromises.push(wantedcard.save());
					}
				});
				RSVP.allSettled(wantedcardPromises).then(() => {
					this.set('lock', false);
				});
			});
		},

		removeWanteddeck(wanteddeck) {
			if (!this.get('lock')) {
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
			}
		}
	}
});