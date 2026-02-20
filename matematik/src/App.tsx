import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import WorldSelect from './components/WorldSelect';
import WorldMap from './components/WorldMap';
import TopicInstruction from './components/TopicInstruction';
import TopicExercise from './components/TopicExercise';
import TopicResult from './components/TopicResult';
import StudentResults from './components/StudentResults';
import Achievements from './components/Achievements';
import TeacherLogin from './components/TeacherLogin';
import TeacherView from './components/TeacherView';
import QuickDrill from './components/QuickDrill';
import ErrorBankView from './components/ErrorBankView';
import QuestView from './components/QuestView';
import CollectionView from './components/CollectionView';

function AppInner() {
  const { currentView, selectedTopic } = useApp();
  switch (currentView) {
    case 'login':             return <Login />;
    case 'dashboard':         return <WorldSelect />;
    case 'world-dino':        return <WorldMap worldId="dino" />;
    case 'world-fantasy':     return <WorldMap worldId="fantasy" />;
    case 'world-scifi':       return <WorldMap worldId="scifi" />;
    case 'world-gym':         return <WorldMap worldId="gym" />;
    case 'topic-instruction': return selectedTopic ? <TopicInstruction topic={selectedTopic} /> : <WorldSelect />;
    case 'topic-exercise':    return selectedTopic ? <TopicExercise topic={selectedTopic} /> : <WorldSelect />;
    case 'topic-result':      return selectedTopic ? <TopicResult topic={selectedTopic} /> : <WorldSelect />;
    case 'quick-drill':       return <QuickDrill />;
    case 'error-bank':        return <ErrorBankView />;
    case 'quest':             return <QuestView />;
    case 'collection':        return <CollectionView />;
    case 'my-results':        return <StudentResults />;
    case 'achievements':      return <Achievements />;
    case 'teacher-login':     return <TeacherLogin />;
    case 'teacher':           return <TeacherView />;
    default:                  return <Login />;
  }
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
