import { useRef, useState, useEffect, useCallback } from 'react'

import Places from './components/Places/Places'
import Modal from './components/Modal/Modal'
import DeleteConfirmation from './components/Confirmation/DeleteConfirmation'
import AvailablePlaces from './components/Places/AvailablePlaces'
import Error from './components/Error/Error'

import { fetchUserPlaces, updateUserPlaces } from './http.js'

import logoImg from './assets/logo.png'

const App = () => {
    const selectedPlace = useRef()

    const [userPlaces, setUserPlaces] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState()
    const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState()
    const [modalIsOpen, setModalIsOpen] = useState(false)

    useEffect(() => {
        const fetchPlaces = async () => {
            setIsFetching(true)

            try {
                const places = await fetchUserPlaces()
                setUserPlaces(places)
            } catch (error) {
                setError({
                    message: error.message || 'Failed to fetch user places.',
                })
            }

            setIsFetching(false)
        }

        fetchPlaces()
    }, [])

    const handleStartRemovePlace = (place) => {
        setModalIsOpen(true)
        selectedPlace.current = place
    }

    const handleStopRemovePlace = () => {
        setModalIsOpen(false)
    }

    const handleSelectPlace = async (selectedPlace) => {
        setUserPlaces((prevPickedPlaces) => {
            if (!prevPickedPlaces) {
                prevPickedPlaces = []
            }
            if (
                prevPickedPlaces.some((place) => place.id === selectedPlace.id)
            ) {
                return prevPickedPlaces
            }
            return [selectedPlace, ...prevPickedPlaces]
        })

        try {
            await updateUserPlaces([selectedPlace, ...userPlaces])
        } catch (error) {
            setUserPlaces(userPlaces)
            setErrorUpdatingPlaces({
                message: error.message || 'Failed to update places.',
            })
        }
    }

    const handleRemovePlace = useCallback(
        async function handleRemovePlace() {
            setUserPlaces((prevPickedPlaces) =>
                prevPickedPlaces.filter(
                    (place) => place.id !== selectedPlace.current?.id
                )
            )

            try {
                await updateUserPlaces(
                    userPlaces.filter(
                        (place) => place.id !== selectedPlace.current?.id
                    )
                )
            } catch (error) {
                setUserPlaces(userPlaces)
                setErrorUpdatingPlaces({
                    message: error.message || 'Failed to delete place.',
                })
            }

            setModalIsOpen(false)
        },
        [userPlaces]
    )

    const handleError = () => {
        setErrorUpdatingPlaces(null)
    }

    return (
        <>
            <Modal open={errorUpdatingPlaces}>
                {errorUpdatingPlaces && (
                    <Error
                        title="An error occured!"
                        message={errorUpdatingPlaces.message}
                        onConfirm={handleError}
                    />
                )}
            </Modal>
            <Modal open={modalIsOpen} onClose={handleRemovePlace}>
                <DeleteConfirmation
                    onCancel={handleStopRemovePlace}
                    onConfirm={handleRemovePlace}
                />
            </Modal>

            <header>
                <img src={logoImg} alt="Stylized Globe" />
                <h1>PlacePicker</h1>
                <p>
                    Create your personal collection of places you would like to
                    visit or you have visited.
                </p>
            </header>

            <main>
                {error && (
                    <Error title="An error occured!" message={error.message} />
                )}
                {!error && (
                    <Places
                        title="I'd like to visit..."
                        fallbackText={
                            'Select the places you would like to visit below'
                        }
                        isLoading={isFetching}
                        loadingText="Fetching your places..."
                        places={userPlaces}
                        onSelectPlace={handleStartRemovePlace}
                    />
                )}
                <AvailablePlaces onSelectPlace={handleSelectPlace} />
            </main>
        </>
    )
}

export default App
