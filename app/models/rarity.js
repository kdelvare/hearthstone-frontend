import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),

	image: computed('id', function() {
		return `/assets/rarity_${this.get('id')}.png`;
	}),

	dust: computed('name_fr', function() {
		switch(this.get('name_fr')) {
			case 'Commune':
				return 40;
			case 'Rare':
				return 100;
			case 'Epique':
				return 400;
			case 'Légendaire':
				return 1600;
			default:
				return 0;
		}
	})
});
