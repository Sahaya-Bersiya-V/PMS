import "./StatusLegend.css";

const StatusLegend = () => {
  return (
    <div className="status-legend">

      <div className="legend-item">
        <span className="dot available"></span>
        Available
      </div>

      <div className="legend-item">
        <span className="dot occupied"></span>
        Occupied
      </div>

      <div className="legend-item">
        <span className="dot cleaning"></span>
        Needs Cleaning
      </div>

    </div>
  );
};

export default StatusLegend;