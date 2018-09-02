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
			this.get('store').query('collection', { filter: { user: user.id, card: card.id } }).then(userCollections => {
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
			});
		},

		removeFromCollection(card) {
			const user = this.get('model.user');
			this.get('store').query('collection', { filter: { user: user.id, card: card.id } }).then(userCollections => {
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
			});
		},
	}
});
