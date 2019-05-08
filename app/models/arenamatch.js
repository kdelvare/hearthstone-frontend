import DS from 'ember-data';

export default DS.Model.extend({
	won: DS.attr('boolean'),

	arena: DS.belongsTo(),
	cardclass: DS.belongsTo()
});
