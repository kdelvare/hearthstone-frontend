import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	standard: true,

	ordered_rarities: computed('model.rarities', function() {
		const rarities = this.get('model.rarities').toArray();
		const free = rarities[0];
		rarities[0] = rarities[1];
		rarities[1] = free;
		return rarities;
	}),

	completion: computed('model.stat.completion', 'model.cardsets', 'model.cardclasses', 'model.rarities', function() {
		const completion = this.get('model.stat.completion');
		const cardsets = this.get('model.cardsets');
		const cardclasses = this.get('model.cardclasses');
		const rarities = this.get('model.rarities');

		let data = completion;
		let subdata;
		data.rate = 100 * data.owned / data.total;
		data.rate_std = 100 * data.owned_std / data.total_std;
		cardsets.forEach(cardset => {
			data = completion.cardsets[cardset.id];
			data.rate = 100 * data.owned / data.total;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
			});
		});
		cardclasses.forEach(cardclass => {
			data = completion.cardclasses[cardclass.id];
			data.rate = 100 * data.owned / data.total;
			data.rate_std = 100 * data.owned_std / data.total_std;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
				subdata.rate_std = 100 * subdata.owned_std / subdata.total_std;
			});
		});
		rarities.forEach(rarity => {
			data = completion.rarities[rarity.id];
			data.rate = 100 * data.owned / data.total;
			data.rate_std = 100 * data.owned_std / data.total_std;
		});

		return completion;
	}),

	total: computed('model.stat.total', 'model.cardsets', 'model.cardclasses', 'model.rarities', function() {
		const total = this.get('model.stat.total');
		const cardsets = this.get('model.cardsets');
		const cardclasses = this.get('model.cardclasses');
		const rarities = this.get('model.rarities');

		let data = total;
		let subdata;
		data.rate = 100 * data.owned / data.total;
		data.rate_std = 100 * data.owned_std / data.total_std;
		cardsets.forEach(cardset => {
			data = total.cardsets[cardset.id];
			data.rate = 100 * data.owned / data.total;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
			});
		});
		cardclasses.forEach(cardclass => {
			data = total.cardclasses[cardclass.id];
			data.rate = 100 * data.owned / data.total;
			data.rate_std = 100 * data.owned_std / data.total_std;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
				subdata.rate_std = 100 * subdata.owned_std / subdata.total_std;
			});
		});
		rarities.forEach(rarity => {
			data = total.rarities[rarity.id];
			data.rate = 100 * data.owned / data.total;
			data.rate_std = 100 * data.owned_std / data.total_std;
		});

		return total;
	}),

	actions: {
		toggleFormat() {
			this.toggleProperty('standard');
		}
	}
});
