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

	actions: {
		toggleFormat() {
			this.toggleProperty('standard');
		}
	}
});
