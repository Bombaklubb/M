import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TopicInstruction from './components/TopicInstruction';
import TopicExercise from './components/TopicExercise';
import TopicResult from './components/TopicResult';
import StudentResults from './components/StudentResults';
import Achievements from './components/Achievements';
import TeacherLogin from './components/TeacherLogin';
import TeacherView from './components/TeacherView';

function AppInner() {
  const { currentView, selectedTopic } = useApp();

  switch (currentView) {
    case 'login':
      return <Login />;
    case 'dashboard':
      return <Dashboard />;
    case 'topic-instruction':
      return selectedTopic ? <TopicInstruction topic={selectedTopic} /> : <Dashboard />;
    case 'topic-exercise':
      return selectedTopic ? <TopicExercise topic={selectedTopic} /> : <Dashboard />;
    case 'topic-result':
      return selectedTopic ? <TopicResult topic={selectedTopic} /> : <Dashboard />;
    case 'my-results':
      return <StudentResults />;
    case 'achievements':
      return <Achievements />;
    case 'teacher-login':
      return <TeacherLogin />;
    case 'teacher':
      return <TeacherView />;
    default:
      return <Login />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
