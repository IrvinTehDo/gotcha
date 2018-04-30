const models = require('../models');

const pokemonList = require('../pokemon.json');

/* eslint-disable */
const Poke = models.Poke;
const Account = models.Account;
/* eslint-enable */

// Grabs a random pokemon object from our json master list and returns that object.
const getRandomPokemon = () => {
  const pokeKeys = Object.keys(pokemonList);
  return (pokemonList[Math.floor(Math.random() * pokeKeys.length) + 1]);
};

// Sends back a response of the csrf token and pokemons that the owner owns.
const makerPage = (req, res) => {
  Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), pokes: docs });
  });
};

// Sends back the request for the catch page
const catchPage = (req, res) => {
  res.render('catch', { csrfToken: req.csrfToken() });
};

// Does a query to our database for the amount of pokeballs/rolls
// the account has and sends it back as a response.
const getCatchPageInfo = (req, res) => {
  const rollQuery = Account.AccountModel.getRolls(req.session.account._id);
  rollQuery.exec((err, result) => res.json({
    rolls: result._doc.rolls,
    lastFreePokeaballUsed: result._doc.lastFreePokeaballUsed,
  }));
};

// Does a query to the database for the most recent catch
// and sends it back to the user as a response
const getRecentCatch = (req, res) => Poke.PokeModel.findByOwner(
  req.session.account._id,
  (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ catch: docs[docs.length - 1] });
  },
);

// Checks if we have enough pokeballs/rolls and if we do, create a random
// pokemon with a random level and remove a pokeball/roll from the account.
const makePoke = (req, res) => {
  const rollQuery = Account.AccountModel.getRolls(req.session.account._id);
  rollQuery.exec((err, result) => {
    console.dir(result._doc);
    if (result._doc.rolls > 0 ||
        result._doc.lastFreePokeballUsed === null ||
        Date.now() - result._doc.lastFreePokeaballUsed.getTime() > 3600000) {
      const pokemon = getRandomPokemon();
      const level = 0; // Math.floor(Math.random() * 100) + 1;
      console.dir(pokemon);

      const pokeData = {
        name: pokemon.name,
        id: pokemon.id,
        img: pokemon.image_url,
        level,
        owner: req.session.account._id,
      };

      const newPoke = new Poke.PokeModel(pokeData);

      const pokePromise = newPoke.save();

      try {
        Account.AccountModel.updateRolls(
          req.session.account._id, -1,
          result._doc.lastFreePokeaballUsed.getTime(),
        );
      } catch (e) {
        console.log(e);
      }

      pokePromise.then(() => res.json({ redirect: '/view' }));

      pokePromise.catch((error) => {
        console.log(error);
        if (error.code === 11000) {
          return res.status(400).json({ error: 'Pokemon already exists.' });
        }

        return res.status(400).json({ error: 'An error occurred' });
      });
    } else {
      return res.status(400).json({ error: 'Not enough pokeballs' });
    }

    return null;
  });
};

// Grabs every pokemon owned by the user and returns it in a response.

const getPokes = (request, response) => {
  const req = request;
  const res = response;

  return Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ pokes: docs });
  });
};

// Uses a Rare Candy
const useCandy = (request, response) => {
  const req = request;
  const res = response;

  const query = Account.AccountModel.getCandy(req.session.account._id);
  query.exec((err, result) => {
      // Make sure user has candy
    if (result._doc.rareCandy > 0) {
      try {
          // Attempt to take one candy away
        Account.AccountModel.updateCandy(req.session.account._id, -1, (err1) => {
          if (err1) {
            console.log(err1);
          }
        });
          // Attempt to level up a pokemon
        Poke.PokeModel.updateLevel(req.body.pokeId, 1, (error) => {
          if (error) {
            console.log(err);
          }
        });
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'An error occurred' });
      }
    } else {
      return res.status(400).json({ error: 'Not enough candy' });
    }

    return res.json({ data: ' ' });
  });
};

// Delete/Transfer a pokemon for a rarecandy
const transferPokemon = (request, response) => {
  const req = request;
  const res = response;


  try {
      // Add a rare candy
    Account.AccountModel.updateCandy(req.session.account._id, 1, (err1) => {
      if (err1) {
        console.log(err1);
      }
    });
      // Delete pokemon by their _id
    Poke.PokeModel.deleteById(req.body.pokeId);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ data: ' ' });
};

// Returns candy amount
const getCandyAmount = (request, response) => {
  const req = request;
  const res = response;

  const query = Account.AccountModel.getCandy(req.session.account._id);
  query.exec((err, result) => res.json({ candy: result._doc.rareCandy }));
};

module.exports.makerPage = makerPage;
module.exports.catchPage = catchPage;
module.exports.getCatchPageInfo = getCatchPageInfo;
module.exports.getPokes = getPokes;
module.exports.getRecentCatch = getRecentCatch;
module.exports.make = makePoke;
module.exports.useCandy = useCandy;
module.exports.transferPokemon = transferPokemon;
module.exports.getCandyAmount = getCandyAmount;
