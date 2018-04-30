// Sends a request to the server that we want to catch 
// a new pokemon and then get the most recent one on the list back.
const handlePoke = (e) =>{
    e.preventDefault();
    
    $("#pokeMessage").animate({ width: 'hide'}, 350);
    
    sendAjax('POST', $("#pokeForm").attr("action"), $("#pokeForm").serialize(), function() {
        sendAjax('GET', '/getRecentCatch', null, (data) => {
            console.dir(data);
            ReactDOM.render(
                <CatchFrame catch={data.catch} />, document.querySelector("#capturedPokemon")
            );
        });
        // Get Catch Page Info, in this case it's just how many pokeballs we have left.
        getCatchPageInfo();
    });
    
    return false;
}

// Button to request a capture
const PokeForm = (props) => {
    return (
        <form id="pokeForm"
            onSubmit={handlePoke}
            name="pokeForm"
            action="/catch"
            method="POST"
            className="pokeForm"
            >
            <fieldset>
             <input type="hidden" name="_csrf" value={props.csrf} />
            <button type="submit" className="btn btn-info btn-lg btn-block">Catch Pokemon</button>
                </fieldset>
        </form>
    );
};

// Holds and creates roll count
const RollCount = (props) => {
    return (
        <div>
            <h2>Pokeballs: {props.rolls}</h2>
        </div>
    )
}


// Lets the user know how much time left until their next free roll.
const FreeRollTimer = (props) => {
    console.dir(props);
    var curTime = new Date().getTime();
    const countFrom = Date.parse(props.lastFreePokeaballUsed) + 3600000;
    var length = countFrom - curTime;
    
    let dateText = "";
    
    if(length > 0){
        var h = Math.floor((length %(1000*60*60*24))/ (1000*60*60));
        var m = Math.floor((length %(1000*60*60)) / (1000 * 60));
        dateText = `Free Pokeball in: ${h} Hours ${m} Min`;
    } else {
        dateText = "Free Pokeball is Available"
    }
            

    return (
        <div>
            <h2>{dateText}</h2>
        </div>
    );
}

//Displays our most recently captured pokemon
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
                <h3 className="emptyPoke">No Pokemon captured recently</h3>
            </div>
        );
    }
};

//Requests amount of pokeballs we have left
const getCatchPageInfo = () => {
        sendAjax('GET', '/getCatchPageInfo', null, (data) => {
        ReactDOM.render(
            <section>
            <RollCount rolls={data.rolls} />
                <FreeRollTimer lastFreePokeaballUsed={data.lastFreePokeaballUsed} />
            </section>
            , document.querySelector("#rollCount")
        );
    });
};

//Render our page
const renderPokeForm = (csrf) => {
    ReactDOM.render(
        <PokeForm csrf={csrf} />, document.querySelector("#makePoke")
    );
    
    ReactDOM.render(
        <CatchFrame/>, document.querySelector("#capturedPokemon")
    );
    
    getCatchPageInfo();
};

