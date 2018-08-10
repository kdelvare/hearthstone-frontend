import DS from 'ember-data';

export default DS.JSONSerializer.extend({
	primaryKey: 'hs_id'
});
