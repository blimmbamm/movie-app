import "./Card.css";

function Card({children, className, onMouseEnter, onMouseLeave }){  
    return <div className={`card ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
    </div>
}

export default Card;