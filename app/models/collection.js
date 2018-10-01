import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	number: DS.attr('number'),

	user: DS.belongsTo(),
	card: DS.belongsTo()
});
