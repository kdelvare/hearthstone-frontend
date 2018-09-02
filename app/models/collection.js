import DS from 'ember-data';

export default DS.Model.extend({
	number: DS.attr('number'),

	user: DS.belongsTo(),
	card: DS.belongsTo()
});
