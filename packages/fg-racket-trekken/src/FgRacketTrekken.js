// eslint-disable-next-line import/no-unresolved
import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';
// eslint-disable-next-line import/no-unresolved
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.73/dist/components/button/button.js';
// eslint-disable-next-line import/no-unresolved
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.73/dist/components/input/input.js';
import { contestants } from "./spelers.js";

export class FgRacketTrekken extends LitElement {
  static get properties() {
    return {
      title: {type: String},
      computations: {type: Number},
      lowerDepths: {type: Array},
      players: {type: Array},
      games: {type: Object},
      game: {type: Object},
      round: {type: Number}
    }
  }

  static get styles() {
    return [
      css`
      .page-container {
        text-align: center;
        margin-top: 64px;
      }

      .card {
        min-width: 400px;
      }

      .card__content {
        text-align: left;
      }

      .intro {
        display: inline-block;
        margin: 0 auto;
      }

      .input {
        display: inline-block;
        margin-right: 8px;
      }

      .input_rating, .input_sex {
        width: 50px;
      }

      .submit {
        margin-bottom: 32px;
        margin-left: 8px;
      }

      .create {
        margin: 24px;
      }

      .even {
        background-color: #dae5f7;
      }

    `];
  }

  constructor() {
    super();
    this.title = 'UTC Rackettrekken';
    this.player = {
      games_played: 0,
      games_played_in_succession: 0,
      pauzes: 0,
      name: '',
      rating: 0,
      played_with: [''],
      state: 0,
    }
    const players = localStorage.getItem('players') ? localStorage.getItem('players') : [];
    this.players = players.length === 0 ? players : JSON.parse(players);
    // this.players = contestants;
    // this.players = contestants;
    this.games = [];
    for (let i = 0; i < 5; i += 1) {
      Object.keys(localStorage)
        .filter(key => key.startsWith(`games ${i + 1}`))
        .forEach(
          key => {
            const game = localStorage.getItem(key)
            if (game){this.games.push(JSON.parse(game))}
          }
        )
    }
    this.game = {
      player1: {},
      player2: {},
      player3: {},
      player4: {}
    };
    this.round = localStorage.getItem('round') ? parseInt(localStorage.getItem('round'), 10) : 0;
  }

  handleSubmit(e) {
    const playerValue = e.target.parentElement.querySelector('#player').value;
    const ratingValue = e.target.parentElement.querySelector('#rating').value;
    const playerSex = e.target.parentElement.querySelector('#sex').value;
    this.player = {
      name: playerValue,
      rating: parseInt(ratingValue[0],10),
      sex: playerSex,
      games_played: 0,
      state: 0,
      pauzes: 0,
      games_played_in_succession: 0,
      played_with: [''],
    }
    this.players.push(this.player);
    e.target.parentElement.querySelector('#player').value = '';
    e.target.parentElement.querySelector('#rating').value = '';
    e.target.parentElement.querySelector('#sex').value = '';
    localStorage.setItem('players',JSON.stringify(this.players));

    this.requestUpdate();
  }

  firstUpdated() {
    const players = localStorage.getItem('players') ? localStorage.getItem('players') : [];
    this.players = players.length === 0 ? players : JSON.parse(players);
    // this.players = contestants;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  setPauze(women, men) {
    const numberOfPauzes = (women + men) < 17 ? (women + men) %4 : (women + men) - 12;
    console.log('women', women, 'men', men, 'pauzes', numberOfPauzes);

    this.players.sort((a, b)=> b.games_played_in_succession - a.games_played_in_succession);
    this.players.sort((a, b)=> a.pauzes - b.pauzes);
    for (let i = 0; i < numberOfPauzes; i+=1) {
      // eslint-disable-next-line no-param-reassign
      // men = this.players.filter((player)=>player.sex === 'm').length;
      // let pauzePlayer = {};
      // switch (true) {
      //   case (men > 3):
      //     console.log('genoeg mannen');
      //     break;
      //   case (men > 1 && men < 4):
      //     console.log('niet genoeg voor HD')
      //     break;
      //   case (men > 0 && men < 2):
      //     console.log('niet genoeg voor MD')
      //     pauzePlayer = this.players.find(player => player.state < this.round && player.sex === 'm' )
      //     break;
      //   default:
      //     console.log('er is iets fout gegaan')
      // }
      // switch (true) {
      //   case (women > 3):
      //     console.log('genoeg vrouwen');
      //     break;
      //   case (women > 1 && women < 4):
      //     console.log('niet genoeg voor DD')
      //     break;
      //   case (women > 0 && women < 2):
      //     console.log('niet genoeg voor MD')
      //     pauzePlayer = this.players.find(player => player.state < this.round && player.sex === 'f' )
      //     break;
      //   default:
      //     console.log('er is iets fout gegaan')
      // }
      // const index = this.players.indexOf(pauzePlayer) >= 0 ? this.players.indexOf(pauzePlayer) : i;

      this.players[i].pauzes += 1;
      this.players[i].state = this.round;
    }
    localStorage.setItem('players',JSON.stringify(this.players));
  }

  handleCreate () {
    this.round += 1;
    localStorage.setItem('round', this.round);
    this.shuffleArray(this.players);
    localStorage.setItem('players',JSON.stringify(this.players));
    const numberOfGames = Math.floor(this.players.length / 4) < 4 ? Math.floor(this.players.length / 4) : 3;
    let amountOfMen = this.players.filter((player)=>player.sex === 'm').length;
    let amountOfWomen = this.players.length - amountOfMen;
    const types = ['MD', 'DD', 'HD', 'MD', 'MD'];
    console.log('men women gamnes', amountOfMen, amountOfWomen, numberOfGames);

    for(let i = 0; i < numberOfGames; i+=1){
      amountOfMen = this.players.filter((player)=>player.sex === 'm'&& player.state < this.round).length;
      amountOfWomen = this.players.filter((player)=>player.sex === 'f'&& player.state < this.round).length;
      let total = amountOfMen + amountOfWomen;
      if (this.round > 1 && i === (numberOfGames - 1) && total > 4 ) {this.setPauze(amountOfWomen, amountOfMen)}
      amountOfMen = this.players.filter((player)=>player.sex === 'm'&& player.state < this.round).length;
      amountOfWomen = this.players.filter((player)=>player.sex === 'f'&& player.state < this.round).length;
      total = amountOfMen + amountOfWomen;
      console.log('verdeling', amountOfWomen, amountOfMen, total);
      if (amountOfWomen > 3 && amountOfMen > 3) {
        this.shuffleArray(types);
        this.createGame(this.round, types[0]);
        console.log('hc 1')
      } else if (amountOfWomen > 1 && amountOfMen > 1 ) {
        this.createGame(this.round, 'MD');
        console.log('hc 2')
      } else if (amountOfMen < 2 && total > 3) {
        this.createGame(this.round, 'DD');
        console.log('hc 3')
      } else if (amountOfWomen < 2 && total > 3) {
        this.createGame(this.round, 'HD');
        console.log('hc 4')
      }
    }
    const pausedPlayers = this.players.filter(player => player.state < this.round);
    pausedPlayers.forEach(player => {
      // eslint-disable-next-line no-param-reassign
      player.pauzes += 1;
      // eslint-disable-next-line no-param-reassign
      player.state = this.round;
      // eslint-disable-next-line no-param-reassign
      player.games_played_in_succession = 0;
    })
  }

  getPlayers(player1, gameRating, sexOfFirstPlayer, round, i, type = 'MD') {
    const numberOfPlayer = i + 2;
    const oppositeSex = sexOfFirstPlayer === 'f' ? 'm' : 'f';
    const typeSex = type === 'DD' || type === 'HD' || type === 'SD' ? sexOfFirstPlayer : oppositeSex;

    // eslint-disable-next-line no-nested-ternary
    const playerSex = numberOfPlayer > 2 ? typeSex : sexOfFirstPlayer;
    console.log('getPlayers', player1, gameRating, sexOfFirstPlayer, round, i, type);
    const gamePlayer0 = this.players.filter(player =>
      (player.rating === gameRating || player.rating === (gameRating + 1) || player.rating === (gameRating - 1))
      && player.sex === playerSex
      && player.state < round
      && player.games_played_in_succession === 0);
    if (gamePlayer0.length) {
      const index = this.players.indexOf(gamePlayer0[0]);
      this.players[index].state = round;
      this.players[index].games_played += 1;
      this.players[index].games_played_in_succession += 1;
      localStorage.setItem('players',JSON.stringify(this.players));
      console.log(`player ${i + 2} found with filter iteration ${gamePlayer0[0].name}`);
      return gamePlayer0[0];
    }
    const gamePlayer1 = this.players.find(player =>
      player.rating === gameRating
      && player.sex === playerSex
      && player.state < round);
    if (gamePlayer1) {
      const index = this.players.indexOf(gamePlayer1);
      this.players[index].state = round;
      this.players[index].games_played += 1;
      this.players[index].games_played_in_succession += 1;
      localStorage.setItem('players',JSON.stringify(this.players));
      console.log(`player ${i + 2} found in first iteration ${gamePlayer1.name}`);
      return gamePlayer1;
    }
    const gamePlayer2 = this.players.find(player =>
      player.rating === ((gameRating - 1))
      && player.sex === playerSex
      && player.state < round);
    if (gamePlayer2){
      const index = this.players.indexOf(gamePlayer2);
      this.players[index].state = round;
      this.players[index].games_played += 1;
      this.players[index].games_played_in_succession += 1;
      localStorage.setItem('players',JSON.stringify(this.players));
      console.log(`player ${i + 2} found in second iteration ${gamePlayer2.name}`);
      return gamePlayer2;
    }
    const gamePlayer3 = this.players.find(player =>
      player.rating === ((gameRating + 1))
      && player.sex === playerSex
      && player.state < round);
    if (gamePlayer3) {
      const index = this.players.indexOf(gamePlayer3);
      this.players[index].state = round;
      this.players[index].games_played += 1;
      this.players[index].games_played_in_succession += 1;
      localStorage.setItem('players',JSON.stringify(this.players));
      console.log(`player ${i + 2} found in third iteration ${gamePlayer3.name}`);
      return gamePlayer3;
    }
    const gamePlayer4 = this.players.find(player =>
      player.rating === ((gameRating - 2))
      && player.sex === playerSex
      && player.state < round);
    if (gamePlayer4) {
      const index = this.players.indexOf(gamePlayer4);
      this.players[index].state = round;
      this.players[index].games_played += 1;
      this.players[index].games_played_in_succession += 1;
      localStorage.setItem('players',JSON.stringify(this.players));
      console.log(`player ${i + 2} found in fourth iteration ${gamePlayer4.name}`);
      return gamePlayer4;
    }
    const gamePlayer5 = this.players.find(player =>
      player.rating === ((gameRating + 2))
      && player.sex === playerSex
      && player.state < round);
    if (gamePlayer5) {
      const index = this.players.indexOf(gamePlayer5);
      this.players[index].state = round;
      this.players[index].games_played += 1;
      this.players[index].games_played_in_succession += 1;
      localStorage.setItem('players',JSON.stringify(this.players));
      console.log(`player ${i + 2} found in fifth iteration ${gamePlayer5.name}`);
      return gamePlayer5;
    }
    const gamePlayer6 = this.players.find(player => player.state < round);
    const index = this.players.indexOf(gamePlayer6);
    this.players[index].state = round;
    this.players[index].games_played += 1;
    this.players[index].games_played_in_succession += 1;
    localStorage.setItem('players',JSON.stringify(this.players));
    console.log(`player ${i + 2} found in fifth iteration ${gamePlayer6.name}`);
    return gamePlayer6;
  }

  createGame(round, type) {
    const game = [];
    // eslint-disable-next-line no-nested-ternary
    const playerSex = type === 'DD' ? 'f' : type === 'HD' ? 'm' : '';
    this.players.sort(( a, b) => {
      return a.games_played_in_succession - b.games_played_in_succession;
    });
    localStorage.setItem('players',JSON.stringify(this.players));
    // create game with first player
    if ( round === 1 && playerSex) {
      game.player1 = this.players.find(player => player.state < round && player.sex === playerSex );
      game.round = round;
      console.log('cg 1');
    } else if ( round === 1 && !playerSex) {
      game.player1 = this.players.find(player => player.state < round );
      game.round = round;
      console.log('cg 2');
    } else if (this.players.find(player => player.state < round && player.pauzes > 0)
      && playerSex
      && this.players.find(player => player.state < round && player.pauzes > 0 && player.sex === playerSex)){
        game.player1 = this.players.find(player => player.state < round && player.pauzes > 0 && player.sex === playerSex)
        game.round = round;
      console.log('cg 3');
    } else if (this.players.find(player => player.state < round ) && playerSex) {
      game.player1 = this.players.find(player => player.state < round);
      game.round = round;
      console.log('cg 4');
    }  else if (this.players.find(player => player.state < round && player.pauzes > 0 )){
        game.player1 = this.players.find(player => player.state < round && player.pauzes > 0 )
        game.round = round;
        console.log('cg 5');
    } else {
      game.player1 = this.players.find(player => player.state < round );
      game.round = round;
      console.log('cg 6');
    }

    const index = this.players.indexOf(game.player1);
    this.players[index].state = round;
    this.players[index].games_played += 1;
    this.players[index].games_played_in_succession += 1;
    localStorage.setItem('players',JSON.stringify(this.players));

    // properties of game 1
    const gameRating = game.player1.rating;
    const sexOfFirstPlayer = game.player1.sex;

    for(let i = 0; i < 3; i+=1) {
      const player = this.getPlayers(game.player1, gameRating, sexOfFirstPlayer, round, i, type);
      if ( i === 0 ) {
        game.player2 = player;
        game.round = round;
      } else if ( i === 1) {
        game.player3 = player;
        game.round = round;
      } else {
        game.player4 = player;
        game.round = round;
      }
    }
    const objectGame = Object.assign({}, game);
    // eslint-disable-next-line no-restricted-globals
    const uuid = self.crypto.randomUUID();
    localStorage.setItem(`games ${round} - ${uuid}`, JSON.stringify(objectGame));
    this.games.push(game);

    console.log(this.games);
    this.requestUpdate()
  }

  handleClear() {
    localStorage.clear();
    this.round = 0;
    localStorage.setItem('round', this.round);
    this.requestUpdate();
  }

  handleRemove(i) {
    this.players.splice(i,1);
    localStorage.setItem('players',JSON.stringify(this.players));
    this.requestUpdate();
  }

  render() {
    const { players, games } = this;
    return html`
      <ing-example-nav-bar></ing-example-nav-bar>
      <div class="page-container">
        <div class="card intro">
          <div class="card__content">
            <h2>${this.title}</h2>
            <form action="">
              <sl-input name="player" id="player" class="input" label="Player"></sl-input><sl-input name="rating" id="rating" class="input input_rating" label="Rating"></sl-input><sl-input name="sex" id="sex" class="input input_sex" label="Sex"></sl-input>
              <sl-button class="submit" variant="primary" @click="${(e)=>this.handleSubmit(e)}">Submit</sl-button>  <sl-button variant="neutral" class="submit" @click="${()=>this.handleClear()}">Clear all</sl-button>
            </form>

            <table>
              <tr>
                <th>Nr</th>
                <th>Round</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Games played</th>
                <th>Pauzes</th>
                <th>Played with</th>
                <th>Games played in succ</th>
                <th>Remove player</th>
              </tr>
              ${players.map((player, i) => {
                return html`
                  <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                    <td>${i+1}</td>
                    <td>${player.state}</td>
                    <td>${player.name}</td>
                    <td>${player.rating}</td>
                    <td>${player.games_played}</td>
                    <td>${player.pauzes}</td>
                    <td>${player.played_with}</td>
                    <td>${player.games_played_in_succession}</td>
                    <td><sl-button variant="warning" size="small" @click="${()=>this.handleRemove(i)}">Remove</sl-button></td>
                  </tr>
                `
              })}

            </table>
            <sl-button variant="success" class="create" @click="${(e)=>this.handleCreate(e)}">Create games</sl-button>
            <table>
              <tr>
                <th>nr</th>
                <th>Round</th>
                <th>Player1</th>
                <th>Player2</th>
                <th>Player3</th>
                <th>Player4</th>
              </tr>
              ${games.map((game, i) => {
                return html`
                  <tr>
                    <td>${i+1}</td>
                    <td>${game.round}</td>
                    <td>${game.player1.name}</td>
                    <td>${game.player2.name}</td>
                    <td>${game.player3.name}</td>
                    <td>${game.player4.name}</td>
                  </tr>
                `
              })}

            </table>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('fg-racket-trekken', FgRacketTrekken);
