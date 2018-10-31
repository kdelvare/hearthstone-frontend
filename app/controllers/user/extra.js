import Controller from '@ember/controller';

export default Controller.extend({
	queryParams: ['class', 'cost', 'rarity', 'cardset', 'standard', 'page'],
	class: null,
	cost: null,
	rarity: null,
	cardset: null,
	standard: true,
	page: 1,

	actions: {
		toggleFormat() {
			this.toggleProperty('standard');
		},

		toggleParam(name, value) {
			const param = this.get(name);
			if (param === value) {
				this.set(name, null);
			} else {
				this.set(name, value);
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

		addToCollection(card) {
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
				if (userCollection.number === 2 && card.rarity.get('name_fr') !== "Légendaire") {
					userCollection.set('completion', 2);
				}
			} else {
				userCollection = this.get('store').createRecord('collection', {
					card: card,
					user: user,
					number: 1,
					completion: 1
				});
			}
			userCollection.save();

			userWantedcards.forEach(wantedcard => {
				const number = wantedcard.number;
				if (number > 1) {
					wantedcard.decrementProperty('number');
				} else {
					wantedcard.deleteRecord();
				}
				wantedcard.save();
			});
		},

		removeFromCollection(card) {
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
			const userWantedcards = card.wantedcards.filter(wantedcard => {
				return (wantedcard.user.get('id') === user.id) && !wantedcard.wanteddeck.get('id');
			});

			let userWantedcard;
			if (userWantedcards.length) {
				userWantedcard = userWantedcards.firstObject;
				const number = userWantedcard.number;
				if (number === 1) {
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
		}
	}
});
