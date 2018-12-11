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

	actions: {
		filterOwned(collection) {
			return collection.user.get('id') === this.get('model.user.id');
		},

		edit() {
			this.toggleProperty('isEditing');
		},

		save() {
			this.get('model.deck').save().then(deck => {
				this.toggleProperty('isEditing');
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
		}
	}
});
