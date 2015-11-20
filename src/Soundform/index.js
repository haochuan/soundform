import reactor from '../reactor';
import Soundform from './components/Soundform';
import SoundFormStore from './stores/SoundFormStore';

reactor.registerStores({
    'soundform': SoundFormStore
});

export default Soundform;