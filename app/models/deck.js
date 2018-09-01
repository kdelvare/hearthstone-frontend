import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	url: DS.attr('string'),

	cardclass: DS.belongsTo({ async: true }),
	deckcards: DS.hasMany({ async: true}),

	id_int: computed('id', function() {
		return parseInt(this.get('id'));
	})
});
