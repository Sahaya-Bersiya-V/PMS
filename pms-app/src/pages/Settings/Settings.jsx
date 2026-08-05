import { useState } from "react";

import "./Settings.css";
import settingsCards from "./data";

import SettingCard from "./components/SettingCard";
import HotelInfoModal from "./components/HotelInfoModal";

const Settings = () => {

    const [openHotelModal, setOpenHotelModal] = useState(false);

    const handleCardClick = (card) => {

        if (card.title === "Hotel Information") {
            setOpenHotelModal(true);
        }

    };

    return (

        <div className="settings-page">

            

            <div className="settings-grid">

                {settingsCards.map((card) => (

                    <SettingCard
                        key={card.id}
                        card={card}
                        onClick={() => handleCardClick(card)}
                    />

                ))}

            </div>

            <HotelInfoModal
                isOpen={openHotelModal}
                onClose={() => setOpenHotelModal(false)}
            />

        </div>

    );

};

export default Settings;