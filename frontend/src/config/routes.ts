import Home from "../components/home";
import Register from "../components/signup";
import Login from "../components/login";
import Create from "../components/create";
import Detail from "../components/detail";
import Play from "../components/play";
import Plays from "../components/plays";

export type RouteType = {
  path: string;
  component: any; 
  isPrivate: boolean;
  guest?: boolean;
};

const routes: RouteType[] = [
  {
    path: '/register',
    component: Register,
    isPrivate: false,
    guest: true,
  },
  {
    path: '/login',
    component: Login,
    isPrivate: false,
    guest: true,
  },
  {
    path: '/create',
    component: Create,
    isPrivate: true,
  },
  {
    path: '/play/:id',
    component: Play,
    isPrivate: true,
  },
  {
    path: '/plays',
    component: Plays,
    isPrivate: true,
  },
  {
    path: '/decks/:id',
    component: Detail,
    isPrivate: true,
  },
  {
    path: '/',
    component: Home,
    isPrivate: true,
  },
];

export default routes;