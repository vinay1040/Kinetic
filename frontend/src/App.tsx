import { AppProviders } from "./app/providers/AppProviders";
import { AppRouter } from "./app/router/AppRouter";

const App = () => {
  return (
    <AppProviders>
      <div className="bg-blue-25">
        <AppRouter/>
      </div>
    </AppProviders>
  );
};

export default App;
