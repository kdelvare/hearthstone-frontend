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
			} else if (param === value) {
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
