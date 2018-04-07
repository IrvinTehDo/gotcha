const handlePoke = (e) =>{
    e.preventDefault();
    
    $("#pokeMessage").animate({ width: 'hide'}, 350);
    
    sendAjax('POST', $("#pokeForm").attr("action"), $("#pokeForm").serialize(), function() {
       loadPokesFromServer(); 
    });
    
    return false;
}

const PokeForm = (props) => {
    return (
        <form id="pokeForm"
            onSubmit={handlePoke}
            name="pokeForm"
            action="/catch"
            method="POST"
            className="pokeForm"
            >
             <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="catchPokeSubmit" type="submit" value="Catch Pokemon" />
            
        </form>
    );
};

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

const setup = function(csrf) {
    ReactDOM.render(
        <PokeForm csrf={csrf} />, document.querySelector("#makePoke")
    );
    
    ReactDOM.render(
        <PokeForm pokes={[]} />, document.querySelector("#pokes")
    );
    
    loadPokesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});