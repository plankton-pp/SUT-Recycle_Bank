import './assets/css/App.css';
import '../src/assets/css/style.css'
import Routes from './route/Routes';
import { ContainerFixed } from './components/styles/globalStyles';


function App() {
  return (
    <>
      <ContainerFixed>
        <Routes />
      </ContainerFixed>
    </>
  );
}

export default App;
