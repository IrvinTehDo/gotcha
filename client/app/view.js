const PokeList = (props) => {
    console.dir(props);
    if(props.pokes.length === 0) {
        return (
            <div className="pokeList">
                <h3 className="emptyPoke">No Pokemons yet</h3>
            </div>
        );
    }
    
    const pokeNodes = props.pokes.map( (poke) => {
        return (
            <div key={poke._id} className="poke">
                <img src={poke.img} alt="Pokeball" className="pokeBall" />
                <h3 className="pokeName"> Name: {poke.name} </h3>
                <h3 className="pokeAge"> Level: {poke.level} </h3>
            </div>
        ); 
    });
    
    return (
    <div className="pokeList">
            {pokeNodes}
        </div>
    );
};

const loadPokesFromServer = () => {
    sendAjax('GET', '/getPokes', null, (data) => {
        ReactDOM.render(
            <PokeList pokes={data.pokes} />, document.querySelector("#pokes")
        );
    })
}

const renderPokeList = (csrf) => {
    ReactDOM.render(
        <PokeList pokes={[]} />, document.querySelector("#pokes")
    );
    
    loadPokesFromServer();
}

const setup = function(csrf) {
    if(document.querySelector("#pokes")) {
        renderPokeList(csrf);
    }
    if(document.querySelector("#makePoke")){
        renderPokeForm(csrf);
    }
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});