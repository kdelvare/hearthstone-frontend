import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	groups: computed('model.wantedcards', function() {
		let card_id, index, group, card_ids = [], groups = [];
		this.get('model.wantedcards').forEach(wantedcard => {
			card_id = wantedcard.card.get('id');
			index = card_ids.indexOf(card_id);
			if (index > -1) {
				group = groups[index];
				group.total += 1;//wantedcard.number;
				group.wantedcards.push(wantedcard);
				if (group.max < wantedcard.number) group.max = wantedcard.number;
			} else {
				card_ids.push(card_id);
				groups.push({
					card: wantedcard.card,
					total: 1,//wantedcard.number,
					max: wantedcard.number,
					wantedcards: [wantedcard]
				});
			}
		});

		return groups.sort((a, b) => a.total < b.total);
	})
});