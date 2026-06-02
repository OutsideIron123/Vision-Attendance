import { useState,useEffect,useCallback } from 'react';
import { Link,useParams,useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const [studata , setStudata] = useState("")
    const [errmsg, setErrmsg] = useState("Loading...")

    const StudentTable = ({ data }) => {
        return (
            <table border="1" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <thead>
                <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                <tr key={item.sid || item.id}>
                    <td>{item.sid || item.id}</td>
                    <td>{item.sfname}</td>
                    <td>{item.slname}</td>
                </tr>
                ))}
            </tbody>
            </table>
        );
    };
    useEffect(() => {
        const fetchdetails = async () => {
            try {    
                const response = await fetch("http://${API_BASE_URL}/new/search/");
                const res = await response.json();
                setStudata(res.studetails)
            } catch (err) {
                setErrmsg("Record Retrieval Failure : " + err)
        }}
        fetchdetails();
    });
    return(
        <div>
            <h1>Student Details</h1>
            {studata?.length > 0 ? (
                <StudentTable data={studata} />
            ) : (
                <h2>{errmsg}</h2>
            )}
        </div>
    )
};
export default Search