import './Header.css'
import musicIcon from "../../assets/musicIcon.png"


const Header = () => {
    return (
        <header>
            <img src={musicIcon} alt="musicIcon" className="app-icon"/>
            <h2 className='app-title' data-testid="tracks-header">Track list</h2>
        </header>
    )
}

export default Header;