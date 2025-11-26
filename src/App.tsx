import Wizard from './components/Wizard'
import { FormProvider } from './context/FormContext'

function App() {
  return (
    <main className="min-h-screen w-full bg-[rgba(0,0,0,0.55)] backdrop-blur-sm">
      <div className="min-h-screen mx-auto flex flex-col items-stretch justify-start px-0 py-0 sm:px-6 sm:py-10">
        <FormProvider>
          <Wizard />
        </FormProvider>
      </div>
    </main>
  )
}

export default App
