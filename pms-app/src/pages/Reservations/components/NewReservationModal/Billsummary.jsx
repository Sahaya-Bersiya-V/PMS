import "./BillSummary.css";

const BillSummary = ({ rooms }) => {
     console.log("Rooms:", rooms);

    const roomRent = rooms.reduce(
        (sum, room) => sum + Number(room.price),
        0
    );

    const discount = rooms.reduce(
        (sum, room) => sum + Number(room.discount),
        0
    );

    const subTotal = roomRent - discount;

    const taxPayable = rooms.reduce(
        (sum, room) => {
            const taxable = room.price - room.discount;
            return sum + (taxable * room.tax) / 100;
        },
        0
    );

    const grandTotal = subTotal + taxPayable;

    return (

        <div className="form-card">

            <h3>💰 Bill Summary</h3>

            <div className="bill-summary">

                <div className="bill-row">
                    <span>Room Rent</span>
                    <span>₹{roomRent.toFixed(2)}</span>
                </div>

                <div className="bill-row">
                    <span>Total Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                </div>

                <div className="bill-row">
                    <span>Sub Total</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                </div>

                <div className="bill-row">
                    <span>Tax Payable</span>
                    <span>₹{taxPayable.toFixed(2)}</span>
                </div>

                <div className="bill-row total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                </div>

            </div>

        </div>

    );

};

export default BillSummary;