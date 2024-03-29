import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import { useSelector } from 'react-redux'
import { SearchPokemon } from '../../api/pokemon/pokemonAPI'
import ViewPokemonContainer from './ViewPokemonContainer'
import { getTeams } from '../../api/teams/teamAPI'

const SearchPokemonContainer = () => {
    const { userToken } = useSelector((state: any) => state.auth);
    const [message, setMessage] = useState(false);
    const [pokemonName, setPokemonName] = useState({
        pokemon_name: ""
    })
    const [pokemon, setPokemon] = useState({
        pokemon_name: "",
        height: "",
        weight: "",
        base_experience: "",
        stats: [],
        types: [],
        sprites: ""
    });

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const searchPokemon = await SearchPokemon(userToken, pokemonName);
            setMessage(searchPokemon.response);
            if (searchPokemon.response) setPokemon({...pokemon, 
                pokemon_name: searchPokemon.message.name,
                height: searchPokemon.message.height,
                weight: searchPokemon.message.weight,
                base_experience: searchPokemon.message.base_experience,
                stats: searchPokemon.message.stats,
                types: searchPokemon.message.types,
                sprites: searchPokemon.message.sprites.front_default
            });
        } catch (error: any) {
            console.log("error: ", error);
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="pokemonName">
                    <Form.Label className="text-center mt-4"><h1>Search For Pokemon</h1></Form.Label>
                    <Form.Control type="text" placeholder="Enter pokemon name" required
                        onChange={(event) => setPokemonName({ ...pokemonName, pokemon_name: event.target.value })} />
                    <Button variant="success" type="submit" className='my-4'>
                        Search
                    </Button>
                </Form.Group>
            </Form>

            {message ? <ViewPokemonContainer 
            pokemon={pokemon} 
            setPokemon={setPokemon} 
            />: <h3>Pokemon name not found</h3>}

        </div>
    )
}

export default SearchPokemonContainer