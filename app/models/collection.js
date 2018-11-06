import DS from 'ember-data';

export default DS.Model.extend({
	number: DS.attr('number'),
	completion: DS.attr('number'),
	golden: DS.attr('number'),

	user: DS.belongsTo(),
	card: DS.belongsTo()
});
