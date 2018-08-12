import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),
	collectible: DS.attr('boolean'),

	image: computed('hs_id', function() {
		return `/assets/cardclass_${this.get('id')}.png`;
	})
});
