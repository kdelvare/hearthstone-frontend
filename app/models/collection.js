import DS from 'ember-data';

export default DS.Model.extend({
	card_id: DS.attr('number'),
	user_id: DS.attr('number'),
	number: DS.attr('number')
});
