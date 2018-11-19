import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),

	image: computed('id', function() {
		return `/assets/rarity_${this.get('id')}.png`;
	}),

	creationDust: computed('name_fr', function() {
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
	}),

	creationDustGolden: computed('name_fr', function() {
		switch(this.get('name_fr')) {
			case 'Commune':
				return 400;
			case 'Rare':
				return 800;
			case 'Epique':
				return 1600;
			case 'Légendaire':
				return 3200;
			default:
				return 0;
		}
	}),

	destructionDust: computed('name_fr', function() {
		switch(this.get('name_fr')) {
			case 'Commune':
				return 5;
			case 'Rare':
				return 20;
			case 'Epique':
				return 100;
			case 'Légendaire':
				return 400;
			default:
				return 0;
		}
	}),

	destructionDustGolden: computed('name_fr', function() {
		switch(this.get('name_fr')) {
			case 'Commune':
				return 50;
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
