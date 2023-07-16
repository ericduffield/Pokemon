import Colour from "../../enums/Colour.js";
import { context } from "../../globals.js";
import Pokemon from "../../entities/Pokemon.js";
import UserInterfaceElement from "../UserInterfaceElement.js";
import Panel from "../elements/Panel.js";
import ProgressBar from "../elements/ProgressBar.js";
import HealthBar from "../elements/HealthBar.js";

export default class BattlePlayerPanel extends Panel {
	/**
	 * The Panel displayed beside the Player's Pokemon
	 * during battle that displays their name, health,
	 * level and experience.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {Pokemon} pokemon
	 * @param {object} options Options for the super Panel.
	 */
	constructor(x, y, width, height, pokemon, options = {}) {
		super(x, y, width, height, options);

		this.pokemon = pokemon;

		this.experienceBar = new ProgressBar(285, 245, ProgressBar.WIDTH, ProgressBar.HEIGHT, Colour.Blue, this.pokemon.currentExperience - this.pokemon.levelExperience, this.pokemon.targetExperience - this.pokemon.levelExperience);

		this.healthBar = new HealthBar(285, 198, ProgressBar.WIDTH, ProgressBar.HEIGHT, Colour.Green, this.pokemon.currentHealth, this.pokemon.health, this.pokemon);
	}

	update() {
		if (this.pokemon.damaged) {
			this.pokemon.damaged = false;
			this.healthBar.update();
		}
	}

	updateExperienceBar() {
		this.experienceBar.update(Math.min(this.pokemon.currentExperience - this.pokemon.levelExperience, this.pokemon.targetExperience - this.pokemon.levelExperience), 1);
	}

	render() {
		super.render();

		this.experienceBar.render();
		this.healthBar.render();

		this.renderStatistics();
	}

	/**
	 * All the magic number offsets here are to
	 * arrange all the pieces nicely in the space.
	 */
	renderStatistics() {
		context.save();
		context.textBaseline = 'top';
		context.fillStyle = Colour.Black;
		context.font = `${UserInterfaceElement.FONT_SIZE}px ${UserInterfaceElement.FONT_FAMILY}`;
		context.fillText(
			this.pokemon.name.toUpperCase(),
			this.position.x + 15,
			this.position.y + 12
		);
		context.textAlign = 'right';
		context.fillText(
			`Lv${this.pokemon.level}`,
			this.position.x + this.dimensions.x - 10,
			this.position.y + 12
		);
		context.fillText(
			`${this.pokemon.getHealthMeter()}`,
			this.position.x + this.dimensions.x - 30,
			this.position.y + this.dimensions.y - 26
		);
		context.restore();
	}
}
