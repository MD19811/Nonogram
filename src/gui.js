import {GuiTemplate} from '../src/gui-template.js';
import {PuzzleLibrary} from '../src/puzzle-library.js';
import {Creator} from '../src/creator.js';

export {Gui};

/**
 * @class Gui
 * Verwerkt de gebruikersinterface en het "verscherpen" van de afbeelding.
 */
const Gui = class
{
	constructor( themePath )
	{
		// ... (bestaande constructor code voor stylesheets)
		this.playerClickMode = 1; // 1 = vullen, 0 = kruisje

        // De URL van de willekeurige foto
        this.backgroundImageUrl = "https://md19811.github.io/Manillen/randomM";
	}

	/**
	 * Initialiseert de achtergrondafbeelding container
	 */
	_initBackground() {
		const bgContainer = document.createElement('div');
		bgContainer.className = 'nonogram-background-image';
		bgContainer.style.cssText = `
			position: absolute;
			top: 0; left: 0; width: 100%; height: 100%;
			z-index: -1;
			background-image: url('${this.backgroundImageUrl}');
			background-size: cover;
			filter: blur(20px);
			transition: filter 0.3s ease;
		`;
		this.gridContainer.appendChild(bgContainer);
	}

	/**
	 * Berekent de scherpte op basis van correct ingevulde cellen
	 */
	_updateSharpness() {
		const cells = this.puzzle.cells;
		const totalToFill = cells.filter(c => c.solution === 1).length;

		if (totalToFill === 0) return;

		// Tel cellen die correct zijn ingevuld door de gebruiker
		const correctlyFilled = cells.filter(c => c.solution === 1 && c.userSolution === 1).length;
		const percentage = (correctlyFilled / totalToFill);

		// Blur gaat van 20px (0% af) naar 0px (100% af)
		const maxBlur = 20;
		const currentBlur = maxBlur - (percentage * maxBlur);

		const bg = this.gridContainer.querySelector('.nonogram-background-image');
		if (bg) {
			bg.style.filter = `blur(${currentBlur}px)`;
		}
	}

	/**
	 * Afhandeling van de klik van een speler
	 * @param {Event} event
	 */
	_handleCellClick( event )
	{
		const cellIndex = event.target.dataset.index;
		const cell      = this.puzzle.cells[cellIndex];

		// Toggle de oplossing van de gebruiker
		if (cell.userSolution === this.playerClickMode) {
			cell.userSolution = null;
		} else {
			cell.userSolution = this.playerClickMode;
		}

		// Update de UI klassen
		this._renderCell( event.target, cell );

		// Update de scherpte van de afbeelding
		this._updateSharpness();

		// Controleer of de puzzel opgelost is
		if (this.puzzle.checkUserSolution()) {
			this._showPuzzleSolved();
		}
	}

	/**
	 * Render de cel status naar de DOM
	 */
	_renderCell( element, cell ) {
		element.classList.remove( 'user-positive', 'user-negative' );

		if (cell.userSolution === 1) {
			element.classList.add( 'user-positive' );
		} else if (cell.userSolution === 0) {
			element.classList.add( 'user-negative' );
		}
	}

    // ... rest van de bestaande methodes (drawGrid, drawPreview, etc.)
};