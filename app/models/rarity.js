import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string')
});
