import DS from 'ember-data';

export default DS.Model.extend({
	total: DS.attr(),
	completion: DS.attr(),
	extrahs: DS.attr(),
	extra: DS.attr()
});
