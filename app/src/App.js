import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Appartment from "./components/Appartment";

function App() {
    const [appartments, setAppartments] = useState([]);

    useEffect(() => {
        async function getAppartmentsFromDB() {
            const appartments = await axios.get('http://192.168.178.171:3000/appartments').then(
                function (response) {
                    return response.data.sort(compareDate);
                }
            );
            setAppartments(appartments);
        }

        async function setNewAppartmentViewed(){
            await axios.put('http://192.168.178.1713000/appartments/viewed');
        }

        if(appartments.length === 0){
            getAppartmentsFromDB().then(() => setNewAppartmentViewed());
        }
    }, [appartments.length]);

    return (
        <div style={styles.root}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 className="title">ENSCHEDE SOCIAL HOUSING SCRAPER</h1>
                </div>
                <div style={styles.appartments}>
                    {
                        appartments.map((appartment, index) => (
                            <Appartment appartment={appartment} key={index}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

function compareDate(a, b){
    const aDate = new Date(a.drawingdate);
    const bDate = new Date(b.drawingdate);
    if(aDate > bDate){
        return -1;
    } else if (aDate < bDate){
        return 1;
    } else {
        return 0;
    }
}

const styles = {
    root: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flex: 1,
    },
    container: {
        marginLeft: '16%',
        marginRight: '16%',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        fontFamily: 'Coolvetica',
        display: 'flex',
        alignItems: 'center',
        color: '#F2F2F2'
    },
    appartments: {
        display: 'flex',
        flex: 1,
        flexWrap: 'wrap',
    }
};

export default App;
