import DS from 'ember-data';

export default DS.Model.extend({
	win: DS.attr('number'),
	loose: DS.attr('number'),
	wincasual: DS.attr('number'),
	loosecasual: DS.attr('number'),

	deck: DS.belongsTo(),
	user: DS.belongsTo()
});
