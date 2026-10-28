import PhrasebookApp from '@/app/PhrasebookApp';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';

const App = () =>
  window.location.pathname === '/privacy' ? (
    <PrivacyPolicyPage />
  ) : (
    <PhrasebookApp />
  );

export default App;
