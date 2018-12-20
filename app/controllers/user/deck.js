import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	queryParams: ['cardset'],
	cardset: null,

	deckTypes: computed('model.deck', function() {
		const deckcards = this.get('model.deck.deckcards');
		return deckcards.reduce((deckTypes, deckcard) => {
			const type = deckcard.card.get('type.id');
			if (!deckTypes[type]) { deckTypes[type] = { name: deckcard.card.get('type.name_fr'), number: 0 }; }
			deckTypes[type].number += deckcard.number;
			return deckTypes;
		}, {});
	}),

	deckRarities: computed('model.deck', function() {
		const deckcards = this.get('model.deck.deckcards');
		const deckRarities = deckcards.reduce((deckRarities, deckcard) => {
			const rarity = deckcard.card.get('rarity.id');
			if (!deckRarities[rarity]) { deckRarities[rarity] = { name: deckcard.card.get('rarity.name_fr'), number: 0 }; }
			deckRarities[rarity].number += deckcard.number;
			return deckRarities;
		}, {});
		// Swich common/basic
		if (deckRarities[1] && deckRarities[2]) {
			let tmp = deckRarities[1];
			deckRarities[1] = deckRarities[2];
			deckRarities[2] = tmp;
		}
		return deckRarities;
	}),

	deckCardsets: computed('model.deck', function() {
		const deckcards = this.get('model.deck.deckcards');
		return deckcards.reduce((deckCardsets, deckcard) => {
			const cardset = deckcard.card.get('cardset.id');
			if (!deckCardsets[cardset]) { deckCardsets[cardset] = { name: deckcard.card.get('cardset.name_fr'), number: 0, class: deckcard.card.get('cardset.class') }; }
			deckCardsets[cardset].number += deckcard.number;
			return deckCardsets;
		}, {});
	}),

	owned: computed('model.deck.deckcards', function() {
		return this.get('model.deck.deckcards').reduce((total, deckcard) => {
			let userCollection = deckcard.card.get('collections').filter(collection => {
				return collection.user.get('id') === this.get('model.user.id');
			}).firstObject;
			return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
		}, 0);
	}),

	dust: computed('model.deck.deckcards', function() {
		return this.get('model.deck.deckcards').reduce((total, deckcard) => {
			let userCollection = deckcard.card.get('collections').filter(collection => {
				return collection.user.get('id') === this.get('model.user.id');
			}).firstObject;
			return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('creationDust');
		}, 0);
	}),

	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		edit() {
			const cardclass = this.get('model.deck.cardclass.id');
			let cardFilters = { cardclass: '12,' + cardclass, collectible: true };
			if (this.get('cost')) { cardFilters.cost = this.get('cost'); }
			if (this.get('rarity')) { cardFilters.rarity = this.get('rarity'); }
			this.store.query('card', {
				filter: cardFilters,
				include: 'cardset',
				sort: 'cost,name_fr'
			}).then(cards => {
				this.set('cards', cards);
				this.set('isEditing', true);
			});
		},

		save() {
			this.get('model.deck').save().then(() => {
				this.set('isEditing', false);
			});
		},

		clone() {
			const deck = this.get('store').createRecord('deck', {
				name: this.get('model.deck.name'),
				cardclass: this.get('model.deck.cardclass'),
				user: this.get('model.user')
			});
			let deckcard;
			this.get('model.deck.deckcards').forEach(originalDeckcard => {
				deckcard = this.get('store').createRecord('deckcard', {
					card: originalDeckcard.card,
					number: originalDeckcard.number
				});
				deck.deckcards.pushObject(deckcard);
			});

			deck.save().then(savedDeck => {
				deck.deckcards.forEach((deckcard) => {
					deckcard.set('deck', savedDeck);
					deckcard.save();
				});
				this.transitionToRoute('user.deck', this.get('model.user.id'), savedDeck.id);
			});
		},

		delete() {
			this.get('model.deck').deleteRecord();
			this.get('model.deck').save().then(() => {
				this.transitionToRoute('user.deckgroups', this.get('model.user.id'), { queryParams: { cardset: 1129 } });
			});
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
		},

		incNumber(deckcard) {
			deckcard.set('number', deckcard.get('number') + 1);
			deckcard.save();
		},

		decNumber(deckcard) {
			deckcard.set('number', deckcard.get('number') - 1);
			deckcard.save();
		},

		addDeckcard(card) {
			this.get('store').query('deckcard', { filter: { deck: this.get('model.deck.id'), card: card.id } }).then(deckcards => {
				if (deckcards.length > 0) {
					const deckcard = deckcards.firstObject;
					if (card.rarity.get('name_fr') !== "Légendaire" && deckcard.number < 2) {
						deckcard.set('number', deckcard.number + 1);
						deckcard.save();
					}
				} else {
					const deckcard = this.get('store').createRecord('deckcard', {
						card: card,
						number: 1
					});
					const deckcards = this.get('model.deck.deckcards');
					deckcards.pushObject(deckcard);
					deckcard.save();
				}
			});
		},

		removeDeckcard(deckcard) {
			const deckcards = this.get('model.deck.deckcards');
			deckcards.removeObject(deckcard);
			deckcard.deleteRecord();
			deckcard.save();
		},

		toggleParam(name, value) {
			const param = this.get(name);
			if (param == value) {
				this.set(name, null);
			} else {
				this.set(name, value);
			}
			this.send('edit');
		},

		addWin() {
			let deckstat = this.get('model.deck.deckstats').filter(deckstat => {
				return deckstat.user.get('id') === this.get('model.user.id');
			}).firstObject;
			if (deckstat) {
				deckstat.set('win', deckstat.win + 1);
				deckstat.save();
			} else {
				deckstat = this.get('store').createRecord('deckstat', {
					deck: this.get('model.deck'),
					user: this.get('model.user'),
					win: 1,
					loose: 0
				});
				deckstat.save();
			}
		},

		addLoose() {
			let deckstat = this.get('model.deck.deckstats').filter(deckstat => {
				return deckstat.user.get('id') === this.get('model.user.id');
			}).firstObject;
			if (deckstat) {
				deckstat.set('loose', deckstat.loose + 1);
				deckstat.save();
			} else {
				deckstat = this.get('store').createRecord('deckstat', {
					deck: this.get('model.deck'),
					user: this.get('model.user'),
					win: 0,
					loose: 1
				});
				deckstat.save();
			}
		}
	}
});
