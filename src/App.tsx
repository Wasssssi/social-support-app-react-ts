import Wizard from './components/Wizard'
import { FormProvider } from './context/FormContext'

function App() {
  return (
    <main className="min-h-screen w-full bg-[rgba(0,0,0,0.55)] backdrop-blur-sm">
      <div className="min-h-screen mx-auto flex items-center justify-center px-4 py-10 sm:px-6">
        <FormProvider>
          <Wizard />
        </FormProvider>
      </div>
    </main>
  )
}

export default App
