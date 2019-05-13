import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	compareCards: computed('model.{deck1.deckcards,deck2.deckcards}', function() {
		const deckcards1 = this.get('model.deck1.sortedDeckcards').toArray();
		const deckcards2 = this.get('model.deck2.sortedDeckcards').toArray();
		let compareCards = [];

		let index1 = 0;
		let index2 = 0;
		let deckcard1 = deckcards1[0];
		let deckcard2 = deckcards2[0];

		while (deckcard1 || deckcard2) {
			if (deckcard1 && deckcard2 && deckcard1.get('card.id') === deckcard2.get('card.id')) {
				compareCards.push({
					deckcard1: deckcard1,
					deckcard2: deckcard2
				});
				index1++;
				index2++;
			} else if (deckcard1 && (!deckcard2 ||
				deckcard1.get('card.cost') < deckcard2.get('card.cost') ||
				(deckcard1.get('card.cost') === deckcard2.get('card.cost') && deckcard1.get('card.name_fr') < deckcard2.get('card.name_fr'))))
			{
				compareCards.push({
					deckcard1: deckcard1
				});
				index1++;
			} else {
				compareCards.push({
					deckcard2: deckcard2
				});
				index2++;
			}

			deckcard1 = index1 < deckcards1.length ? deckcards1[index1] : null;
			deckcard2 = index2 < deckcards2.length ? deckcards2[index2] : null;
		}

		return compareCards;
	}),

	commonCount: computed('compareCards', function() {
		let commonCount = 0;
		this.get('compareCards').forEach(compareCard => {
			if (compareCard.deckcard1 && compareCard.deckcard2) {
				commonCount += Math.min(compareCard.deckcard1.number, compareCard.deckcard2.number);
			}
		});
		return commonCount;
	})
})