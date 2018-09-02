import DS from 'ember-data';

export default DS.Model.extend({
	number: DS.attr('string'),

	deck: DS.belongsTo(),
	card: DS.belongsTo()
});
