import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	queryParams: ['class', 'cost', 'rarity', 'cardset', 'standard', 'own', 'page'],
	class: "",
	cost: null,
	rarity: null,
	cardset: null,
	standard: true,
	own: null,
	page: 1,

	// Separator needs to be "," for jasonapi-resourcce queryParam, but " " for w split helper
	wclass: computed('class', function() {
		return this.get('class').replace(",", " ");
	}),

	pity_rarities: computed('model.rarities', function() {
		return this.get('model.rarities').filter(rarity => rarity.name_fr === 'Epique' || rarity.name_fr === 'Légendaire');
	}),

	pitycounters: computed('model.pitycounters', function() {
		return this.get('model.pitycounters').toArray();
	}),

	actions: {
		toggleFormat() {
			this.toggleProperty('standard');
		},

		toggleParam(name, value) {
			const param = this.get(name);
			if (name === "class") {
				let values = param.split(',');
				if (values.includes(value)) {
					values.splice(values.indexOf(value), 1);
				} else if (value === "12") {
					values.push("12");
				} else if (values.includes("12")) {
					values = [value, "12"];
				} else {
					values = [value];
				}
				this.set(name, values.join(','));
			} else if (param === value || name === "own" && value === "golden" && param === "goldenb") {
				this.set(name, null);
			} else {
				this.set(name, value);
			}
			// Special cases for golden basics
			if (this.get("cardset") && this.get("own") === "golden") {
				this.set("own", "goldenb");
			} else if (!this.get("cardset") && this.get("own") === "goldenb") {
				this.set("own", "golden");
			}
			// Reset pagination
			if (name !== "page") {
				this.set("page", 1);
			}
		},

		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		sumWanted(total, wantedcard) {
			return total + wantedcard.number;
		},

		maxWanted(max, wantedcard) {
			return wantedcard.number > max ? wantedcard.number : max;
		},

		addToCollection(card, golden) {
			const user = this.get('model.user');
			const userCollections = card.collections.filter(collection => {
				return collection.user.get('id') === user.id;
			});
			const userWantedcards = card.wantedcards.filter(wantedcard => {
				return wantedcard.user.get('id') === user.id;
			});

			let userCollection;
			if (userCollections.length) {
				userCollection = userCollections.firstObject;
				userCollection.incrementProperty('number');
				if (golden) {
					userCollection.incrementProperty('golden');
				}
				if (userCollection.number === 2 && card.rarity.get('name_fr') !== "Légendaire") {
					userCollection.set('completion', 2);
				}
			} else {
				userCollection = this.get('store').createRecord('collection', {
					card: card,
					user: user,
					number: 1,
					completion: 1,
					golden: golden ? 1 : 0
				});
			}
			userCollection.save();

			userWantedcards.forEach(wantedcard => {
				const number = wantedcard.number;
				if (number > 1) {
					wantedcard.decrementProperty('number');
				} else {
					card.wantedcards.removeObject(wantedcard);
					wantedcard.deleteRecord();
				}
				wantedcard.save();
			});
		},

		removeFromCollection(card, golden) {
			const user = this.get('model.user');
			const userCollections = card.collections.filter(collection => {
				return collection.user.get('id') === user.id;
			});

			let userCollection;
			if (userCollections.length) {
				userCollection = userCollections.firstObject;
				const number = userCollection.number;
				if (number > 1) {
					userCollection.decrementProperty('number');
					if (golden) {
						userCollection.decrementProperty('golden');
					}
					if (number === 2 && card.rarity.get('name_fr') !== "Légendaire") {
						userCollection.set('completion', 1);
					}
				} else {
					userCollection.deleteRecord();
				}
				userCollection.save();
			}
		},

		cycleWanted(card) {
			const user = this.get('model.user');
			const userCollections = card.collections.filter(collection => {
				return collection.user.get('id') === user.id;
			});
			const userWantedcards = card.wantedcards.filter(wantedcard => {
				return (wantedcard.user.get('id') === user.id) && !wantedcard.wanteddeck.get('id');
			});

			let userWantedcard;
			if (userWantedcards.length) {
				userWantedcard = userWantedcards.firstObject;
				const number = userWantedcard.number;
				if (number === 1 && card.belongsTo("rarity").id() !== "5" && userCollections.length === 0) {
					userWantedcard.incrementProperty('number');
				} else {
					userWantedcard.deleteRecord();
				}
			} else {
				userWantedcard = this.get('store').createRecord('wantedcard', {
					card: card,
					user: user,
					number: 1
				});
			}
			userWantedcard.save();
		},

		initPitycounters() {
			const cardset = this.get('model.cardsets').findBy('id', this.get('cardset'));
			this.get('pity_rarities').forEach(pity_rarity => {
				this.get('store').createRecord('pitycounter', {
					user: this.get('model.user'),
					cardset: cardset,
					rarity: pity_rarity,
					number: 0
				}).save().then(pitycounter => {
					this.get('pitycounters').pushObject(pitycounter);
				});
			});
		},

		incrementPitycounters() {
			this.get('pitycounters').forEach(pitycounter => {
				pitycounter.incrementProperty('number');
				pitycounter.save()
			});
			this.get('model.packs').forEach(pack => {
				pack.incrementProperty('number');
				pack.save()
			});
			this.set('showPitycounters', true);
		},

		resetPitycounter(pitycounter) {
			pitycounter.set('number', 0);
			pitycounter.save();
		}
	}
});
