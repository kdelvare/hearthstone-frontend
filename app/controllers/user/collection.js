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

			let userCollection;
			if (userCollections.length) {
				userCollection = userCollections.firstObject;
				userCollection.incrementProperty('number');
			} else {
				userCollection = this.get('store').createRecord('collection', {
					card: card,
					user: user,
					number: 1
				});
			}
			userCollection.save();
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
				} else {
					userCollection.deleteRecord();
				}
				userCollection.save();
			}
		},
	}
});
