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
		let subdata, multiple, missing, wanted, wantedmissing;
		data.rate = data.owned / data.total;
		cardsets.forEach(cardset => {
			data = completion.cardsets[cardset.id];
			data.rate = data.owned / data.total;
			rarities.forEach(rarity => {
				subdata = data.rarities[rarity.id];
				subdata.rate = subdata.owned / subdata.total;
				subdata.wantedrate = subdata.wanted / subdata.total;
			});
			// 72% common, 23% rare, 4% epic, 1% legendary (with no double)
			const fullLegendaries = data.rarities['5'].owned == data.rarities['5'].total;
			multiple = data.rarities['1'].rate * 0.72 + data.rarities['3'].rate * 0.23 + data.rarities['4'].rate * 0.04 + (fullLegendaries ? 0.01 : 0);
			missing = 1 - multiple;
			data.getnew = [
				multiple ** 5,
				5 * missing * multiple ** 4,
				10 * missing ** 2 * multiple ** 3,
				10 * missing ** 3 * multiple ** 2,
				5 * missing ** 4 * multiple,
				missing ** 5
			];
			data.getnewsum = [];
			data.getnewsum[5] = data.getnew[5];
			data.getnewsum[4] = data.getnewsum[5] + data.getnew[4];
			data.getnewsum[3] = data.getnewsum[4] + data.getnew[3];
			data.getnewsum[2] = data.getnewsum[3] + data.getnew[2];
			data.getnewsum[1] = data.getnewsum[2] + data.getnew[1];
			data.getnewsum[0] = data.getnewsum[1] + data.getnew[0];
			// Pack with wanted cards
			const wantedLegendaries = data.rarities['5'].wanted / (data.rarities['5'].total - data.rarities['5'].owned);
			wanted = data.rarities['1'].wantedrate * 0.72 + data.rarities['3'].wantedrate * 0.23 + data.rarities['4'].wantedrate * 0.04 + (fullLegendaries ? 0 : wantedLegendaries * 0.01);
			wantedmissing = 1 - wanted;
			data.getwanted = [
				wantedmissing ** 5,
				5 * wanted * wantedmissing ** 4,
				10 * wanted ** 2 * wantedmissing ** 3,
				10 * wanted ** 3 * wantedmissing ** 2,
				5 * wanted ** 4 * wantedmissing,
				wanted ** 5
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

		sumDust(golden, total, extra, rarity_id) {
			const rarity = this.get('model.rarities').findBy("id", String(rarity_id));
			return rarity ? total + extra * (golden ? rarity.destructionDustGolden : rarity.destructionDust) : 0;
		}
	}
});
