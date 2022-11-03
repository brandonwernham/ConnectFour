import './App.css';
import React from 'react';

export default class App extends React.Component {
  // Represents the state of the game and helps create the board
  state = {
    rows: 6,
    columns: 7,
    moves: [],
    playerTurn: 'red',
  };

  // Resets the board and clears it
  resetBoard = () => {
    this.setState({moves: [], winner: null});
  }

  // Takes coordinates to get where the piece was placed
  getPiece = (x , y) => {
    const list = this.state.moves.filter((item) => {
      return (item.x === x && item.y === y);
    });
    return list[0];
  }

  // Checks if the players have used up 42 turns to fill the board
  checkForDraw = () => {
    if (this.state.moves.length === 42) {
      return true;
    }
  }

  // Checks the vector in which you line your color with
  getWinningVector = (xPos, yPos, xVel, yVel) => {
    const winningMoves = [{x: xPos, y: yPos}];
    const player = this.getPiece(xPos, yPos).player;

    // Checks the up side
    for (let delta = 1; delta <= 3; delta += 1) {
      const checkX = xPos + xVel * delta;
      const checkY = yPos + yVel * delta;

      const checkPiece = this.getPiece(checkX, checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y: checkY});
      } else {
        break;
      }
    }

    // Checks the down side
    for (let delta = -1; delta >= -3; delta -= 1) {
      const checkX = xPos + xVel * delta;
      const checkY = yPos + yVel * delta;

      const checkPiece = this.getPiece(checkX, checkY);
      if (checkPiece && checkPiece.player === player) {
        winningMoves.push({x: checkX, y: checkY});
      } else {
        break;
      }
    }

    return winningMoves;
  }

  // Checks if there are 4 or more pieces in a row for same color
  checkForWin = (x, y) => {
    const velocities = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: 1, y: 1}];
    for (let dex = 0; dex < velocities.length; dex++) {
      const element = velocities[dex];
      const winningMoves = this.getWinningVector(x, y, element.x, element.y);
      if (winningMoves.length > 3) {
        this.setState({winner: this.getPiece(x, y).player, winningMoves});
      }
    }
  }

  // Switches turns addung pieces to the board
  addMove = (x, y) => {
    const {playerTurn} = this.state;
    const nextPlayerTurn = playerTurn === 'red' ? 'yellow' : 'red';
    this.setState({moves: this.state.moves.concat({x, y, player: playerTurn}), playerTurn: nextPlayerTurn}, 
    () => this.checkForWin(x ,y, playerTurn));
  }

  // Creates and fills out the entire structre of the board
  renderBoard() {
    // eslint-disable-next-line
    const {rows, columns, winner} = this.state;
    const rowViews = [];

    for (let row = 0; row < this.state.rows; row += 1) {
      const columnViews = [];
      for (let column = 0; column < this.state.columns; column += 1) {
        const piece = this.getPiece(column, row);
        columnViews.push(
          <div style={{width: '7vw', height: '7vw', backgroundColor: '#3b86ff', 
          display: 'flex', padding: 5, cursor: 'pointer'}}>
            <button onClick={() => {this.addMove(column, row)}} style={{width: '7vw', height: '7vw', borderRadius: '50%', 
            backgroundColor: 'white', flex: 1, display: 'flex', padding: 0}}>
              {piece ? <button disabled style={{width: '7vw', height: '7vw', position: 'absolute', bottom: '5px', right: '5px', 
              borderRadius: '50%', backgroundColor: piece.player, flex: 1, display: 'flex'}}/>: undefined}
            </button>
          </div>
        );
      }
      rowViews.push(
        <div style={{display: 'flex', flexDirection: 'row'}}>{columnViews}</div>
      )
    }

    // If the board is filled up, resets tehe board right away
    if (this.checkForDraw()) {
      this.resetBoard();
    }

    return (
      <div style={{backgroundColor: 'black', display: 'flex', flexDirection: 'column'}}>
        {winner && <div onClick={this.resetBoard} style={{position: 'absolute', left:0 , right: 0, bottom: 0, top: 0, zIndex: 3, 
        backgroundColor: 'rgba(0, 0, 0, .8)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', 
        fontWeight: '200', fontSize: '6vw'}}>
          {`${winner.toUpperCase()} WINS!!!`} <br></br> {`Click Board To Reset`}
        </div>}
        {rowViews}
      </div>
    );
  }

  render() {
    const {style} = this.props;

    return (
      <div style={style ? Object.assign({}, styles.container, style) : styles.container}>
        <div>
          {this.renderBoard()}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100%',
    padding: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};