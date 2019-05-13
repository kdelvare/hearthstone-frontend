import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { encode } from 'deckstrings';
import RSVP from 'rsvp';

export default Controller.extend({
	queryParams: ['cardset'],
	cardset: null,
	page: 1,

	exportString: computed('model.deck.cardclass', 'model.deck.deckcards.@each.{number,card}', function() {
		const heroes = [0, 0, 274, 31, 637, 671, 813, 930, 1066, 893, 7];
		const cardclass = this.get('model.deck.cardclass');
		const hero = heroes[cardclass.get('id')];

		const deckcards = this.get('model.deck.deckcards');
		const cards = [];
		deckcards.forEach(deckcard => {
			cards.push([parseInt(deckcard.card.get('id')), deckcard.number]);
		});

		const deckStructure = {
			format: 2, // 1 pour Libre
			heroes: [hero],
			cards: cards
		}
		return encode(deckStructure);
	}),

	deckTypes: computed('model.deck.deckcards.@each.{number,card}', function() {
		const deckcards = this.get('model.deck.deckcards');
		return deckcards.reduce((deckTypes, deckcard) => {
			const type = deckcard.card.get('type.id');
			if (!deckTypes[type]) { deckTypes[type] = { name: deckcard.card.get('type.name_fr'), number: 0 }; }
			deckTypes[type].number += deckcard.number;
			return deckTypes;
		}, {});
	}),

	deckRarities: computed('model.deck.deckcards.@each.{number,card}', function() {
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

	deckCardsets: computed('model.deck.deckcards.@each.number', function() {
		const deckcards = this.get('model.deck.deckcards');
		return deckcards.reduce((deckCardsets, deckcard) => {
			const cardset = deckcard.card.get('cardset.id');
			if (!deckCardsets[cardset]) { deckCardsets[cardset] = { name: deckcard.card.get('cardset.name_fr'), number: 0, class: deckcard.card.get('cardset.class') }; }
			deckCardsets[cardset].number += deckcard.number;
			return deckCardsets;
		}, {});
	}),

	owned: computed('model.deck.deckcards.@each.number', function() {
		return this.get('model.deck.deckcards').reduce((total, deckcard) => {
			let userCollection = deckcard.card.get('collections').filter(collection => {
				return collection.user.get('id') === this.get('model.user.id');
			}).firstObject;
			return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
		}, 0);
	}),

	dust: computed('model.deck.deckcards.@each.number', function() {
		return this.get('model.deck.deckcards').reduce((total, deckcard) => {
			let userCollection = deckcard.card.get('collections').filter(collection => {
				return collection.user.get('id') === this.get('model.user.id');
			}).firstObject;
			return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('creationDust');
		}, 0);
	}),

	compareDecks: computed('model.decks', function() {
		const cardclass_id = this.get('model.deck.cardclass.id');
		return this.get('model.decks').filter(deck => {
			return deck.get('cardclass.id') === cardclass_id;
		})
	}),

	_updateDeckstring() {
		const deck = this.get('model.deck');
		deck.set('deckstring', deck.exportString);
		deck.save();
	},

	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		edit() {
			this.set('showDeckstring', false);
			const cardclass = this.get('model.deck.cardclass.id');
			let cardFilters = { cardclass: '12,' + cardclass, collectible: true, standard: true };
			if (this.get('cost')) { cardFilters.cost = this.get('cost'); }
			if (this.get('rarity')) { cardFilters.rarity = this.get('rarity'); }
			this.store.query('card', {
				filter: cardFilters,
				include: 'type,rarity,cardset,collections,collections.user',
				sort: 'cost,name_fr',
				page: { number: this.get('page'), size: 28 }
			}).then(cards => {
				this.set('cards', cards);
				this.set('isEditing', true);
			});
		},

		setUser(user) {
			this.get('store').findRecord('user', user).then(user => {
				this.get('model.deck').set('user', user);
			});
		},

		setDeckgroup(deckgroup) {
			this.get('store').findRecord('deckgroup', deckgroup).then(deckgroup => {
				this.get('model.deck').set('deckgroup', deckgroup);
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
				this.transitionToRoute('user.decks.deck', savedDeck.id);
			});
		},

		delete() {
			this.get('model.deck').deleteRecord();
			this.get('model.deck').save().then(() => {
				this.transitionToRoute('user.decks', { queryParams: { cardset: 1130 } });
			});
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
		},

		copyDeckstring() {
			let deckstring = this.get('model.deck.deckstring');
			navigator.clipboard.writeText(deckstring).then(() => {
				this.set('deckstringCopied', true);
			});
		},

		incNumber(deckcard) {
			deckcard.set('number', deckcard.get('number') + 1);
			deckcard.save().then(() => {
				const deck = this.get('model.deck');
				deck.set('deckstring', deck.exportString);
				deck.save();
			});
		},

		decNumber(deckcard) {
			deckcard.set('number', deckcard.get('number') - 1);
			deckcard.save().then(() => this._updateDeckstring());
		},

		addDeckcard(card) {
			this.get('store').query('deckcard', { filter: { deck: this.get('model.deck.id'), card: card.id } }).then(deckcards => {
				if (deckcards.length > 0) {
					const deckcard = deckcards.firstObject;
					if (card.rarity.get('name_fr') !== "Légendaire" && deckcard.number < 2) {
						deckcard.set('number', deckcard.number + 1);
						deckcard.save().then(() => this._updateDeckstring());
					}
				} else {
					const deckcard = this.get('store').createRecord('deckcard', {
						card: card,
						number: 1
					});
					const deckcards = this.get('model.deck.deckcards');
					deckcards.pushObject(deckcard);
					deckcard.save().then(() => this._updateDeckstring());
				}
			});
		},

		removeDeckcard(deckcard) {
			const deckcards = this.get('model.deck.deckcards');
			deckcards.removeObject(deckcard);
			deckcard.deleteRecord();
			deckcard.save().then(() => this._updateDeckstring());
		},

		toggleParam(name, value) {
			const param = this.get(name);
			if (param == value) {
				this.set(name, null);
			} else {
				this.set(name, value);
			}
			if (name !== "page") {
				this.set("page", 1);
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
					loose: 0,
					wincasual: 0,
					loosecasual: 0
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
					loose: 1,
					wincasual: 0,
					loosecasual: 0
				});
				deckstat.save();
			}
		},

		resetWinrate() {
			let deckstat = this.get('model.deck.deckstats').filter(deckstat => {
				return deckstat.user.get('id') === this.get('model.user.id');
			}).firstObject;
			if (deckstat) {
				deckstat.deleteRecord();
				deckstat.save();
			}
		},

		addWinCasual() {
			let deckstat = this.get('model.deck.deckstats').filter(deckstat => {
				return deckstat.user.get('id') === this.get('model.user.id');
			}).firstObject;
			if (deckstat) {
				deckstat.set('wincasual', deckstat.wincasual + 1);
				deckstat.save();
			} else {
				deckstat = this.get('store').createRecord('deckstat', {
					deck: this.get('model.deck'),
					user: this.get('model.user'),
					win: 0,
					loose: 0,
					wincasual: 1,
					loosecasual: 0
				});
				deckstat.save();
			}
		},

		addLooseCasual() {
			let deckstat = this.get('model.deck.deckstats').filter(deckstat => {
				return deckstat.user.get('id') === this.get('model.user.id');
			}).firstObject;
			if (deckstat) {
				deckstat.set('loosecasual', deckstat.loosecasual + 1);
				deckstat.save();
			} else {
				deckstat = this.get('store').createRecord('deckstat', {
					deck: this.get('model.deck'),
					user: this.get('model.user'),
					win: 0,
					loose: 0,
					wincasual: 0,
					loosecasual: 1
				});
				deckstat.save();
			}
		},

		compare(compareDeck) {
			this.transitionToRoute('user.decks.compare', this.get('model.deck.id'), compareDeck);
		}
	}
});
