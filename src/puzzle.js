import {Utility} from '../src/utility.js';


export {Puzzle};

/**
 * @class
 * @type {Puzzle}
 * @this Puzzle
 *
 * De hoofdklasse van de puzzel die het grid, de hints en de logica bevat.
 */
const Puzzle = class
{
	/**
	 * @param {number} width - aantal kolommen
	 * @param {number} height - aantal rijen
	 */
	constructor( width, height )
	{
		if (typeof width === 'undefined' || typeof height === 'undefined') {
			throw('width and height are required constructor parameters.');
		} else if ((width <= 0 || height <= 0) || (width === 1 && height === 1)) {
			throw('invalid dimensions: ' + width.toString() + ' x ' + height.toString());
		}

		this.width      = typeof width === 'number' ? width : parseInt( width.toString(), 10 );
		this.height     = typeof height === 'number' ? height : parseInt( height.toString(), 10 );
		this.totalCells = this.width * this.height;

		this.reset();
	}

	/**
	 * Maakt het grid leeg en initialiseert de arrays.
	 */
	reset()
	{
		const zeroFill = Utility.getZeroFilledArray;

		this.creator     = null;
		this.cells       = [];
		this.rowHints    = [];
		this.columnHints = [];
		this.grid        = zeroFill( this.height ).map( () =>
		{
			return zeroFill( this.width );
		} );
	}

	/**
	 * NIEUW: Berekent het percentage van correct ingevulde "zwarte" blokjes.
	 * Dit wordt gebruikt voor de scherpte van de afbeelding.
	 * * @returns {number} Percentage tussen 0 en 100
	 */
	getFillProgress()
	{
		// Filter alle cellen die in de oplossing gevuld (1) moeten zijn
		const targetCells = this.cells.filter( cell => cell.solution === 1 );

		if (targetCells.length === 0) return 0;

		// Tel hoeveel van die cellen de gebruiker correct heeft ingevuld
		const correctFills = targetCells.filter( cell => cell.userSolution === 1 ).length;

		return (correctFills / targetCells.length) * 100;
	}

	/**
	 * Controleert of de volledige puzzel correct is opgelost.
	 * @returns {boolean}
	 */
	checkUserSolution()
	{
		return this.cells.every( ( cell ) =>
		{
			// De oplossing is 0 of 1, userSolution kan null, 0 (kruisje) of 1 (gevuld) zijn.
			// Voor de check behandelen we null en 0 als hetzelfde (niet gevuld).
			const userValue = cell.userSolution === 1 ? 1 : 0;

			return cell.solution === userValue;
		} );
	}

	/**
	 * Haalt alle cellen van een specifieke rij op.
	 * @param {number} row
	 * @returns {array|boolean}
	 */
	getRowCells( row )
	{
		const cells = [];
		let start   = row * this.width,
			end     = start + this.width,
			i
		;

		for (i = start; i < end; i++) {
			cells.push( this.cells[i] );
		}

		return cells.length > 0 ? cells : false;
	}

	/**
	 * Haalt alle cellen van een specifieke kolom op.
	 * @param {number} column
	 * @returns {array|boolean}
	 */
	getColumnCells( column )
	{
		const cells = [];
		let i;

		for (i = column; i < this.totalCells; i += this.width) {
			cells.push( this.cells[i] );
		}

		return cells.length > 0 ? cells : false;
	}
};