import GameEntity from "./GameEntity.js";
import { images, pokemonFactory } from "../globals.js";
import StateMachine from "../../lib/StateMachine.js";
import PlayerWalkingState from "../states/player/PlayerWalkingState.js";
import PlayerIdlingState from "../states/player/PlayerIdlingState.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import { pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import Character from "../enums/Character.js";
import PokemonName from "../enums/PokemonName.js";
import Map from "../services/Map.js";

export default class Player extends GameEntity {
	/**
	 * The character that the player controls in the map.
	 * Has a party of Pokemon they can use to battle other Pokemon.
	 *
	 * @param {object} entityDefinition
	 * @param {Map} map
	 */
	constructor(entityDefinition = {}, map) {
		super(entityDefinition);

		this.map = map;
		this.dimensions = new Vector(GameEntity.WIDTH, GameEntity.HEIGHT);
		this.stateMachine = this.initializeStateMachine();
		this.sprites = this.initializeSprites()
		this.party = this.initializeParty()
		this.currentAnimation = this.stateMachine.currentState.animation[this.direction];
	}

	update(dt) {
		super.update(dt);
		this.currentAnimation.update(dt);

		this.currentFrame = this.currentAnimation.getCurrentFrame();
	}

	render() {
		const x = Math.floor(this.canvasPosition.x);

		/**
		 * Offset the Y coordinate to provide a more "accurate" visual.
		 * To see the difference, remove the offset and bump into something
		 * either above or below the character and you'll see why this is here.
		 */
		const y = Math.floor(this.canvasPosition.y - this.dimensions.y / 2);

		super.render(x, y);
	}

	initializeStateMachine() {
		const stateMachine = new StateMachine();

		stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
		stateMachine.add(PlayerStateName.Idling, new PlayerIdlingState(this));

		stateMachine.change(PlayerStateName.Idling);

		return stateMachine;
	}

	/**
	 * Normally, you wouldn't generate a random character sprite every time
	 * you made a new Player object. This is probably something the player
	 * would decide at the beginning of the game or in a settings menu.
	 */
	initializeSprites() {
		const character = pickRandomElement([
			Character.Red,
			Character.Green,
			Character.Brendan,
			Character.May,
		]);

		return Sprite.generateSpritesFromSpriteSheet(
			images.get(character),
			GameEntity.WIDTH,
			GameEntity.HEIGHT,
		);
	}

	/**
	 * Right now there's only ever one Pokemon in the party, but this
	 * can be extended to contain more since it returns an array.
	 */
	initializeParty() {
		const pokemonName = pickRandomElement([
			PokemonName.Bulbasaur,
			PokemonName.Charmander,
			PokemonName.Squirtle,
		]);
		const pokemon = pokemonFactory.createInstance(pokemonName);

		return [pokemon];
	}

	healParty() {
		this.party.forEach((pokemon) => {
			pokemon.heal();
		})
	}
}
