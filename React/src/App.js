import './App.css';
import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MedicineBoxOutlined,
  FileOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  MailOutlined ,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentsMainPage from './features/Student/StudentMainPage';
import FilieresMainPage from './features/Filiere/FiliereMainPage';
import RolesMainPage from './features/Role/RolesMainPage';
import StudentsByFilieresMainPage from './features/StudentsByFiliere/StudentsByFiliereMainPage';
import RoleAttributionsMainPage from './features/RoleAttribution/RoleAttributionMainPage';
const { Sider } = Layout;
const { Content } = Layout;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      width={200}
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
    >

      <Menu mode="vertical" >
        <Menu.Item key="1" icon={<MailOutlined />}>
          <Link to="/students">Students</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<MailOutlined />}>
          <Link to="/filieres">Filières</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<MailOutlined />}>
          <Link to="/roles">Roles</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<MailOutlined />}>
          <Link to="/studentsByFiliere">Students By Filiere</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<MailOutlined />}>
          <Link to="/role-attribution">Attribution de roles</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/students" element={<StudentsMainPage />} />
              <Route path="/filieres" element={<FilieresMainPage />} />
              <Route path="/roles" element={<RolesMainPage />} />
              <Route path="/studentsByFiliere" element={<StudentsByFilieresMainPage />} />
              <Route path="/role-attribution" element={<RoleAttributionsMainPage />} />
              <Route path="/" element={<StudentsMainPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
    // <Test></Test>
  );
}

export default App;
