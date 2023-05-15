import { useKeycloak } from "@react-keycloak/web";
import Accueil from '../pages/Accueil';
/**
 * @param roles 
 * @param children
 * @returns children 
 */
const PrivateRoute = ({ roles = '', children }) => {

  roles === '' ? roles = 'default-roles-bewebcademy' : roles = roles;

  const { keycloak } = useKeycloak();
  
  const isLoggedIn = keycloak.authenticated;
  const hasRole = keycloak.hasRealmRole(roles);
  const localrole = localStorage.getItem('role');

  if (localrole === null) {
    return <Accueil />
  }else{
    return isLoggedIn && hasRole ? children : null;
  }
};

export default PrivateRoute;