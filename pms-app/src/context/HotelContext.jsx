import { createContext, useContext, useState } from "react";

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {

    const [guests, setGuests] = useState([]);

    const [reservations, setReservations] = useState([]);

    const saveReservation = (reservation) => {

        setReservations(prev => [...prev, reservation]);

        const existingGuest = guests.find(
            g => g.phone === reservation.guest.phone
        );

        if (existingGuest) {

            setGuests(prev =>
                prev.map(g =>
                    g.phone === reservation.guest.phone
                        ? {
                              ...g,
                              visits: g.visits + 1,
                          }
                        : g
                )
            );

        } else {

            setGuests(prev => [
                ...prev,
                {
                    id: Date.now(),
                    guestName: reservation.guest.guestName,
                    phone: reservation.guest.phone,
                    email: reservation.guest.email,
                    city: reservation.guest.city,
                    membership: "Regular",
                    visits: 1,
                    status: "Active",
                    ...reservation.guest,
                },
            ]);

        }

    };

    return (

        <HotelContext.Provider
            value={{
                guests,
                reservations,
                saveReservation,
                setGuests,
            }}
        >

            {children}

        </HotelContext.Provider>

    );

};

export const useHotel = () => useContext(HotelContext);