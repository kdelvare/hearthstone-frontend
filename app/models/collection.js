import DS from 'ember-data';

export default DS.Model.extend({
	completion: DS.attr('number'),
	number: DS.attr('number'),

	user: DS.belongsTo(),
	card: DS.belongsTo()
});
