import DS from 'ember-data';

export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
	primaryKey: 'hs_id',

	attrs: {
		collections: { embedded: 'always' }
	}
});
