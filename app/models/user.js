import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),

	id_int: computed('id', function() {
		return parseInt(this.get('id'));
	})
});
