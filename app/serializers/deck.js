import DS from 'ember-data';

export default DS.JSONSerializer.extend({
	attrs: {
		deckcards: { serialize: true }
	}
});
