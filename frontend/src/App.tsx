import { BrowserRouter } from "react-router";
import { AppProviders } from "./app/providers/AppProviders";
import { AppRouter } from "./app/router/AppRouter";

const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="bg-background ">
          <AppRouter />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
};

export default App;
