import DS from 'ember-data';

export default DS.Model.extend({
	date: DS.attr('date'),
	archetype: DS.attr('string'),
	score: DS.attr('number'),
	done: DS.attr('boolean'),
	win: DS.attr('number'),

	cardclass: DS.belongsTo(),
	user: DS.belongsTo()
});
