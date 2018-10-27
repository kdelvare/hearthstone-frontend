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
