import Controller from '@ember/controller';
import { computed, set } from '@ember/object';
import RSVP from 'rsvp';

export default Controller.extend({
	ordered_rarities: computed('model.rarities', function() {
		const rarities = this.get('model.rarities').toArray();
		const free = rarities[0];
		rarities[0] = rarities[1];
		rarities[1] = free;
		return rarities;
	}),

	total: computed('model.{cardsets,rarities,cards,user}', function() {
		const cardsets = this.get('model.cardsets');
		const rarities = this.get('model.rarities');
		const cards = this.get('model.cards');
		const user = this.get('model.user');

		let total = {
			cardsets: [],
			rarities: [],
			owned: 0,
			total: 0,
			rate: 0
		};
		cardsets.forEach(cardset => {
			total.cardsets[cardset.id] = {
				rarities: [],
				owned: 0,
				total: 0,
				rate: 0
			};
			rarities.forEach(rarity => {
				total.cardsets[cardset.id].rarities[rarity.id] = {
					owned: 0,
					total: 0,
					rate: 0
				};
			})
		});
		rarities.forEach(rarity => {
			total.rarities[rarity.id] = {
				owned: 0,
				total: 0,
				rate: 0
			};
		});
		console.log('total', total);

		cards.forEach(card => {
			const promises = {
				cardset: card.get('cardset'),
				rarity: card.get('rarity')
			};
			RSVP.hash(promises).then( ({ cardset, rarity }) => {
				cardset = parseInt(cardset.id);
				rarity = parseInt(rarity.id);
				//console.log('cardset rarity', cardset, rarity, card);
				set(total, 'total', total.total + 1);
				const cardsetTotal = total.cardsets[cardset];
				set(cardsetTotal, 'total', cardsetTotal.total + 1);
				const cardsetRarityTotal = total.cardsets[cardset].rarities[rarity];
				set(cardsetRarityTotal, 'total', cardsetRarityTotal.total + 1);
				const rarityTotal = total.rarities[rarity];
				set(rarityTotal, 'total', rarityTotal.total + 1);

				card.get('collections').then(collections => {
					collections.forEach(collection => {
						collection.get('user').then(collectionUser => {
							if (collectionUser.id === user.id) {
								set(total, 'owned', total.owned + 1);
								set(cardsetTotal, 'owned', cardsetTotal.owned + 1);
								set(cardsetRarityTotal, 'owned', cardsetRarityTotal.owned + 1);
								set(rarityTotal, 'owned', rarityTotal.owned + 1);
							}
						})
					});
				});
			})
		});

		if (total.total) {
			total.rate = Math.round(100 * total.owned / total.total);
		}
		/*let value;
		cardsets.forEach(cardset => {
			value = total.cardsets[cardset.id];
			value.rate = Math.round(100 * value.owned / value.total);
			rarities.forEach(rarity => {
				value = total.cardsets[cardset.id].rarities[rarity.id];
				value.rate = Math.round(100 * value.owned / value.total);
			})
		});
		rarities.forEach(rarity => {
			value = total.rarities[rarity.id];
			value.rate = Math.round(100 * value.owned / value.total);
		});*/

		return total;
	})
});
