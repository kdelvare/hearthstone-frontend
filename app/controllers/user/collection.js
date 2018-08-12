import Controller from '@ember/controller';

export default Controller.extend({
	queryParams: ['class', 'cost', 'cardset'],
	class: null,
	cost: null,
	cardset: null,

	actions: {
		toggleParam(name, value) {
			const param = this.get(name);
			if (param === value) {
				this.set(name, null);
			} else {
				this.set(name, value);
			}
		},

		addToCollection(card) {
			const user = this.get('model.user');
			card.get('collections').then((collections) => {
				const userCollections = collections.filterBy('user_id', user.id_int);
				if (userCollections.length) {
					const userCollection = userCollections[0];
					userCollection.incrementProperty('number');
					userCollection.save();
				} else {
					const userCollection = this.get('store').createRecord('collection', {
						card_id: card.id,
						user_id: user.id,
						number: 1
					});
					collections.pushObject(userCollection);
					userCollection.save();/*.then(() => {
						card.save();
					})*/
				}
			})
		},

		removeFromCollection(card) {
			const user = this.get('model.user');
			card.get('collections').then((collections) => {
				const userCollections = collections.filterBy('user_id', user.id_int);
				if (userCollections.length) {
					const userCollection = userCollections[0];
					const number = userCollection.number;
					if (number > 1) {
						userCollection.decrementProperty('number');
					} else {
						userCollection.deleteRecord();
					}
					userCollection.save();
				}
			});
		},
	}
});
