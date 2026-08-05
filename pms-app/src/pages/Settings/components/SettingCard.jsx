import "./SettingCard.css";

import { FaArrowRight } from "react-icons/fa";

const SettingCard = ({ card,onClick }) => {

    const Icon = card.icon;

    return (

        <div className="setting-card">

            <div
                className="setting-icon"
                style={{background:card.color}}
            >
                <Icon />
            </div>

            <h3>{card.title}</h3>

            <p>{card.description}</p>

            <button onClick={onClick}>

    Configure

    <FaArrowRight/>

</button>

        </div>

    );

};

export default SettingCard;