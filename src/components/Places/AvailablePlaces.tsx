import { useState, useEffect } from 'react'
import Places from '../Places/Places'
import Error from '../Error/Error'
import { sortPlacesByDistance } from '../../loc.js'
import { fetchAvailablePlaces } from '../../http.js'

const AvailablePlaces = ({ onSelectPlace }) => {
    const [isFetching, setIsFetching] = useState(false)
    const [availablePlaces, setAvailablePlaces] = useState([])
    const [error, setError] = useState()

    useEffect(() => {
        /* To use async in React */
        async function fetchPlaces() {
            setIsFetching(true)

            try {
                const places = await fetchAvailablePlaces()

                /* Note: Allow Geolocation permission in user device settings for this to work  */
                navigator.geolocation.getCurrentPosition((position) => {
                    const sortedPlaces = sortPlacesByDistance(
                        places,
                        position.coords.latitude,
                        position.coords.longitude
                    )
                    setAvailablePlaces(sortedPlaces)
                    setIsFetching(false)
                })
            } catch (error) {
                if (error instanceof TypeError) {
                    setError({
                        message:
                            'Could not fetch places, please try again later.',
                    })
                    setIsFetching(false)
                }
            }
        }

        fetchPlaces()

        /* First Implementation */
        // fetch('http://localhost:3000/places')
        //     .then((res) => res.json())
        //     .then((resData) => {
        //         console.log('ResData: ==>', resData)
        //         setAvailablePlaces(resData.places)
        //     })
    }, [])

    if (error) {
        return <Error title="An Error occured!" message={error.message} />
    }

    return (
        <Places
            title="Available Places"
            places={availablePlaces}
            isLoading={isFetching}
            loadingText="Fetching place data..."
            fallbackText="No places available"
            onSelectPlace={onSelectPlace}
        />
    )
}

export default AvailablePlaces
