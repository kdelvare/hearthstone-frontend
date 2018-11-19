import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	queryParams: ['fullStats, standard'],
	fullStats: false,
	standard: true,

	ordered_rarities: computed('model.rarities', function() {
		const rarities = this.get('model.rarities').toArray();
		const free = rarities[0];
		rarities[0] = rarities[1];
		rarities[1] = free;
		return rarities;
	}),

	completion: computed('model.{stat.completion,cardsets,cardclasses,rarities}', function() {
		const completion = this.get('model.stat.completion');
		const cardsets = this.get('standard') ? this.get('model.cardsets').filterBy('standard', true) : this.get('model.cardsets');
		const cardclasses = this.get('model.cardclasses');
		const rarities = this.get('model.rarities');

		let data = completion;
		let subdata, common, rare;
		data.rate = 100 * data.owned / data.total;
		cardsets.forEach(cardset => {
			data = completion.cardsets[cardset.id];
			data.rate = 100 * data.owned / data.total;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
			});
			common = data.rarities['1'].rate / 100;
			rare = data.rarities['3'].rate / 100;
			data.getnew = [
				100 * (common ** 4 * rare),
				100 * (4 * (1 - common) * common ** 3 * rare + common ** 4 * (1 - rare)),
				100 * (6 * (1 - common) ** 2 * common ** 2 * rare + 4 * (1 - common) * common ** 3 * (1 - rare)),
				100 * (4 * (1 - common) ** 3 * common * rare + 6 * (1 - common) ** 2 * common ** 2 * (1 - rare)),
				100 * ((1 - common) ** 4 * rare + 4 * (1 - common) ** 3 * common * (1 - rare)),
				100 * ((1 - common) ** 4 * (1 - rare))
			];
			data.getnewsum = [];
			data.getnewsum[5] = data.getnew[5];
			data.getnewsum[4] = data.getnewsum[5] + data.getnew[4];
			data.getnewsum[3] = data.getnewsum[4] + data.getnew[3];
			data.getnewsum[2] = data.getnewsum[3] + data.getnew[2];
			data.getnewsum[1] = data.getnewsum[2] + data.getnew[1];
			data.getnewsum[0] = data.getnewsum[1] + data.getnew[0];
			// Pack with wanted cards
			common = 1 -  data.rarities['1'].wanted / data.rarities['1'].total;
			rare = 1 - data.rarities['3'].wanted / data.rarities['3'].total;
			data.getwanted = [
				100 * (common ** 4 * rare),
				100 * (4 * (1 - common) * common ** 3 * rare + common ** 4 * (1 - rare)),
				100 * (6 * (1 - common) ** 2 * common ** 2 * rare + 4 * (1 - common) * common ** 3 * (1 - rare)),
				100 * (4 * (1 - common) ** 3 * common * rare + 6 * (1 - common) ** 2 * common ** 2 * (1 - rare)),
				100 * ((1 - common) ** 4 * rare + 4 * (1 - common) ** 3 * common * (1 - rare)),
				100 * ((1 - common) ** 4 * (1 - rare))
			];
			data.getwantedsum = [];
			data.getwantedsum[5] = data.getwanted[5];
			data.getwantedsum[4] = data.getwantedsum[5] + data.getwanted[4];
			data.getwantedsum[3] = data.getwantedsum[4] + data.getwanted[3];
			data.getwantedsum[2] = data.getwantedsum[3] + data.getwanted[2];
			data.getwantedsum[1] = data.getwantedsum[2] + data.getwanted[1];
			data.getwantedsum[0] = data.getwantedsum[1] + data.getwanted[0];
		});
		cardclasses.forEach(cardclass => {
			data = completion.cardclasses[cardclass.id];
			data.rate = 100 * data.owned / data.total;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
			});
		});
		rarities.forEach(rarity => {
			data = completion.rarities[rarity.id];
			data.rate = 100 * data.owned / data.total;
		});

		return completion;
	}),

	total: computed('model.{stat.total,cardsets,cardclasses,rarities}', function() {
		const total = this.get('model.stat.total');
		const cardsets = this.get('standard') ? this.get('model.cardsets').filterBy('standard', true) : this.get('model.cardsets');
		const cardclasses = this.get('model.cardclasses');
		const rarities = this.get('model.rarities');

		let data = total;
		let subdata;
		data.rate = 100 * data.owned / data.total;
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
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = 100 * subdata.owned / subdata.total;
			});
		});
		rarities.forEach(rarity => {
			data = total.rarities[rarity.id];
			data.rate = 100 * data.owned / data.total;
		});

		return total;
	}),

	actions: {
		toggleFormat() {
			this.toggleProperty('standard');
		},

		showAllStats() {
			this.set('fullStats', true);
		},

		sumDust(total, extra, rarity_id) {
			const rarity = this.get('model.rarities').findBy("id", String(rarity_id));
			return rarity ? total + extra * rarity.destructionDust : 0;
		}
	}
});
