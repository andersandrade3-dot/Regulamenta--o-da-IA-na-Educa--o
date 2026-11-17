import React from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { MissionProvider, useMission } from './context/MissionContext';
import { AppHeader } from './components/layout/AppHeader';
import { ReferenceDrawer } from './components/layout/ReferenceDrawer';
import { StepNavigation } from './components/layout/StepNavigation';
import { CompletionScreen } from './components/stages/CompletionScreen';
import { IdentificationScreen } from './components/stages/IdentificationScreen';
import { Stage1Context } from './components/stages/Stage1Context';
import { Stage2NotebookLM } from './components/stages/Stage2NotebookLM';
import { Stage3EthicsCenter } from './components/stages/Stage3EthicsCenter';
import { Stage4PhysicsLab } from './components/stages/Stage4PhysicsLab';
import { Stage5FinalChallenge } from './components/stages/Stage5FinalChallenge';
import { Stage6Essays } from './components/stages/Stage6Essays';

const MissionShell: React.FC = () => {
  const { session, viewMode, activeStage, setReferenceDrawerOpen } = useMission();

  const renderStage = () => {
    switch (activeStage) {
      case 1:
        return <Stage1Context />;
      case 2:
        return <Stage2NotebookLM />;
      case 3:
        return <Stage3EthicsCenter />;
      case 4:
        return <Stage4PhysicsLab />;
      case 5:
        return <Stage5FinalChallenge />;
      case 6:
        return <Stage6Essays />;
      default:
        return <Stage1Context />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col mec-grid-bg overflow-x-clip">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <AppHeader />

      <main id="main-content" tabIndex={-1} className="flex-1 pb-14 focus:outline-none">
        {!session || viewMode === 'identification' ? (
          <IdentificationScreen />
        ) : viewMode === 'completion' ? (
          <CompletionScreen />
        ) : (
          <div className="mx-auto max-w-5xl px-4 pt-6">
            <StepNavigation />
            {renderStage()}
          </div>
        )}
      </main>

      <footer className="no-print border-t border-[#D7DCE6] bg-white/95 py-5 text-xs text-[#525866]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-[#183EFF]">IA, Educação e Responsabilidade</strong> • Informática Aplicada ao Ensino de
            Física (IFCE) • Fundamentada no documento orientador do Ministério da Educação (2026).
          </p>
          <button
            type="button"
            onClick={() => setReferenceDrawerOpen(true)}
            className="self-start sm:self-auto font-bold text-[#183EFF] hover:underline cursor-pointer"
          >
            Abrir Biblioteca de Referências
          </button>
        </div>
      </footer>

      <ReferenceDrawer />
    </div>
  );
};

export function App() {
  return (
    <AccessibilityProvider>
      <MissionProvider>
        <MissionShell />
      </MissionProvider>
    </AccessibilityProvider>
  );
}

export default App;

