import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	ordered_rarities: computed('model.rarities', function() {
		const rarities = this.get('model.rarities').toArray();
		const free = rarities[1];
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

		cards.forEach(card => {
			const cardset = card.cardset.get('id');
			const rarity = card.rarity.get('id');

			total.total += 1;
			total.cardsets[cardset].total += 1;
			total.cardsets[cardset].rarities[rarity].total += 1;
			total.rarities[rarity].total += 1;

			card.get('collections').forEach(collection => {
				if (collection.user_id === user.id_int) {
					total.owned += 1;
					total.cardsets[cardset].owned += 1;
					total.cardsets[cardset].rarities[rarity].owned += 1;
					total.rarities[rarity].owned += 1;
				}
			});
		});

		if (total.total) {
			total.rate = Math.round(100 * total.owned / total.total);
		}
		let value;
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
		});

		return total;
	})
});
