import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	pity_rarities: computed('model.rarities', function() {
		return this.get('model.rarities').filter(rarity => rarity.name_fr === 'Epique' || rarity.name_fr === 'Légendaire');
	}),

	actions: {
		filterPityBySet(cardset, pitycounter) {
			return pitycounter.cardset.get('id') === cardset.id;
		},

		save() {
			this.get('model.packs').forEach(pack => {
				pack.save();
			});
			this.get('model.pitycounters').forEach(pitycounter => {
				pitycounter.save();
			});
		}
	}
});