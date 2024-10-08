import Image from "next/image";
import localFont from "next/font/local";
import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Tabs, Tab, Grid, ThemeProvider, createTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [task, setTask] = useState('');
  const [folders, setFolders] = useState({ Work: [], Personal: [] });
  const [activeTab, setActiveTab] = useState('Work');
  const [newTabName, setNewTabName] = useState('');
  const [showNewTabInput, setShowNewTabInput] = useState(false); // 새로운 탭 이름 입력 필드 표시 여부
  const [deleteTab, setDeleteTab] = useState(null); // 삭제할 탭 이름

  // 로컬 스토리지에서 폴더 데이터를 불러옵니다.
  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem('folders'));
    if (storedFolders) {
      setFolders(storedFolders);
    }
  }, []);

  // 할 일을 추가할 때 로컬 스토리지에 저장합니다.
  const addTask = () => {
    if (task) {
      const newFolders = { ...folders, [activeTab]: [...folders[activeTab], task] };
      setFolders(newFolders);
      localStorage.setItem('folders', JSON.stringify(newFolders)); // 로컬 스토리지에 저장
      setTask('');
    }
  };

  // 할 일을 삭제할 때 로컬 스토리지에서 업데이트합니다.
  const removeTask = (index) => {
    const newTasks = folders[activeTab].filter((_, i) => i !== index);
    const newFolders = { ...folders, [activeTab]: newTasks };
    setFolders(newFolders);
    localStorage.setItem('folders', JSON.stringify(newFolders)); // 로컬 스토리지에 저장
  };

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 새로운 탭 추가 핸들러
  const addNewTab = () => {
    if (newTabName && !folders[newTabName]) {
      const newFolders = { ...folders, [newTabName]: [] };
      setFolders(newFolders);
      localStorage.setItem('folders', JSON.stringify(newFolders)); // 로컬 스토리지에 저장
      setActiveTab(newTabName); // 새로 추가한 탭으로 활성화
      setNewTabName('');
      setShowNewTabInput(false); // 입력 필드 숨기기
    }
  };

  // + 버튼 클릭 핸들러
  const handleAddTabClick = () => {
    setShowNewTabInput(true); // 입력 필드 표시
  };

  // 탭 삭제 핸들러
  const removeTab = (tabName) => {
    const newFolders = { ...folders };
    delete newFolders[tabName]; // 해당 탭 삭제
    setFolders(newFolders);
    localStorage.setItem('folders', JSON.stringify(newFolders)); // 로컬 스토리지에 저장
    if (activeTab === tabName) {
      setActiveTab(Object.keys(newFolders)[0] || ''); // 첫 번째 탭으로 활성화
    }
  };

  // 탭 더블 클릭 핸들러
  const handleTabDoubleClick = (tabName) => {
    setDeleteTab(tabName); // 삭제할 탭 이름 설정
  };

  // 삭제 확인 핸들러
  const confirmDeleteTab = () => {
    if (deleteTab) {
      removeTab(deleteTab);
      setDeleteTab(null); // 삭제 후 초기화
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h1 style={{ textAlign: 'center' }}>Sung's ToDo</h1>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable" // 스크롤 가능하게 설정
          scrollButtons="auto" // 자동으로 스크롤 버튼 표시
        >
          {Object.keys(folders).map((folder) => (
            <Tab 
              key={folder} 
              label={folder} 
              value={folder} 
              onDoubleClick={() => handleTabDoubleClick(folder)} // 더블 클릭 핸들러 추가
            />
          ))}
          <Tab label="+" onClick={handleAddTabClick} />
        </Tabs>
        {showNewTabInput && (
          <div>
            <TextField 
              label="New Tab Name" 
              variant="outlined" 
              value={newTabName} 
              onChange={(e) => setNewTabName(e.target.value)} 
              style={{ marginTop: '10px', marginRight: '10px' }} 
            />
            <Button variant="contained" color="secondary" onClick={addNewTab}>Add Tab</Button>
          </div>
        )}
        <TextField 
          label="Add a new task" 
          variant="outlined" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          style={{ marginRight: '10px' }} 
        />
        <Button variant="contained" color="primary" onClick={addTask}>Add</Button>
        <List>
          {folders[activeTab] && folders[activeTab].map((t, index) => (
            <ListItem key={index}>
              <ListItemText primary={t} />
              <ListItemSecondaryAction>
                <Button variant="outlined" color="secondary" onClick={() => removeTask(index)} startIcon={<DeleteIcon />}>Remove</Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {/* 삭제 확인 */}
        {deleteTab && (
          <div style={{ marginTop: '20px' }}>
            <p>Are you sure you want to delete the tab "{deleteTab}"?</p>
            <Button variant="contained" color="secondary" onClick={confirmDeleteTab}>Yes, Delete</Button>
            <Button variant="outlined" onClick={() => setDeleteTab(null)}>Cancel</Button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}