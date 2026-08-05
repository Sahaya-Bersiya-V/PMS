import "./StatCard.css";

const StatCard = ({ title, value, trend, trendType, icon: Icon,color }) => {
  return (
    <div className="stat-card" style={{borderTopColor: color}}>
      <div className="stat-card-top">
         <div className="stat-card-info">
        <div>
          <h4>{title}</h4>
          <h2>{value}</h2>
        
        <div
className={`trend ${trendType}`}
>
    {trendType==="up" ? "▲":"▼"} {trend}
</div>
</div>
</div>

        <div className="stat-icon" style={{
            background: `${color}20`,
            color,
        }}>
          <Icon />
        </div>
      </div>

     
    </div>
  );
};

export default StatCard;