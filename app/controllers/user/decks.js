import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	deckstats: computed('model.decks', function() {
		let deckstats = [];
		this.get('model.deckgroups').forEach(deckgroup => {
			deckgroup.decks.forEach(deck => {
				let owned = 0;
				let dust = 0
				const deckcards = deck.get('deckcards');
				if (deckcards) {
					owned = deckcards.reduce((total, deckcard) => {
						let userCollection = deckcard.card.get('collections').filter(collection => {
							return collection.user.get('id') === this.get('model.user.id');
						}).firstObject;
						return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0);
					}, 0);
					dust = deckcards.reduce((total, deckcard) => {
						let userCollection = deckcard.card.get('collections').filter(collection => {
							return collection.user.get('id') === this.get('model.user.id');
						}).firstObject;
						return total + (userCollection ? Math.min(userCollection.number, deckcard.number) : 0) * deckcard.card.get('dust');
					}, 0);
				}
				deckstats[deck.id] = {
					owned: owned,
					dust: dust
				};
			})
		});
		return deckstats;
	}),

	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		}
	}
});
