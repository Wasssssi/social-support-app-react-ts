import Wizard from './components/Wizard'
import { FormProvider } from './context/FormContext'

function App() {
  return (
    <main className="max-w-[1080px] mx-auto px-4 py-8 md:px-8 md:py-12 md:pb-24">
      <FormProvider>
        <Wizard />
      </FormProvider>
    </main>
  )
}

export default App
