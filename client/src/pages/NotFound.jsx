import { Link } from 'react-router-dom';
import TyreImage from '../components/TyreImage.jsx';

export default function NotFound() {
  return (
    <div className="container page narrow center">
      <div className="not-found">
        <TyreImage brand="michelin" terrain="Mud Terrain" size={140} />
        <h1>Looks like a flat</h1>
        <p className="muted">We couldn't find the page you were looking for.</p>
        <div className="actions-row">
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/tyres" className="btn btn-outline">Browse tyres</Link>
        </div>
      </div>
    </div>
  );
}
