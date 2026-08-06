import { FaTimes } from "react-icons/fa";

import RoomTile from "../../RoomsOverview/components/RoomTile";

import "./RoomCategoryModal.css";

const RoomCategoryModal = ({
    isOpen,
    onClose,
    category,
}) => {

    if (!isOpen || !category) return null;

    return (

        <div className="room-category-overlay">

            <div className="room-category-modal">

                <div className="room-category-modal-header">

                    <h2>{category.category}</h2>

                    <button onClick={onClose}>

                        <FaTimes />

                    </button>

                </div>

                <div className="room-category-modal-body">

                    <div className="room-grid">

                        {category.rooms.map(room => (

                            <RoomTile
                                key={room.roomNo}
                                room={room}
                            />

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default RoomCategoryModal;