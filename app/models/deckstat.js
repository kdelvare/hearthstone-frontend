import DS from 'ember-data';

export default DS.Model.extend({
	win: DS.attr('number'),
	loose: DS.attr('number'),
	win_casual: DS.attr('number'),
	loose_casual: DS.attr('number'),

	deck: DS.belongsTo(),
	user: DS.belongsTo()
});
