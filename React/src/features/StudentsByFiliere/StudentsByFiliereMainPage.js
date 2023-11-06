import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Select, Table } from 'antd';

const StudentsByFilieresMainPage = () => {
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [studentsByFilieresData, setStudentsByFilieresData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    
    const fetchFilieres = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/v1/filieres');
        return response.data;
      } catch (error) {
        console.error('Error fetching filières:', error);
        setIsError(true);
        return [];
      }
    };

    

    fetchFilieres()
      .then((data) => {
        setFiliereOptions(data);
      })
      .catch((error) => {
        console.error('Error fetching filières:', error);
      });
  }, []);

  const [filiereOptions, setFiliereOptions] = useState([]);

  const fetchStudentsByFiliere = async (selectedFiliere) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/student/filiere/${selectedFiliere}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students by filière:', error);
      setIsError(true);
      return [];
    }
  };

  const handleFiliereSelect = (value) => {
    setSelectedFiliere(value);
    console.log(selectedFiliere)

    if (value) {
      setIsLoading(true);

      fetchStudentsByFiliere(value)
        .then((data) => {
          setStudentsByFilieresData(data);
        })
        .catch((error) => {
          console.error('Error fetching students by filière:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const columns = [
    // Define your table columns here
    // Example: { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Filiere',
      key: 'filiereLibelle',
      render: (record) => (record.filiere && record.filiere.libelle) || 'N/A',
    },
  ];

  return (
    <div style={{ padding: '20px 90px' }}>
      <h1>ETUDIANTS PAR FILIERE</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Select
          style={{ width: 400, marginRight: '10px' }}
          placeholder="Filière"
          value={selectedFiliere}
          onChange={handleFiliereSelect}
        >
          {filiereOptions.map((filiere) => (
            <Select.Option key={filiere.id} value={filiere.id}>
              {filiere.libelle}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <Table
          bordered
          rowClassName={() => 'rowClassName1'}
          dataSource={studentsByFilieresData}
          columns={columns}
          loading={isLoading}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default StudentsByFilieresMainPage;
