const handlePoke = (e) =>{
    e.preventDefault();
    
    $("#pokeMessage").animate({ width: 'hide'}, 350);
    
    sendAjax('POST', $("#pokeForm").attr("action"), $("#pokeForm").serialize(), function() {
        sendAjax('GET', '/getRecentCatch', null, (data) => {
            console.dir(data);
            ReactDOM.render(
                <CatchFrame catch={data.catch} />, document.querySelector("#capturedPokemon")
            );
        })
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

const CatchFrame = (props) => {
    if (props.catch) {
        return (
            <div key={props.catch._id} className="poke">
                <img src={props.catch.img} alt="Pokeball" className="pokeBall" />
                <h3 className="pokeName"> Name: {props.catch.name} </h3>
                <h3 className="pokeAge"> Level: {props.catch.level} </h3>
            </div>
        ); 
    } else {
        return (
            <div className="pokeList">
                <h3 className="emptyPoke">No Pokemons yet</h3>
            </div>
        );
    }
};

const renderPokeForm = (csrf) => {
    ReactDOM.render(
        <PokeForm csrf={csrf} />, document.querySelector("#makePoke")
    );
    
    ReactDOM.render(
        <CatchFrame/>, document.querySelector("#capturedPokemon")
    );
};

