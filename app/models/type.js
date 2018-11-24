import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),
	collectible: DS.attr('boolean'),

	id_int: computed('id', function() {
		return parseInt(this.get('id'));
	})
});
