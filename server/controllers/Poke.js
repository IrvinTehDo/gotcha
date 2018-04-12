const models = require('../models');

const pokemonList = require('../pokemon.json');

/* eslint-disable */
const Poke = models.Poke;
/* eslint-enable */

const getRandomPokemon = () => {
  const pokeKeys = Object.keys(pokemonList);

  console.dir(pokemonList[Math.floor(Math.random() * pokeKeys.length) + 1]);
  return (pokemonList[Math.floor(Math.random() * pokeKeys.length) + 1]);
};

const makerPage = (req, res) => {
  Poke.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), pokes: docs });
  });
};

const catchPage = (req, res) => res.render('catch', { csrfToken: req.csrfToken() });

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

const makePoke = (req, res) => {
  const pokemon = getRandomPokemon();

  console.dir(pokemon);

  const pokeData = {
    name: pokemon.name,
    id: pokemon.id,
    img: pokemon.image_url,
    level: 0,
    owner: req.session.account._id,
  };

  const newPoke = new Poke.PokeModel(pokeData);

  const pokePromise = newPoke.save();

  pokePromise.then(() => res.json({ redirect: '/view' }));

  pokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Pokemon already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
};

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

module.exports.makerPage = makerPage;
module.exports.catchPage = catchPage;
module.exports.getPokes = getPokes;
module.exports.getRecentCatch = getRecentCatch;
module.exports.make = makePoke;
