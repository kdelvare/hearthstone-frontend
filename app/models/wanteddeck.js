import DS from 'ember-data';

export default DS.Model.extend({
	user: DS.belongsTo(),
	deck: DS.belongsTo(),
	wantedcards: DS.hasMany()
});
